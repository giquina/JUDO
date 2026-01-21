import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// CLASSES QUERIES (Multi-Tenant with Judo Terminology)
// ============================================================================

// Get all active classes for a club
export const getAll = query({
  args: {
    clubId: v.id("clubs"),
    dayOfWeek: v.optional(v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    )),
  },
  handler: async (ctx, args) => {
    let classes = await ctx.db
      .query("classes")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) =>
        q.and(
          q.eq(q.field("active"), true),
          q.neq(q.field("cancelled"), true)
        )
      )
      .order("desc")
      .collect();

    // Filter by day if specified
    if (args.dayOfWeek) {
      classes = classes.filter((c) => c.dayOfWeek === args.dayOfWeek);
    }

    // Enrich with sensei details
    const enriched = await Promise.all(
      classes.map(async (classItem) => {
        const sensei = await ctx.db
          .query("clubMembers")
          .filter((q) =>
            q.and(
              q.eq(q.field("clubId"), args.clubId),
              q.eq(q.field("userId"), classItem.senseiId)
            )
          )
          .first();

        return {
          ...classItem,
          sensei,
        };
      })
    );

    return enriched;
  },
});

// Get classes by sensei
export const getBySensei = query({
  args: {
    clubId: v.id("clubs"),
    senseiId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .withIndex("by_clubId_senseiId", (q) =>
        q.eq("clubId", args.clubId).eq("senseiId", args.senseiId)
      )
      .filter((q) => q.eq(q.field("active"), true))
      .order("desc")
      .collect();
  },
});

// Get class by ID with full details
export const getById = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      return null;
    }

    // Get sensei details
    const sensei = await ctx.db
      .query("clubMembers")
      .filter((q) =>
        q.and(
          q.eq(q.field("clubId"), classItem.clubId),
          q.eq(q.field("userId"), classItem.senseiId)
        )
      )
      .first();

    // Get assistant sensei/sempai details
    let assistants = [];
    if (classItem.assistantIds && classItem.assistantIds.length > 0) {
      assistants = await Promise.all(
        classItem.assistantIds.map(async (assistantId) => {
          return await ctx.db
            .query("clubMembers")
            .filter((q) =>
              q.and(
                q.eq(q.field("clubId"), classItem.clubId),
                q.eq(q.field("userId"), assistantId)
              )
            )
            .first();
        })
      );
    }

    return {
      ...classItem,
      sensei,
      assistants: assistants.filter(Boolean),
    };
  },
});

// Get classes by session type (e.g., all Randori classes)
export const getBySessionType = query({
  args: {
    clubId: v.id("clubs"),
    sessionType: v.union(
      v.literal("randori"),
      v.literal("kata"),
      v.literal("newaza"),
      v.literal("nage_waza"),
      v.literal("mixed"),
      v.literal("grading")
    ),
  },
  handler: async (ctx, args) => {
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    return classes.filter((c) => c.sessionType === args.sessionType);
  },
});

// Get class attendance for today
export const getTodayAttendance = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_clubId_classId", (q) => {
        const classInfo = ctx.db.get(args.classId);
        // Type-safe way to get clubId
        return q.eq("classId", args.classId);
      })
      .filter((q) =>
        q.and(
          q.gte(q.field("checkInTime"), todayStart),
          q.lt(q.field("checkInTime"), todayEnd)
        )
      )
      .collect();

    // Enrich with judoka details
    const enriched = await Promise.all(
      attendance.map(async (record) => {
        const judoka = await ctx.db.get(record.judokaId);
        return {
          ...record,
          judoka,
        };
      })
    );

    return enriched;
  },
});

// ============================================================================
// CLASSES MUTATIONS (Sensei Features)
// ============================================================================

// Create class (Sensei or Admin)
export const create = mutation({
  args: {
    clubId: v.id("clubs"),
    name: v.string(),
    sessionType: v.union(
      v.literal("randori"),
      v.literal("kata"),
      v.literal("newaza"),
      v.literal("nage_waza"),
      v.literal("mixed"),
      v.literal("grading")
    ),
    dayOfWeek: v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    ),
    startTime: v.string(),
    endTime: v.string(),
    senseiId: v.string(),
    assistantIds: v.optional(v.array(v.string())),
    maxCapacity: v.number(),
    location: v.string(),
    tatamiArea: v.optional(v.string()),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("all_levels"),
      v.literal("kids"),
      v.literal("adults")
    ),
    minBeltRequired: v.optional(v.string()),
    recurring: v.optional(v.boolean()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("classes", {
      clubId: args.clubId,
      name: args.name,
      sessionType: args.sessionType,
      dayOfWeek: args.dayOfWeek,
      startTime: args.startTime,
      endTime: args.endTime,
      recurring: args.recurring ?? true,
      senseiId: args.senseiId,
      assistantIds: args.assistantIds,
      maxCapacity: args.maxCapacity,
      currentAttendance: 0,
      level: args.level,
      minBeltRequired: args.minBeltRequired,
      location: args.location,
      tatamiArea: args.tatamiArea,
      description: args.description,
      active: true,
      cancelled: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update class
export const update = mutation({
  args: {
    classId: v.id("classes"),
    name: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    maxCapacity: v.optional(v.number()),
    location: v.optional(v.string()),
    tatamiArea: v.optional(v.string()),
    description: v.optional(v.string()),
    minBeltRequired: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { classId, ...updates } = args;

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(classId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Cancel class (with reason)
export const cancel = mutation({
  args: {
    classId: v.id("classes"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.classId, {
      cancelled: true,
      cancellationReason: args.reason,
      updatedAt: Date.now(),
    });
  },
});

// Uncancel/restore class
export const restore = mutation({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.classId, {
      cancelled: false,
      cancellationReason: undefined,
      updatedAt: Date.now(),
    });
  },
});

// Deactivate class (soft delete)
export const deactivate = mutation({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.classId, {
      active: false,
      updatedAt: Date.now(),
    });
  },
});

// Update current attendance count
export const updateAttendanceCount = mutation({
  args: {
    classId: v.id("classes"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.classId, {
      currentAttendance: args.count,
      updatedAt: Date.now(),
    });
  },
});
