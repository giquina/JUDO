import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get club profile (there should only be one)
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clubProfile").first();
  },
});

// Update club profile
export const update = mutation({
  args: {
    id: v.id("clubProfile"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    socialMedia: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })
    ),
    affiliations: v.optional(v.array(v.string())),
    foundedYear: v.optional(v.number()),
    logo: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
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

// Create club profile (typically only used once during setup)
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    location: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    socialMedia: v.optional(
      v.object({
        facebook: v.optional(v.string()),
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })
    ),
    affiliations: v.optional(v.array(v.string())),
    foundedYear: v.optional(v.number()),
    logo: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("clubProfile", {
      ...args,
      updatedAt: now,
    });
  },
});
