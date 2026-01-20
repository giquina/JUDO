import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get all active classes
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

// Get classes by day
export const getByDay = query({
  args: {
    dayOfWeek: v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .withIndex("by_dayOfWeek", (q) => q.eq("dayOfWeek", args.dayOfWeek))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

// Get class by ID
export const getById = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create class
export const create = mutation({
  args: {
    name: v.string(),
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
    coachId: v.string(),
    maxCapacity: v.number(),
    location: v.string(),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("mixed")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("classes", {
      ...args,
      currentAttendance: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update class
export const update = mutation({
  args: {
    id: v.id("classes"),
    name: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    maxCapacity: v.optional(v.number()),
    location: v.optional(v.string()),
    active: v.optional(v.boolean()),
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
