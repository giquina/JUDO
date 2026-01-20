import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Members collection
  members: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    beltRank: v.union(
      v.literal("white"),
      v.literal("yellow"),
      v.literal("orange"),
      v.literal("green"),
      v.literal("blue"),
      v.literal("brown"),
      v.literal("black")
    ),
    joinDate: v.number(),
    totalSessions: v.number(),
    stripeCustomerId: v.optional(v.string()),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("paused")
    ),
    subscriptionTier: v.union(
      v.literal("none"),
      v.literal("student"),
      v.literal("standard"),
      v.literal("premium")
    ),
    subscriptionEndDate: v.optional(v.number()),
    emergencyContact: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_subscriptionStatus", ["subscriptionStatus"]),

  // Classes collection
  classes: defineTable({
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
    currentAttendance: v.number(),
    location: v.string(),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("mixed")
    ),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_dayOfWeek", ["dayOfWeek"])
    .index("by_coachId", ["coachId"])
    .index("by_level", ["level"]),

  // Attendance collection
  attendance: defineTable({
    memberId: v.id("members"),
    classId: v.id("classes"),
    checkInTime: v.number(),
    checkOutTime: v.optional(v.number()),
    status: v.union(
      v.literal("attended"),
      v.literal("absent"),
      v.literal("cancelled")
    ),
    manualOverride: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_memberId", ["memberId"])
    .index("by_classId", ["classId"])
    .index("by_checkInTime", ["checkInTime"]),

  // Payments collection
  payments: defineTable({
    memberId: v.id("members"),
    stripePaymentIntentId: v.optional(v.string()),
    amount: v.number(),
    currency: v.literal("GBP"),
    paymentType: v.union(v.literal("subscription"), v.literal("session")),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    subscriptionPeriodStart: v.optional(v.number()),
    subscriptionPeriodEnd: v.optional(v.number()),
    classesIncluded: v.optional(v.number()),
    sessionDate: v.optional(v.number()),
    receipt: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_memberId", ["memberId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Admins collection (coaches, treasurer, super admin)
  admins: defineTable({
    userId: v.string(),
    role: v.union(
      v.literal("coach"),
      v.literal("treasurer"),
      v.literal("super_admin")
    ),
    name: v.string(),
    email: v.string(),
    permissions: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_role", ["role"]),
});
