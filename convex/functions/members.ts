import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

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
    return await ctx.db.insert("members", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      beltRank: "white",
      joinDate: now,
      totalSessions: 0,
      subscriptionStatus: "inactive",
      subscriptionTier: "none",
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
