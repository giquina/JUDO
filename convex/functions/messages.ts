import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { canSendMessage, canModifyMessage } from "./permissions";

/**
 * Message management functions
 */

// Get messages for a group (paginated)
export const getByGroup = query({
  args: {
    groupId: v.id("groups"),
    limit: v.optional(v.number()),
    before: v.optional(v.number()), // Timestamp for pagination
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    let query = ctx.db
      .query("messages")
      .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", args.groupId));

    // Apply pagination filter if before timestamp is provided
    if (args.before) {
      query = query.filter((q) => q.lt(q.field("createdAt"), args.before));
    }

    const messages = await query.order("desc").take(limit);

    // Reverse to show oldest first
    const orderedMessages = messages.reverse();

    // Enrich messages with reply details
    const enrichedMessages = await Promise.all(
      orderedMessages.map(async (message) => {
        if (message.replyTo) {
          const replyToMessage = await ctx.db.get(message.replyTo);
          return {
            ...message,
            replyToMessage: replyToMessage
              ? {
                  _id: replyToMessage._id,
                  content: replyToMessage.content,
                  senderName: replyToMessage.senderName,
                  createdAt: replyToMessage.createdAt,
                }
              : null,
          };
        }
        return message;
      })
    );

    return enrichedMessages;
  },
});

// Get unread message count for a member across all groups
export const getUnreadCount = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("groupMemberships")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .collect();

    let totalUnread = 0;

    for (const membership of memberships) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", membership.groupId))
        .filter((q) =>
          membership.lastReadAt
            ? q.gt(q.field("createdAt"), membership.lastReadAt)
            : q.gt(q.field("createdAt"), 0)
        )
        .collect();

      totalUnread += messages.length;
    }

    return totalUnread;
  },
});

// Search messages in a group
export const search = query({
  args: {
    groupId: v.id("groups"),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    // Get all messages from the group
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", args.groupId))
      .collect();

    // Filter by search term (case-insensitive)
    const searchLower = args.searchTerm.toLowerCase();
    const filteredMessages = messages
      .filter(
        (msg) =>
          !msg.deleted &&
          (msg.content.toLowerCase().includes(searchLower) ||
            msg.senderName.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    return filteredMessages;
  },
});

// Send a message
export const send = mutation({
  args: {
    groupId: v.id("groups"),
    senderId: v.id("members"),
    content: v.string(),
    type: v.optional(v.union(v.literal("text"), v.literal("image"), v.literal("file"))),
    replyTo: v.optional(v.id("messages")),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          size: v.number(),
          mimeType: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    // Check permissions
    const permission = await canSendMessage(ctx, args.senderId, args.groupId);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot send message");
    }

    // Get sender details
    const sender = await ctx.db.get(args.senderId);
    if (!sender) {
      throw new Error("Sender not found");
    }

    const now = Date.now();

    // Create message
    const messageId = await ctx.db.insert("messages", {
      groupId: args.groupId,
      senderId: args.senderId,
      senderName: sender.name,
      content: args.content,
      type: args.type || "text",
      replyTo: args.replyTo,
      attachments: args.attachments,
      reactions: [],
      readBy: [args.senderId], // Sender has "read" their own message
      edited: false,
      deleted: false,
      createdAt: now,
    });

    return messageId;
  },
});

// Edit a message
export const edit = mutation({
  args: {
    messageId: v.id("messages"),
    memberId: v.id("members"),
    newContent: v.string(),
  },
  handler: async (ctx, args) => {
    // Check permissions
    const permission = await canModifyMessage(ctx, args.memberId, args.messageId);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot edit message");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (message.deleted) {
      throw new Error("Cannot edit a deleted message");
    }

    const now = Date.now();

    await ctx.db.patch(args.messageId, {
      content: args.newContent,
      edited: true,
      editedAt: now,
    });

    return { success: true };
  },
});

// Delete a message
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    // Check permissions
    const permission = await canModifyMessage(ctx, args.memberId, args.messageId);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot delete message");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.messageId, {
      content: "This message has been deleted",
      deleted: true,
      deletedAt: now,
    });

    return { success: true };
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
    upToTimestamp: v.optional(v.number()), // Mark all messages up to this timestamp as read
  },
  handler: async (ctx, args) => {
    // Get membership
    const membership = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", args.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (!membership) {
      throw new Error("You are not a member of this group");
    }

    const timestamp = args.upToTimestamp || Date.now();

    // Update lastReadAt in membership
    await ctx.db.patch(membership._id, {
      lastReadAt: timestamp,
    });

    // Update readBy array for messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.lte(q.field("createdAt"), timestamp))
      .collect();

    for (const message of messages) {
      if (!message.readBy.includes(args.memberId)) {
        await ctx.db.patch(message._id, {
          readBy: [...message.readBy, args.memberId],
        });
      }
    }

    return { success: true, markedCount: messages.length };
  },
});

// Add reaction to a message
export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    memberId: v.id("members"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (message.deleted) {
      throw new Error("Cannot react to a deleted message");
    }

    // Check if member is in the group
    const membership = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", message.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (!membership) {
      throw new Error("You must be a member of this group to react to messages");
    }

    // Get member details
    const member = await ctx.db.get(args.memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    const reactions = message.reactions || [];

    // Check if member already reacted with this emoji
    const existingReaction = reactions.find(
      (r) => r.memberId === args.memberId && r.emoji === args.emoji
    );

    if (existingReaction) {
      throw new Error("You have already reacted with this emoji");
    }

    // Add new reaction
    reactions.push({
      emoji: args.emoji,
      memberId: args.memberId,
      memberName: member.name,
    });

    await ctx.db.patch(args.messageId, {
      reactions,
    });

    return { success: true };
  },
});

// Remove reaction from a message
export const removeReaction = mutation({
  args: {
    messageId: v.id("messages"),
    memberId: v.id("members"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const reactions = message.reactions || [];

    // Filter out the reaction
    const updatedReactions = reactions.filter(
      (r) => !(r.memberId === args.memberId && r.emoji === args.emoji)
    );

    if (reactions.length === updatedReactions.length) {
      throw new Error("Reaction not found");
    }

    await ctx.db.patch(args.messageId, {
      reactions: updatedReactions,
    });

    return { success: true };
  },
});

// Get message by ID with full details
export const getById = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return null;

    // Get reply details if exists
    let replyToMessage = null;
    if (message.replyTo) {
      const reply = await ctx.db.get(message.replyTo);
      if (reply) {
        replyToMessage = {
          _id: reply._id,
          content: reply.content,
          senderName: reply.senderName,
          createdAt: reply.createdAt,
        };
      }
    }

    return {
      ...message,
      replyToMessage,
    };
  },
});
