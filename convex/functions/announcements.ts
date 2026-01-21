import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get all published announcements (sorted by pinned first, then by date)
export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    // Sort: pinned first, then by creation date (newest first)
    return announcements.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Get all announcements (including drafts)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const announcements = await ctx.db.query("announcements").collect();
    return announcements.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get announcements by author
export const getByAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
      .collect();
  },
});

// Get announcements by priority
export const getByPriority = query({
  args: {
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_priority", (q) => q.eq("priority", args.priority))
      .collect();
  },
});

// Get recent announcements (last N days)
export const getRecent = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    return announcements
      .filter((a) => a.createdAt >= cutoffDate)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Create announcement
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    category: v.union(
      v.literal("general"),
      v.literal("event"),
      v.literal("training"),
      v.literal("competition"),
      v.literal("social")
    ),
    published: v.optional(v.boolean()),
    pinned: v.optional(v.boolean()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      authorId: args.authorId,
      authorName: args.authorName,
      priority: args.priority,
      category: args.category,
      published: args.published ?? false,
      pinned: args.pinned ?? false,
      expiresAt: args.expiresAt,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update announcement
export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("normal"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    category: v.optional(
      v.union(
        v.literal("general"),
        v.literal("event"),
        v.literal("training"),
        v.literal("competition"),
        v.literal("social")
      )
    ),
    published: v.optional(v.boolean()),
    pinned: v.optional(v.boolean()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Delete announcement
export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Toggle pinned status
export const togglePin = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const announcement = await ctx.db.get(args.id);
    if (!announcement) {
      throw new Error("Announcement not found");
    }

    return await ctx.db.patch(args.id, {
      pinned: !announcement.pinned,
      updatedAt: Date.now(),
    });
  },
});

// Publish announcement
export const publish = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      published: true,
      updatedAt: Date.now(),
    });
  },
});

// Unpublish announcement
export const unpublish = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      published: false,
      updatedAt: Date.now(),
    });
  },
});
