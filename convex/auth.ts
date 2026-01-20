import { query } from "./_generated/server";
import { auth } from "./auth.config";

export const { signIn, signOut, store } = auth;

// Get current user
export const currentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Find user in members table by email
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    return member;
  },
});

// Get current user's role
export const currentUserRole = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Check if admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (admin) return admin.role; // "coach", "treasurer", or "super_admin"

    // Check if member
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (member) return "member";

    return null;
  },
});
