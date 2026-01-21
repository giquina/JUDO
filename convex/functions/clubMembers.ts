import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// CLUB MEMBER QUERIES (Judoka Management)
// ============================================================================

// Get all members (judoka) for a club
export const getAll = query({
  args: {
    clubId: v.id("clubs"),
    role: v.optional(v.union(
      v.literal("club_owner"),
      v.literal("head_sensei"),
      v.literal("sensei"),
      v.literal("sempai"),
      v.literal("front_desk"),
      v.literal("judoka")
    )),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
      v.literal("trial")
    )),
  },
  handler: async (ctx, args) => {
    let members = await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) => q.eq(q.field("active"), true))
      .order("desc")
      .collect();

    // Filter by role if specified
    if (args.role) {
      members = members.filter((m) => m.role === args.role);
    }

    // Filter by status if specified
    if (args.status) {
      members = members.filter((m) => m.membershipStatus === args.status);
    }

    return members;
  },
});

// Get member by ID
export const getById = query({
  args: { memberId: v.id("clubMembers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.memberId);
  },
});

// Get member by userId within a club
export const getByUserId = query({
  args: {
    clubId: v.id("clubs"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId_userId", (q) =>
        q.eq("clubId", args.clubId).eq("userId", args.userId)
      )
      .first();
  },
});

// Get all judoka (regular members) for a club
export const getAllJudoka = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId_role", (q) =>
        q.eq("clubId", args.clubId).eq("role", "judoka")
      )
      .filter((q) => q.eq(q.field("active"), true))
      .order("desc")
      .collect();
  },
});

// Get all sensei (instructors) for a club
export const getAllSensei = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    return members.filter(
      (m) => m.role === "sensei" || m.role === "head_sensei"
    );
  },
});

// Get member's attendance history with details
export const getMemberAttendance = query({
  args: {
    judokaId: v.id("clubMembers"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const attendanceRecords = await ctx.db
      .query("attendance")
      .withIndex("by_judokaId", (q) => q.eq("judokaId", args.judokaId))
      .order("desc")
      .take(args.limit || 50);

    // Enrich with class details
    const enriched = await Promise.all(
      attendanceRecords.map(async (record) => {
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

// Get member's belt progression history
export const getBeltProgressions = query({
  args: { judokaId: v.id("clubMembers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("beltProgressions")
      .withIndex("by_judokaId", (q) => q.eq("judokaId", args.judokaId))
      .order("desc")
      .collect();
  },
});

// Get active members count by belt rank
export const getMembersByBelt = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId_status", (q) =>
        q.eq("clubId", args.clubId).eq("membershipStatus", "active")
      )
      .collect();

    // Group by belt
    const beltCounts: Record<string, number> = {};
    members.forEach((m) => {
      beltCounts[m.currentBelt] = (beltCounts[m.currentBelt] || 0) + 1;
    });

    return beltCounts;
  },
});

// ============================================================================
// CLUB MEMBER MUTATIONS
// ============================================================================

// Add new member (judoka) to club
export const create = mutation({
  args: {
    clubId: v.id("clubs"),
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    dateOfBirth: v.optional(v.number()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("club_owner"),
      v.literal("head_sensei"),
      v.literal("sensei"),
      v.literal("sempai"),
      v.literal("front_desk"),
      v.literal("judoka")
    ),
    currentBelt: v.union(
      v.literal("6th_kyu"),
      v.literal("5th_kyu"),
      v.literal("4th_kyu"),
      v.literal("3rd_kyu"),
      v.literal("2nd_kyu"),
      v.literal("1st_kyu"),
      v.literal("1st_dan"),
      v.literal("2nd_dan"),
      v.literal("3rd_dan"),
      v.literal("4th_dan"),
      v.literal("5th_dan"),
      v.literal("6th_dan"),
      v.literal("7th_dan"),
      v.literal("8th_dan"),
      v.literal("9th_dan"),
      v.literal("10th_dan")
    ),
    membershipTier: v.optional(v.union(
      v.literal("trial"),
      v.literal("student"),
      v.literal("standard"),
      v.literal("unlimited")
    )),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    medicalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists in this club
    const existing = await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId_userId", (q) =>
        q.eq("clubId", args.clubId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      throw new Error("User is already a member of this club");
    }

    return await ctx.db.insert("clubMembers", {
      clubId: args.clubId,
      userId: args.userId,
      email: args.email,
      name: args.name,
      dateOfBirth: args.dateOfBirth,
      phone: args.phone,
      emergencyContact: args.emergencyContact,
      emergencyPhone: args.emergencyPhone,
      medicalNotes: args.medicalNotes,
      role: args.role,
      currentBelt: args.currentBelt || "6th_kyu", // Default to white belt
      membershipStatus: args.membershipTier === "trial" ? "trial" : "active",
      membershipTier: args.membershipTier || "trial",
      joinDate: now,
      totalSessions: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update member details
export const update = mutation({
  args: {
    memberId: v.id("clubMembers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    medicalNotes: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { memberId, ...updates } = args;

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(memberId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Update member role (promote/demote)
export const updateRole = mutation({
  args: {
    memberId: v.id("clubMembers"),
    newRole: v.union(
      v.literal("club_owner"),
      v.literal("head_sensei"),
      v.literal("sensei"),
      v.literal("sempai"),
      v.literal("front_desk"),
      v.literal("judoka")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.memberId, {
      role: args.newRole,
      updatedAt: Date.now(),
    });
  },
});

// Update member belt rank (after grading)
export const updateBelt = mutation({
  args: {
    memberId: v.id("clubMembers"),
    newBelt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.memberId, {
      currentBelt: args.newBelt,
      lastGradingDate: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update membership status
export const updateMembershipStatus = mutation({
  args: {
    memberId: v.id("clubMembers"),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
      v.literal("trial")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.memberId, {
      membershipStatus: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Update Stripe subscription details
export const updateStripeSubscription = mutation({
  args: {
    memberId: v.id("clubMembers"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    membershipTier: v.union(
      v.literal("trial"),
      v.literal("student"),
      v.literal("standard"),
      v.literal("unlimited")
    ),
    subscriptionStartDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.memberId, {
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      membershipTier: args.membershipTier,
      membershipStatus: "active",
      subscriptionStartDate: args.subscriptionStartDate,
      updatedAt: Date.now(),
    });
  },
});

// Increment total sessions (called after attendance)
export const incrementSessions = mutation({
  args: { memberId: v.id("clubMembers") },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    return await ctx.db.patch(args.memberId, {
      totalSessions: member.totalSessions + 1,
      lastAttendance: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Deactivate member (soft delete)
export const deactivate = mutation({
  args: { memberId: v.id("clubMembers") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.memberId, {
      active: false,
      membershipStatus: "inactive",
      updatedAt: Date.now(),
    });
  },
});
