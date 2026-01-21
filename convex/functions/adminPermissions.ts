/**
 * Admin Permission Guard Functions for Role-Based Access Control
 *
 * This module provides permission checking utilities for the JUDO app's RBAC system.
 * Defines granular permissions for each role:
 * - Super Admin (Joe Doherty): Full system access
 * - Treasurer (Oliver): Payment & financial management
 * - Content Manager (Joseph): Announcements, media, events
 * - Coach: Class management & attendance
 */

import { query, QueryCtx } from "../_generated/server";
import { v } from "convex/values";

// Permission enum - all available permissions in the system
export const PERMISSIONS = {
  // Payment & Financial
  VIEW_PAYMENTS: "view_payments",
  EXPORT_FINANCIAL_DATA: "export_financial_data",
  MANAGE_SUBSCRIPTIONS: "manage_subscriptions",

  // Member Management
  MANAGE_MEMBERS: "manage_members",
  VIEW_MEMBERS: "view_members",
  EXPORT_MEMBER_DATA: "export_member_data",

  // Attendance & Check-in
  CHECK_IN_MEMBERS: "check_in_members",
  VIEW_ATTENDANCE: "view_attendance",
  MANAGE_ATTENDANCE: "manage_attendance",

  // Content & Communication
  POST_ANNOUNCEMENTS: "post_announcements",
  EDIT_ANNOUNCEMENTS: "edit_announcements",
  DELETE_ANNOUNCEMENTS: "delete_announcements",
  UPLOAD_MEDIA: "upload_media",
  MANAGE_MEDIA: "manage_media",

  // Events & Classes
  MANAGE_EVENTS: "manage_events",
  VIEW_EVENTS: "view_events",
  MANAGE_CLASSES: "manage_classes",
  VIEW_CLASSES: "view_classes",

  // Admin & System
  MANAGE_ADMINS: "manage_admins",
  VIEW_REPORTS: "view_reports",
  SYSTEM_SETTINGS: "system_settings",
} as const;

// Role-based permission sets
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    // Full system access
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.EXPORT_FINANCIAL_DATA,
    PERMISSIONS.MANAGE_SUBSCRIPTIONS,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.EXPORT_MEMBER_DATA,
    PERMISSIONS.CHECK_IN_MEMBERS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.POST_ANNOUNCEMENTS,
    PERMISSIONS.EDIT_ANNOUNCEMENTS,
    PERMISSIONS.DELETE_ANNOUNCEMENTS,
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.MANAGE_ADMINS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SYSTEM_SETTINGS,
  ],

  treasurer: [
    // Payment & financial management
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.EXPORT_FINANCIAL_DATA,
    PERMISSIONS.MANAGE_SUBSCRIPTIONS,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.EXPORT_MEMBER_DATA,
    PERMISSIONS.VIEW_REPORTS,
    // NO check-in access
    // NO announcement/media access
  ],

  content_manager: [
    // Content & communication
    PERMISSIONS.POST_ANNOUNCEMENTS,
    PERMISSIONS.EDIT_ANNOUNCEMENTS,
    PERMISSIONS.DELETE_ANNOUNCEMENTS,
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.VIEW_MEMBERS, // For event invites
    // NO payment access
    // NO check-in access
  ],

  coach: [
    // Class management & attendance
    PERMISSIONS.CHECK_IN_MEMBERS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_EVENTS,
    // NO payment access
    // NO full member management
    // NO announcement posting (can only post class updates)
  ],
};

/**
 * Get admin details by userId
 */
export const getAdminByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return admin;
  },
});

/**
 * Check if user has a specific permission
 */
export const hasPermission = query({
  args: {
    userId: v.string(),
    permission: v.string(),
  },
  handler: async (ctx, { userId, permission }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    // Check if permission exists in admin's permissions array
    return admin.permissions.includes(permission);
  },
});

/**
 * Get all permissions for a user
 */
export const getUserPermissions = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return [];
    }

    return admin.permissions;
  },
});

/**
 * Check if user can view payments
 * Required for: Treasurer, Super Admin
 */
export const canViewPayments = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.VIEW_PAYMENTS);
  },
});

/**
 * Check if user can manage members
 * Required for: Treasurer, Super Admin
 */
export const canManageMembers = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.MANAGE_MEMBERS);
  },
});

/**
 * Check if user can post announcements
 * Required for: Content Manager, Super Admin
 */
export const canPostAnnouncements = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.POST_ANNOUNCEMENTS);
  },
});

/**
 * Check if user can upload media
 * Required for: Content Manager, Super Admin
 */
export const canUploadMedia = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.UPLOAD_MEDIA);
  },
});

/**
 * Check if user can manage events
 * Required for: Content Manager, Super Admin
 */
export const canManageEvents = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.MANAGE_EVENTS);
  },
});

/**
 * Check if user can check in members (QR code access)
 * Required for: Coach, Super Admin
 * NOT for: Treasurer, Content Manager
 */
export const canCheckInMembers = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.CHECK_IN_MEMBERS);
  },
});

/**
 * Check if user can manage other admins
 * Required for: Super Admin only
 */
export const canManageAdmins = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return false;
    }

    return admin.permissions.includes(PERMISSIONS.MANAGE_ADMINS);
  },
});

/**
 * Get user role
 */
export const getUserRole = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!admin || !admin.active) {
      return null;
    }

    return admin.role;
  },
});

/**
 * Check if user is admin (any role)
 */
export const isAdmin = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return !!admin && admin.active;
  },
});

/**
 * Helper function to check permissions (for use in mutations)
 * This is not a query/mutation itself, but a helper for other functions
 */
export async function checkPermission(
  ctx: QueryCtx,
  userId: string,
  permission: string
): Promise<boolean> {
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (!admin || !admin.active) {
    return false;
  }

  return admin.permissions.includes(permission);
}

/**
 * Helper function to get admin (for use in mutations)
 */
export async function getAdmin(ctx: QueryCtx, userId: string) {
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  return admin;
}
