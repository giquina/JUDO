import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// ANNOUNCEMENTS QUERIES
// ============================================================================

// Get all active announcements for a club
export const getAll = query({
  args: {
    clubId: v.id("clubs"),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let announcements = await ctx.db
      .query("announcements")
      .withIndex("by_clubId_publishAt", (q) =>
        q.eq("clubId", args.clubId).lte("publishAt", now)
      )
      .filter((q) => q.eq(q.field("active"), true))
      .order("desc")
      .collect();

    // Filter out expired announcements
    announcements = announcements.filter(
      (a) => !a.expiresAt || a.expiresAt > now
    );

    // Filter by priority if specified
    if (args.priority) {
      announcements = announcements.filter((a) => a.priority === args.priority);
    }

    // Sort pinned to top
    announcements.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.publishAt - a.publishAt;
    });

    // Limit results
    if (args.limit) {
      announcements = announcements.slice(0, args.limit);
    }

    return announcements;
  },
});

// Get announcement by ID
export const getById = query({
  args: { announcementId: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.announcementId);
  },
});

// Get announcements for specific audience
export const getForAudience = query({
  args: {
    clubId: v.id("clubs"),
    judokaId: v.id("clubMembers"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get the judoka to determine role and belt
    const judoka = await ctx.db.get(args.judokaId);
    if (!judoka) {
      return [];
    }

    // Get all active announcements
    const allAnnouncements = await ctx.db
      .query("announcements")
      .withIndex("by_clubId_publishAt", (q) =>
        q.eq("clubId", args.clubId).lte("publishAt", now)
      )
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Filter announcements relevant to this judoka
    const relevant = allAnnouncements.filter((announcement) => {
      // Check expiration
      if (announcement.expiresAt && announcement.expiresAt < now) {
        return false;
      }

      // Check target audience
      switch (announcement.targetAudience) {
        case "all":
          return true;

        case "judoka_only":
          return judoka.role === "judoka";

        case "sensei_only":
          return judoka.role === "sensei" || judoka.role === "head_sensei";

        case "specific_belt":
          return announcement.targetBelts?.includes(judoka.currentBelt);

        case "specific_class":
          // Would need to check if judoka attends these classes
          // For now, show to all
          return true;

        default:
          return false;
      }
    });

    // Sort pinned to top
    relevant.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.publishAt - a.publishAt;
    });

    return relevant;
  },
});

// Get urgent announcements (for notifications)
export const getUrgent = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db
      .query("announcements")
      .withIndex("by_clubId_priority", (q) =>
        q.eq("clubId", args.clubId).eq("priority", "urgent")
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("active"), true),
          q.lte(q.field("publishAt"), now)
        )
      )
      .order("desc")
      .collect();
  },
});

// ============================================================================
// ANNOUNCEMENTS MUTATIONS
// ============================================================================

// Create announcement
export const create = mutation({
  args: {
    clubId: v.id("clubs"),
    title: v.string(),
    content: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    targetAudience: v.union(
      v.literal("all"),
      v.literal("judoka_only"),
      v.literal("sensei_only"),
      v.literal("specific_belt"),
      v.literal("specific_class")
    ),
    targetBelts: v.optional(v.array(v.string())),
    targetClassIds: v.optional(v.array(v.id("classes"))),
    authorId: v.string(),
    authorRole: v.string(),
    publishAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("announcements", {
      clubId: args.clubId,
      title: args.title,
      content: args.content,
      priority: args.priority,
      targetAudience: args.targetAudience,
      targetBelts: args.targetBelts,
      targetClassIds: args.targetClassIds,
      authorId: args.authorId,
      authorRole: args.authorRole,
      publishAt: args.publishAt || now,
      expiresAt: args.expiresAt,
      pinned: args.pinned || false,
      viewCount: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update announcement
export const update = mutation({
  args: {
    announcementId: v.id("announcements"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    )),
    expiresAt: v.optional(v.number()),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { announcementId, ...updates } = args;

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(announcementId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Increment view count
export const incrementViews = mutation({
  args: { announcementId: v.id("announcements") },
  handler: async (ctx, args) => {
    const announcement = await ctx.db.get(args.announcementId);
    if (!announcement) {
      throw new Error("Announcement not found");
    }

    return await ctx.db.patch(args.announcementId, {
      viewCount: (announcement.viewCount || 0) + 1,
    });
  },
});

// Delete announcement (soft delete)
export const remove = mutation({
  args: { announcementId: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.announcementId, {
      active: false,
      updatedAt: Date.now(),
    });
  },
});
