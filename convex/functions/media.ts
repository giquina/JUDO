import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get all media items (sorted by date, newest first)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const media = await ctx.db.query("media").collect();
    return media.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get media by category
export const getByCategory = query({
  args: {
    category: v.union(
      v.literal("training"),
      v.literal("competition"),
      v.literal("social"),
      v.literal("grading"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db
      .query("media")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return media.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get media by uploader
export const getByUploader = query({
  args: { uploadedBy: v.string() },
  handler: async (ctx, args) => {
    const media = await ctx.db
      .query("media")
      .withIndex("by_uploadedBy", (q) => q.eq("uploadedBy", args.uploadedBy))
      .collect();

    return media.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get media by event
export const getByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const media = await ctx.db
      .query("media")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();

    return media.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get recent media (last N days)
export const getRecent = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const media = await ctx.db.query("media").collect();

    return media
      .filter((item) => item.createdAt >= cutoffDate)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get media by type (image/video)
export const getByType = query({
  args: {
    mediaType: v.union(v.literal("image"), v.literal("video")),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.query("media").collect();

    return media
      .filter((item) => item.mediaType === args.mediaType)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Search media by tags
export const searchByTags = query({
  args: { tags: v.array(v.string()) },
  handler: async (ctx, args) => {
    const media = await ctx.db.query("media").collect();

    // Filter items that have at least one matching tag
    return media
      .filter((item) => {
        if (!item.tags) return false;
        return item.tags.some((tag) => args.tags.includes(tag));
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get single media item
export const getById = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create media item
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    category: v.union(
      v.literal("training"),
      v.literal("competition"),
      v.literal("social"),
      v.literal("grading"),
      v.literal("other")
    ),
    uploadedBy: v.string(),
    uploadedByName: v.string(),
    eventId: v.optional(v.id("events")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("media", {
      title: args.title,
      description: args.description,
      mediaType: args.mediaType,
      url: args.url,
      thumbnailUrl: args.thumbnailUrl,
      category: args.category,
      uploadedBy: args.uploadedBy,
      uploadedByName: args.uploadedByName,
      eventId: args.eventId,
      tags: args.tags,
      createdAt: now,
    });
  },
});

// Update media item
export const update = mutation({
  args: {
    id: v.id("media"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("training"),
        v.literal("competition"),
        v.literal("social"),
        v.literal("grading"),
        v.literal("other")
      )
    ),
    eventId: v.optional(v.id("events")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete media item
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Add tags to media item
export const addTags = mutation({
  args: {
    id: v.id("media"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) {
      throw new Error("Media item not found");
    }

    const currentTags = media.tags || [];
    const newTags = [...new Set([...currentTags, ...args.tags])]; // Remove duplicates

    return await ctx.db.patch(args.id, {
      tags: newTags,
    });
  },
});

// Remove tags from media item
export const removeTags = mutation({
  args: {
    id: v.id("media"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) {
      throw new Error("Media item not found");
    }

    const currentTags = media.tags || [];
    const newTags = currentTags.filter((tag) => !args.tags.includes(tag));

    return await ctx.db.patch(args.id, {
      tags: newTags,
    });
  },
});

// Get media statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allMedia = await ctx.db.query("media").collect();

    const stats = {
      total: allMedia.length,
      images: allMedia.filter((m) => m.mediaType === "image").length,
      videos: allMedia.filter((m) => m.mediaType === "video").length,
      byCategory: {
        training: allMedia.filter((m) => m.category === "training").length,
        competition: allMedia.filter((m) => m.category === "competition")
          .length,
        social: allMedia.filter((m) => m.category === "social").length,
        grading: allMedia.filter((m) => m.category === "grading").length,
        other: allMedia.filter((m) => m.category === "other").length,
      },
    };

    return stats;
  },
});
