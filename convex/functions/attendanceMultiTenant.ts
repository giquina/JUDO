import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// ATTENDANCE QUERIES (Multi-Tenant with Judo Terminology)
// ============================================================================

// Get attendance for a class on a specific date
export const getByClassDate = query({
  args: {
    classId: v.id("classes"),
    date: v.number(), // timestamp for start of day
  },
  handler: async (ctx, args) => {
    const dayEnd = args.date + 24 * 60 * 60 * 1000;

    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_classId", (q) => q.eq("classId", args.classId))
      .filter((q) =>
        q.and(
          q.gte(q.field("checkInTime"), args.date),
          q.lt(q.field("checkInTime"), dayEnd)
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

// Get attendance history for a judoka
export const getByJudoka = query({
  args: {
    clubId: v.id("clubs"),
    judokaId: v.id("clubMembers"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_clubId_judokaId", (q) =>
        q.eq("clubId", args.clubId).eq("judokaId", args.judokaId)
      )
      .order("desc")
      .take(args.limit || 50);

    // Enrich with class details
    const enriched = await Promise.all(
      attendance.map(async (record) => {
        const classInfo = await ctx.db.get(record.classId);
        return {
          ...record,
          class: classInfo,
        };
      })
    );

    return enriched;
  },
});

// Get all attendance for a club (for admin)
export const getAllForClub = query({
  args: {
    clubId: v.id("clubs"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let attendance = await ctx.db
      .query("attendance")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .order("desc")
      .collect();

    // Filter by date range if specified
    if (args.startDate) {
      attendance = attendance.filter((a) => a.checkInTime >= args.startDate!);
    }
    if (args.endDate) {
      attendance = attendance.filter((a) => a.checkInTime <= args.endDate!);
    }

    // Limit results
    if (args.limit) {
      attendance = attendance.slice(0, args.limit);
    }

    // Enrich with judoka and class details
    const enriched = await Promise.all(
      attendance.map(async (record) => {
        const judoka = await ctx.db.get(record.judokaId);
        const classInfo = await ctx.db.get(record.classId);
        return {
          ...record,
          judoka,
          class: classInfo,
        };
      })
    );

    return enriched;
  },
});

// Get monthly attendance count for a judoka
export const getMonthlyCount = query({
  args: {
    clubId: v.id("clubs"),
    judokaId: v.id("clubMembers"),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const year = args.year || now.getFullYear();
    const month = args.month !== undefined ? args.month : now.getMonth();

    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month + 1, 1).getTime();

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_clubId_judokaId", (q) =>
        q.eq("clubId", args.clubId).eq("judokaId", args.judokaId)
      )
      .filter((q) =>
        q.and(
          q.gte(q.field("checkInTime"), monthStart),
          q.lt(q.field("checkInTime"), monthEnd),
          q.eq(q.field("status"), "attended")
        )
      )
      .collect();

    return records.length;
  },
});

// Get attendance statistics for a club
export const getStats = query({
  args: {
    clubId: v.id("clubs"),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const year = args.year || now.getFullYear();
    const month = args.month !== undefined ? args.month : now.getMonth();

    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month + 1, 1).getTime();

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) =>
        q.and(
          q.gte(q.field("checkInTime"), monthStart),
          q.lt(q.field("checkInTime"), monthEnd)
        )
      )
      .collect();

    const totalSessions = records.length;
    const attended = records.filter((r) => r.status === "attended").length;
    const late = records.filter((r) => r.status === "late").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const excused = records.filter((r) => r.status === "excused").length;

    // Unique judoka count
    const uniqueJudoka = new Set(records.map((r) => r.judokaId)).size;

    // Attendance rate
    const attendanceRate =
      totalSessions > 0 ? (attended / totalSessions) * 100 : 0;

    // QR code usage
    const qrCheckIns = records.filter((r) => r.checkInMethod === "qr_code")
      .length;
    const qrUsageRate = totalSessions > 0 ? (qrCheckIns / totalSessions) * 100 : 0;

    return {
      totalSessions,
      attended,
      late,
      absent,
      excused,
      uniqueJudoka,
      attendanceRate: Math.round(attendanceRate),
      qrUsageRate: Math.round(qrUsageRate),
    };
  },
});

// ============================================================================
// ATTENDANCE MUTATIONS
// ============================================================================

// QR code check-in
export const checkIn = mutation({
  args: {
    clubId: v.id("clubs"),
    judokaId: v.id("clubMembers"),
    classId: v.id("classes"),
    checkInMethod: v.optional(v.union(
      v.literal("qr_code"),
      v.literal("manual"),
      v.literal("nfc"),
      v.literal("front_desk")
    )),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if already checked in today for this class
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_clubId_judokaId", (q) =>
        q.eq("clubId", args.clubId).eq("judokaId", args.judokaId)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("classId"), args.classId),
          q.gte(q.field("checkInTime"), todayStart)
        )
      )
      .first();

    if (existing) {
      return {
        success: false,
        message: "Already checked in today",
        attendanceId: existing._id,
      };
    }

    // Get class details to check capacity
    const classInfo = await ctx.db.get(args.classId);
    if (!classInfo) {
      return { success: false, message: "Class not found" };
    }

    if (classInfo.currentAttendance >= classInfo.maxCapacity) {
      return { success: false, message: "Class is at full capacity" };
    }

    // Create attendance record
    const attendanceId = await ctx.db.insert("attendance", {
      clubId: args.clubId,
      judokaId: args.judokaId,
      classId: args.classId,
      checkInTime: now,
      checkInMethod: args.checkInMethod || "qr_code",
      status: "attended",
      createdAt: now,
    });

    // Update class current attendance
    await ctx.db.patch(args.classId, {
      currentAttendance: classInfo.currentAttendance + 1,
      updatedAt: now,
    });

    // Increment judoka's total sessions
    const judoka = await ctx.db.get(args.judokaId);
    if (judoka) {
      await ctx.db.patch(args.judokaId, {
        totalSessions: judoka.totalSessions + 1,
        lastAttendance: now,
        updatedAt: now,
      });
    }

    return { success: true, attendanceId };
  },
});

// Manual attendance update (Sensei override)
export const updateStatus = mutation({
  args: {
    attendanceId: v.id("attendance"),
    status: v.union(
      v.literal("attended"),
      v.literal("absent"),
      v.literal("late"),
      v.literal("excused"),
      v.literal("cancelled")
    ),
    overrideBy: v.string(), // userId of sensei making change
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.attendanceId, {
      status: args.status,
      manualOverride: true,
      overrideBy: args.overrideBy,
      notes: args.notes,
      updatedAt: Date.now(),
    });
  },
});

// Add sensei performance notes
export const addPerformanceNotes = mutation({
  args: {
    attendanceId: v.id("attendance"),
    performanceNotes: v.string(),
    techniquesWorkedOn: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.attendanceId, {
      performanceNotes: args.performanceNotes,
      techniquesWorkedOn: args.techniquesWorkedOn,
      updatedAt: Date.now(),
    });
  },
});

// Report injury
export const reportInjury = mutation({
  args: {
    attendanceId: v.id("attendance"),
    injuryDetails: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.attendanceId, {
      injuryReported: true,
      injuryDetails: args.injuryDetails,
      updatedAt: Date.now(),
    });
  },
});

// Check out (optional)
export const checkOut = mutation({
  args: { attendanceId: v.id("attendance") },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.patch(args.attendanceId, {
      checkOutTime: now,
      updatedAt: now,
    });
  },
});

// Bulk attendance update (for manual roll call)
export const bulkUpdate = mutation({
  args: {
    clubId: v.id("clubs"),
    classId: v.id("classes"),
    judokaIds: v.array(v.id("clubMembers")),
    status: v.union(
      v.literal("attended"),
      v.literal("absent"),
      v.literal("excused")
    ),
    overrideBy: v.string(),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const checkInTime = args.date || now;

    const results = await Promise.all(
      args.judokaIds.map(async (judokaId) => {
        // Check if attendance already exists
        const existing = await ctx.db
          .query("attendance")
          .withIndex("by_clubId_judokaId", (q) =>
            q.eq("clubId", args.clubId).eq("judokaId", judokaId)
          )
          .filter((q) => q.eq(q.field("classId"), args.classId))
          .first();

        if (existing) {
          // Update existing
          return await ctx.db.patch(existing._id, {
            status: args.status,
            manualOverride: true,
            overrideBy: args.overrideBy,
            updatedAt: now,
          });
        } else {
          // Create new
          return await ctx.db.insert("attendance", {
            clubId: args.clubId,
            judokaId,
            classId: args.classId,
            checkInTime,
            checkInMethod: "manual",
            status: args.status,
            manualOverride: true,
            overrideBy: args.overrideBy,
            createdAt: now,
          });
        }
      })
    );

    return { success: true, count: results.length };
  },
});
