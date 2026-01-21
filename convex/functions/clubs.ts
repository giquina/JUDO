import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// CLUB QUERIES
// ============================================================================

// Get all clubs (for platform admin or marketplace)
export const getAll = query({
  args: {
    status: v.optional(v.union(
      v.literal("trial"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("cancelled")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("clubs");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("planTier"), args.status));
    }

    query = query.filter((q) => q.eq(q.field("active"), true)).order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

// Get club by ID
export const getById = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.clubId);
  },
});

// Get club by slug (for public pages)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clubs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Search clubs (for marketplace discovery)
export const search = query({
  args: {
    query: v.string(),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let clubs = await ctx.db
      .query("clubs")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Filter by search query (name or city)
    if (args.query) {
      const searchLower = args.query.toLowerCase();
      clubs = clubs.filter(
        (club) =>
          club.name.toLowerCase().includes(searchLower) ||
          club.city.toLowerCase().includes(searchLower)
      );
    }

    // Filter by city
    if (args.city) {
      clubs = clubs.filter((club) => club.city === args.city);
    }

    // Filter by country
    if (args.country) {
      clubs = clubs.filter((club) => club.country === args.country);
    }

    // Limit results
    if (args.limit) {
      clubs = clubs.slice(0, args.limit);
    }

    return clubs;
  },
});

// Get club stats (for admin dashboard)
export const getStats = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    // Get member count
    const members = await ctx.db
      .query("clubMembers")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const activeMembers = members.filter((m) => m.membershipStatus === "active");
    const judokaCount = members.filter((m) => m.role === "judoka").length;
    const senseiCount = members.filter(
      (m) => m.role === "sensei" || m.role === "head_sensei"
    ).length;

    // Get class count
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Get this month's revenue
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_clubId", (q) => q.eq("clubId", args.clubId))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), monthStart),
          q.eq(q.field("status"), "succeeded")
        )
      )
      .collect();

    const monthlyRevenue = payments.reduce((sum, p) => sum + p.netAmount, 0);

    return {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      judokaCount,
      senseiCount,
      totalClasses: classes.length,
      monthlyRevenue: monthlyRevenue / 100, // Convert pence to pounds
    };
  },
});

// ============================================================================
// CLUB MUTATIONS
// ============================================================================

// Create new club (onboarding)
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    email: v.string(),
    city: v.string(),
    country: v.string(),
    timezone: v.string(),
    ownerUserId: v.string(),
    ownerName: v.string(),
    ownerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if slug is already taken
    const existingClub = await ctx.db
      .query("clubs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingClub) {
      throw new Error("Club slug already exists");
    }

    // Create club
    const clubId = await ctx.db.insert("clubs", {
      name: args.name,
      slug: args.slug,
      email: args.email,
      city: args.city,
      country: args.country,
      timezone: args.timezone,
      currency: "GBP",
      platformCommissionRate: 12, // 12% default
      planTier: "trial",
      trialEndsAt: now + 14 * 24 * 60 * 60 * 1000, // 14 days
      stripeAccountStatus: "pending",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create club owner as first member
    await ctx.db.insert("clubMembers", {
      clubId,
      userId: args.ownerUserId,
      email: args.ownerEmail,
      name: args.ownerName,
      role: "club_owner",
      currentBelt: "1st_dan", // Default for owner (likely experienced)
      membershipStatus: "active",
      membershipTier: "unlimited",
      joinDate: now,
      totalSessions: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return { clubId, slug: args.slug };
  },
});

// Update club
export const update = mutation({
  args: {
    clubId: v.id("clubs"),
    name: v.optional(v.string()),
    dojoName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postcode: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    description: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clubId, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(clubId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Update club Stripe account
export const updateStripeAccount = mutation({
  args: {
    clubId: v.id("clubs"),
    stripeAccountId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("restricted"),
      v.literal("disabled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.clubId, {
      stripeAccountId: args.stripeAccountId,
      stripeAccountStatus: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Update club subscription status
export const updateSubscription = mutation({
  args: {
    clubId: v.id("clubs"),
    planTier: v.union(
      v.literal("trial"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      planTier: args.planTier,
      updatedAt: Date.now(),
    };

    // If moving from trial to active, set subscription start date
    if (args.planTier === "active") {
      updates.subscriptionStartedAt = Date.now();
    }

    return await ctx.db.patch(args.clubId, updates);
  },
});

// Deactivate club (soft delete)
export const deactivate = mutation({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.clubId, {
      active: false,
      updatedAt: Date.now(),
    });
  },
});
