import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Check in to class (QR code scan)
export const checkIn = mutation({
  args: {
    memberId: v.id("members"),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if already checked in today for this class
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .filter((q) =>
        q.and(
          q.eq(q.field("classId"), args.classId),
          q.gte(q.field("checkInTime"), todayStart)
        )
      )
      .first();

    if (existing) {
      return { success: false, message: "Already checked in today" };
    }

    // Create attendance record
    const attendanceId = await ctx.db.insert("attendance", {
      memberId: args.memberId,
      classId: args.classId,
      checkInTime: now,
      status: "attended",
      createdAt: now,
    });

    // Increment member's total sessions
    const member = await ctx.db.get(args.memberId);
    if (member) {
      await ctx.db.patch(args.memberId, {
        totalSessions: member.totalSessions + 1,
        updatedAt: now,
      });
    }

    return { success: true, attendanceId };
  },
});

// Manual attendance update (coach override)
export const updateStatus = mutation({
  args: {
    id: v.id("attendance"),
    status: v.union(
      v.literal("attended"),
      v.literal("absent"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      notes: args.notes,
      manualOverride: true,
    });
  },
});

// Get attendance for a member
export const getByMember = query({
  args: {
    memberId: v.id("members"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("attendance")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

// Get attendance for a class on a specific date
export const getByClassDate = query({
  args: {
    classId: v.id("classes"),
    date: v.number(), // timestamp for start of day
  },
  handler: async (ctx, args) => {
    const dayEnd = args.date + 24 * 60 * 60 * 1000;

    return await ctx.db
      .query("attendance")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .filter((q) =>
        q.and(
          q.gte(q.field("checkInTime"), args.date),
          q.lt(q.field("checkInTime"), dayEnd)
        )
      )
      .collect();
  },
});

// Get member's sessions this month
export const getMonthlyCount = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .filter((q) =>
        q.and(
          q.gte(q.field("checkInTime"), monthStart),
          q.eq(q.field("status"), "attended")
        )
      )
      .collect();

    return records.length;
  },
});
