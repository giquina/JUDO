import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import {
  canCreateGroup,
  canJoinGroup,
  canManageGroup,
  getMemberRole,
  isActiveMember,
} from "./permissions";

/**
 * Group management functions
 */

// Get all groups
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("groups").filter((q) => q.eq(q.field("active"), true)).collect();
  },
});

// Get group by ID with full details
export const getById = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) return null;

    // Get member count
    const memberships = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
      .collect();

    // Get latest message
    const latestMessage = await ctx.db
      .query("messages")
      .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .first();

    return {
      ...group,
      memberCount: memberships.length,
      latestMessage: latestMessage
        ? {
            content: latestMessage.content,
            senderName: latestMessage.senderName,
            createdAt: latestMessage.createdAt,
          }
        : null,
    };
  },
});

// Get groups by type
export const getByType = query({
  args: {
    type: v.union(
      v.literal("club-wide"),
      v.literal("sub-group"),
      v.literal("competition"),
      v.literal("class-based")
    ),
  },
  handler: async (ctx, args) => {
    const groups = await ctx.db
      .query("groups")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Enrich with member counts
    const enrichedGroups = await Promise.all(
      groups.map(async (group) => {
        const memberships = await ctx.db
          .query("groupMemberships")
          .withIndex("by_groupId", (q) => q.eq("groupId", group._id))
          .collect();

        return {
          ...group,
          memberCount: memberships.length,
        };
      })
    );

    return enrichedGroups;
  },
});

// Get groups for a specific member (their joined groups)
export const getUserGroups = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("groupMemberships")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .collect();

    const groups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId);
        if (!group || !group.active) return null;

        // Get unread message count
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", membership.groupId))
          .filter((q) =>
            membership.lastReadAt
              ? q.gt(q.field("createdAt"), membership.lastReadAt)
              : q.gt(q.field("createdAt"), 0)
          )
          .collect();

        // Get latest message
        const latestMessage = await ctx.db
          .query("messages")
          .withIndex("by_groupId_createdAt", (q) => q.eq("groupId", membership.groupId))
          .order("desc")
          .first();

        // Get member count
        const allMemberships = await ctx.db
          .query("groupMemberships")
          .withIndex("by_groupId", (q) => q.eq("groupId", membership.groupId))
          .collect();

        return {
          ...group,
          membership: {
            role: membership.role,
            joinedAt: membership.joinedAt,
            lastReadAt: membership.lastReadAt,
            notificationsEnabled: membership.notificationsEnabled,
            isMuted: membership.isMuted,
            isPinned: membership.isPinned,
          },
          unreadCount: messages.length,
          memberCount: allMemberships.length,
          latestMessage: latestMessage
            ? {
                content: latestMessage.content,
                senderName: latestMessage.senderName,
                createdAt: latestMessage.createdAt,
              }
            : null,
        };
      })
    );

    // Filter out null values and sort by pinned, then latest message
    return groups
      .filter((g) => g !== null)
      .sort((a, b) => {
        // Pinned groups first
        if (a.membership.isPinned && !b.membership.isPinned) return -1;
        if (!a.membership.isPinned && b.membership.isPinned) return 1;

        // Then by latest message
        const aTime = a.latestMessage?.createdAt || a.createdAt;
        const bTime = b.latestMessage?.createdAt || b.createdAt;
        return bTime - aTime;
      });
  },
});

// Get group members with their details
export const getMembers = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
      .collect();

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const member = await ctx.db.get(membership.memberId);
        if (!member) return null;

        return {
          ...member,
          groupRole: membership.role,
          joinedAt: membership.joinedAt,
        };
      })
    );

    return members.filter((m) => m !== null);
  },
});

// Check if user can create a group
export const checkCanCreateGroup = query({
  args: {
    memberId: v.id("members"),
    type: v.union(
      v.literal("club-wide"),
      v.literal("sub-group"),
      v.literal("competition"),
      v.literal("class-based")
    ),
  },
  handler: async (ctx, args) => {
    return await canCreateGroup(ctx, args.memberId, args.type);
  },
});

// Create a new group
export const create = mutation({
  args: {
    memberId: v.id("members"),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("club-wide"),
      v.literal("sub-group"),
      v.literal("competition"),
      v.literal("class-based")
    ),
    isPrivate: v.boolean(),
    autoJoin: v.optional(v.boolean()),
    classId: v.optional(v.id("classes")),
    settings: v.optional(
      v.object({
        allowMemberInvites: v.boolean(),
        allowFileSharing: v.boolean(),
        maxMembers: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check permissions
    const permission = await canCreateGroup(ctx, args.memberId, args.type);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot create group");
    }

    const now = Date.now();

    // Create the group
    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      type: args.type,
      createdBy: args.memberId,
      isPrivate: args.isPrivate,
      autoJoin: args.autoJoin || false,
      classId: args.classId,
      settings: args.settings,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    // Add creator as owner
    await ctx.db.insert("groupMemberships", {
      groupId,
      memberId: args.memberId,
      role: "owner",
      joinedAt: now,
      notificationsEnabled: true,
      isMuted: false,
      isPinned: false,
    });

    // If auto-join, add all active members
    if (args.autoJoin) {
      const activeMembers = await ctx.db
        .query("members")
        .withIndex("by_subscriptionStatus", (q) => q.eq("subscriptionStatus", "active"))
        .collect();

      for (const member of activeMembers) {
        if (member._id !== args.memberId) {
          await ctx.db.insert("groupMemberships", {
            groupId,
            memberId: member._id,
            role: "member",
            joinedAt: now,
            notificationsEnabled: true,
            isMuted: false,
            isPinned: false,
          });
        }
      }
    }

    // Create system message
    const creator = await ctx.db.get(args.memberId);
    await ctx.db.insert("messages", {
      groupId,
      senderId: args.memberId,
      senderName: creator?.name || "System",
      content: `${creator?.name} created this group`,
      type: "system",
      readBy: [],
      edited: false,
      deleted: false,
      createdAt: now,
    });

    return groupId;
  },
});

// Update group details
export const update = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    settings: v.optional(
      v.object({
        allowMemberInvites: v.boolean(),
        allowFileSharing: v.boolean(),
        maxMembers: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check permissions
    const permission = await canManageGroup(ctx, args.memberId, args.groupId);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot update group");
    }

    const { groupId, memberId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(groupId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });

    return groupId;
  },
});

// Delete (deactivate) a group
export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    // Check permissions
    const role = await getMemberRole(ctx, args.memberId, args.groupId);
    if (role !== "owner") {
      throw new Error("Only group owners can delete groups");
    }

    // Soft delete - set active to false
    await ctx.db.patch(args.groupId, {
      active: false,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Add member to group
export const addMember = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
    addedBy: v.id("members"),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
  },
  handler: async (ctx, args) => {
    // Check if adder has permission
    const permission = await canManageGroup(ctx, args.addedBy, args.groupId);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot add members to this group");
    }

    // Check if new member can join
    const joinPermission = await canJoinGroup(ctx, args.memberId, args.groupId);
    if (!joinPermission.allowed && joinPermission.reason !== "Already a member of this group") {
      throw new Error(joinPermission.reason || "Member cannot join this group");
    }

    // Check if already a member
    const existing = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", args.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (existing) {
      throw new Error("Member is already in this group");
    }

    const now = Date.now();

    // Add membership
    await ctx.db.insert("groupMemberships", {
      groupId: args.groupId,
      memberId: args.memberId,
      role: args.role || "member",
      joinedAt: now,
      notificationsEnabled: true,
      isMuted: false,
      isPinned: false,
    });

    // Create system message
    const newMember = await ctx.db.get(args.memberId);
    const adder = await ctx.db.get(args.addedBy);

    await ctx.db.insert("messages", {
      groupId: args.groupId,
      senderId: args.addedBy,
      senderName: adder?.name || "System",
      content: `${adder?.name} added ${newMember?.name} to the group`,
      type: "system",
      readBy: [],
      edited: false,
      deleted: false,
      createdAt: now,
    });

    return { success: true };
  },
});

// Remove member from group
export const removeMember = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
    removedBy: v.id("members"),
  },
  handler: async (ctx, args) => {
    // Check if remover has permission
    const permission = await canManageGroup(ctx, args.removedBy, args.groupId);
    if (!permission.allowed) {
      throw new Error(permission.reason || "Cannot remove members from this group");
    }

    // Cannot remove the owner
    const targetRole = await getMemberRole(ctx, args.memberId, args.groupId);
    if (targetRole === "owner") {
      throw new Error("Cannot remove the group owner");
    }

    // Find and delete membership
    const membership = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", args.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (!membership) {
      throw new Error("Member is not in this group");
    }

    await ctx.db.delete(membership._id);

    // Create system message
    const removedMember = await ctx.db.get(args.memberId);
    const remover = await ctx.db.get(args.removedBy);

    await ctx.db.insert("messages", {
      groupId: args.groupId,
      senderId: args.removedBy,
      senderName: remover?.name || "System",
      content: `${remover?.name} removed ${removedMember?.name} from the group`,
      type: "system",
      readBy: [],
      edited: false,
      deleted: false,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Update member role
export const updateMemberRole = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
    newRole: v.union(v.literal("admin"), v.literal("member")),
    updatedBy: v.id("members"),
  },
  handler: async (ctx, args) => {
    // Check if updater has permission (must be owner)
    const updaterRole = await getMemberRole(ctx, args.updatedBy, args.groupId);
    if (updaterRole !== "owner") {
      throw new Error("Only group owners can change member roles");
    }

    // Find membership
    const membership = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", args.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (!membership) {
      throw new Error("Member is not in this group");
    }

    // Cannot change owner role
    if (membership.role === "owner") {
      throw new Error("Cannot change the owner's role");
    }

    await ctx.db.patch(membership._id, {
      role: args.newRole,
    });

    return { success: true };
  },
});

// Leave group
export const leaveGroup = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    // Cannot leave if you're the owner
    const role = await getMemberRole(ctx, args.memberId, args.groupId);
    if (role === "owner") {
      throw new Error("Group owners cannot leave. Transfer ownership or delete the group.");
    }

    // Find and delete membership
    const membership = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", args.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (!membership) {
      throw new Error("You are not a member of this group");
    }

    await ctx.db.delete(membership._id);

    // Create system message
    const member = await ctx.db.get(args.memberId);

    await ctx.db.insert("messages", {
      groupId: args.groupId,
      senderId: args.memberId,
      senderName: member?.name || "Member",
      content: `${member?.name} left the group`,
      type: "system",
      readBy: [],
      edited: false,
      deleted: false,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Update group membership settings (notifications, mute, pin)
export const updateMembershipSettings = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("members"),
    notificationsEnabled: v.optional(v.boolean()),
    isMuted: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const membership = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId_memberId", (q) =>
        q.eq("groupId", args.groupId).eq("memberId", args.memberId)
      )
      .first();

    if (!membership) {
      throw new Error("You are not a member of this group");
    }

    const { groupId, memberId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(membership._id, filteredUpdates);

    return { success: true };
  },
});
