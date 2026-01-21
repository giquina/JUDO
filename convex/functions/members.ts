import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import {
  isUniversityEmail,
  extractEmailDomain,
  getEligibleTiers,
} from "./emailVerification";

// Get all members
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("members").collect();
  },
});

// Get member by user ID
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get member by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create new member
export const create = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if email is from a university
    const eligibility = getEligibleTiers(args.email);

    return await ctx.db.insert("members", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      beltRank: "white",
      joinDate: now,
      totalSessions: 0,
      subscriptionStatus: "inactive",
      subscriptionTier: "none",
      isStudent: eligibility.isStudent,
      emailVerified: true, // Email is verified through magic link
      verifiedDomain: eligibility.verifiedDomain || undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update member
export const update = mutation({
  args: {
    id: v.id("members"),
    name: v.optional(v.string()),
    beltRank: v.optional(v.union(
      v.literal("white"),
      v.literal("yellow"),
      v.literal("orange"),
      v.literal("green"),
      v.literal("blue"),
      v.literal("brown"),
      v.literal("black")
    )),
    emergencyContact: v.optional(v.string()),
    notes: v.optional(v.string()),
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

// Get active members count
export const getActiveCount = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("members")
      .withIndex("by_subscriptionStatus", (q) => q.eq("subscriptionStatus", "active"))
      .collect();
    return members.length;
  },
});

// Check tier eligibility for a given email
export const checkTierEligibility = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return getEligibleTiers(args.email);
  },
});

// Validate tier eligibility before subscription
export const validateSubscriptionTier = mutation({
  args: {
    memberId: v.id("members"),
    requestedTier: v.union(
      v.literal("student"),
      v.literal("standard"),
      v.literal("premium")
    ),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    // Check if student tier is requested but user is not a student
    if (args.requestedTier === "student" && !member.isStudent) {
      throw new Error(
        "Student tier requires a valid university email address. Please use your university email to sign up."
      );
    }

    // All other tiers are available to everyone
    return {
      allowed: true,
      tier: args.requestedTier,
      isStudent: member.isStudent,
      verifiedDomain: member.verifiedDomain,
    };
  },
});
