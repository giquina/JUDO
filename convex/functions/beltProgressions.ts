import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// BELT PROGRESSION QUERIES (Grading System)
// ============================================================================

// Get all gradings for a club
export const getAll = query({
  args: {
    clubId: v.id("clubs"),
    passed: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let progressions = await ctx.db
      .query("beltProgressions")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .order("desc")
      .collect();

    // Filter by pass/fail if specified
    if (args.passed !== undefined) {
      progressions = progressions.filter((p) => p.passed === args.passed);
    }

    // Limit results
    if (args.limit) {
      progressions = progressions.slice(0, args.limit);
    }

    // Enrich with judoka details
    const enriched = await Promise.all(
      progressions.map(async (progression) => {
        const judoka = await ctx.db.get(progression.judokaId);
        return {
          ...progression,
          judoka,
        };
      })
    );

    return enriched;
  },
});

// Get grading history for a specific judoka
export const getByJudoka = query({
  args: { judokaId: v.id("clubMembers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("beltProgressions")
      .withIndex("by_judokaId", (q) => q.eq("judokaId", args.judokaId))
      .order("desc")
      .collect();
  },
});

// Get upcoming eligible judoka for grading
export const getEligibleForGrading = query({
  args: {
    clubId: v.id("clubs"),
    minSessions: v.optional(v.number()),
    minMonths: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const minSessions = args.minSessions || 30; // Default 30 sessions
    const minMonths = args.minMonths || 3; // Default 3 months

    // Get all active judoka
    const members = await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId_status", (q) =>
        q.eq("clubId", args.clubId).eq("membershipStatus", "active")
      )
      .collect();

    // Filter eligible members
    const eligible = members.filter((member) => {
      // Must have minimum sessions
      if (member.totalSessions < minSessions) return false;

      // Check if eligible date has passed
      if (member.nextGradingEligible && member.nextGradingEligible > now) {
        return false;
      }

      // Check minimum time since last grading
      if (member.lastGradingDate) {
        const monthsSinceGrading =
          (now - member.lastGradingDate) / (1000 * 60 * 60 * 24 * 30);
        if (monthsSinceGrading < minMonths) return false;
      }

      return true;
    });

    return eligible;
  },
});

// Get grading statistics for a club
export const getStats = query({
  args: {
    clubId: v.id("clubs"),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const year = args.year || new Date().getFullYear();
    const yearStart = new Date(year, 0, 1).getTime();
    const yearEnd = new Date(year + 1, 0, 1).getTime();

    const progressions = await ctx.db
      .query("beltProgressions")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) =>
        q.and(
          q.gte(q.field("gradingDate"), yearStart),
          q.lt(q.field("gradingDate"), yearEnd)
        )
      )
      .collect();

    const totalGradings = progressions.length;
    const passed = progressions.filter((p) => p.passed).length;
    const failed = totalGradings - passed;
    const passRate = totalGradings > 0 ? (passed / totalGradings) * 100 : 0;

    // Belt distribution
    const beltCounts: Record<string, number> = {};
    progressions.forEach((p) => {
      if (p.passed) {
        beltCounts[p.toBelt] = (beltCounts[p.toBelt] || 0) + 1;
      }
    });

    return {
      totalGradings,
      passed,
      failed,
      passRate: Math.round(passRate),
      beltDistribution: beltCounts,
    };
  },
});

// ============================================================================
// BELT PROGRESSION MUTATIONS
// ============================================================================

// Record a belt grading
export const create = mutation({
  args: {
    clubId: v.id("clubs"),
    judokaId: v.id("clubMembers"),
    fromBelt: v.string(),
    toBelt: v.string(),
    examinerSenseiId: v.string(),
    passed: v.boolean(),
    score: v.optional(v.number()),
    techniquesAssessed: v.optional(v.array(v.string())),
    strengths: v.optional(v.string()),
    areasForImprovement: v.optional(v.string()),
    senseiComments: v.optional(v.string()),
    sessionsAttended: v.number(),
    minSessionsRequired: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get the judoka to calculate time since last grading
    const judoka = await ctx.db.get(args.judokaId);
    if (!judoka) {
      throw new Error("Judoka not found");
    }

    const timeSinceLastGrading = judoka.lastGradingDate
      ? (now - judoka.lastGradingDate) / (1000 * 60 * 60 * 24 * 30) // months
      : 0;

    // Create progression record
    const progressionId = await ctx.db.insert("beltProgressions", {
      clubId: args.clubId,
      judokaId: args.judokaId,
      fromBelt: args.fromBelt,
      toBelt: args.toBelt,
      gradingDate: now,
      examinerSenseiId: args.examinerSenseiId,
      passed: args.passed,
      score: args.score,
      techniquesAssessed: args.techniquesAssessed,
      strengths: args.strengths,
      areasForImprovement: args.areasForImprovement,
      senseiComments: args.senseiComments,
      sessionsAttended: args.sessionsAttended,
      minSessionsRequired: args.minSessionsRequired,
      timeSinceLastGrading,
      certificateIssued: false,
      createdAt: now,
      updatedAt: now,
    });

    // If passed, update judoka's belt rank
    if (args.passed) {
      // Calculate next grading eligibility (3 months from now)
      const nextEligible = now + 3 * 30 * 24 * 60 * 60 * 1000;

      await ctx.db.patch(args.judokaId, {
        currentBelt: args.toBelt,
        lastGradingDate: now,
        nextGradingEligible: nextEligible,
        updatedAt: now,
      });
    }

    return progressionId;
  },
});

// Update grading record (e.g., add certificate number)
export const update = mutation({
  args: {
    progressionId: v.id("beltProgressions"),
    certificateIssued: v.optional(v.boolean()),
    certificateNumber: v.optional(v.string()),
    senseiComments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { progressionId, ...updates } = args;

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(progressionId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Get belt progression requirements (helper for UI)
export const getBeltRequirements = query({
  args: { currentBelt: v.string() },
  handler: async (ctx, args) => {
    // Define belt progression requirements
    const requirements: Record<
      string,
      { nextBelt: string; minSessions: number; minMonths: number; techniques: string[] }
    > = {
      "6th_kyu": {
        // White belt
        nextBelt: "5th_kyu",
        minSessions: 20,
        minMonths: 2,
        techniques: [
          "Ukemi (breakfalls)",
          "Tai-sabaki (body movement)",
          "O-goshi (hip throw)",
          "Osoto-gari (major outer reap)",
        ],
      },
      "5th_kyu": {
        // Yellow belt
        nextBelt: "4th_kyu",
        minSessions: 25,
        minMonths: 3,
        techniques: [
          "De-ashi-barai (advanced foot sweep)",
          "Ko-uchi-gari (minor inner reap)",
          "Kesa-gatame (scarf hold)",
          "Kata-gatame (shoulder hold)",
        ],
      },
      "4th_kyu": {
        // Orange belt
        nextBelt: "3rd_kyu",
        minSessions: 30,
        minMonths: 3,
        techniques: [
          "Harai-goshi (sweeping hip throw)",
          "Uchi-mata (inner thigh throw)",
          "Yoko-shiho-gatame (side four-quarter hold)",
          "Kami-shiho-gatame (upper four-quarter hold)",
        ],
      },
      "3rd_kyu": {
        // Green belt
        nextBelt: "2nd_kyu",
        minSessions: 35,
        minMonths: 4,
        techniques: [
          "Seoi-nage (shoulder throw)",
          "Tomoe-nage (circle throw)",
          "Juji-gatame (cross armlock)",
          "Kata demonstration",
        ],
      },
      "2nd_kyu": {
        // Blue belt
        nextBelt: "1st_kyu",
        minSessions: 40,
        minMonths: 4,
        techniques: [
          "Tai-otoshi (body drop)",
          "O-uchi-gari (major inner reap)",
          "Sankaku-jime (triangle choke)",
          "Randori performance",
        ],
      },
      "1st_kyu": {
        // Brown belt
        nextBelt: "1st_dan",
        minSessions: 50,
        minMonths: 6,
        techniques: [
          "Advanced throwing techniques",
          "Newaza (groundwork) proficiency",
          "Kata: Nage-no-kata",
          "Competition experience",
        ],
      },
    };

    return requirements[args.currentBelt] || null;
  },
});
