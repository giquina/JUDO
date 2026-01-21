import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Auth tables
  ...authTables,

  // ============================================================================
  // MULTI-TENANT CORE TABLES
  // ============================================================================

  // Clubs table - Each judo club/dojo on the platform
  clubs: defineTable({
    name: v.string(), // e.g., "Birkbeck Judo Club"
    slug: v.string(), // URL-friendly: "birkbeck-judo"
    dojoName: v.optional(v.string()), // Traditional dojo name if different

    // Contact & Location
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    postcode: v.optional(v.string()),
    country: v.string(),

    // Branding
    logoUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    description: v.optional(v.string()),

    // Stripe Connect
    stripeAccountId: v.optional(v.string()), // Stripe Connect account
    stripeAccountStatus: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("restricted"),
      v.literal("disabled")
    ),

    // Subscription & Status
    planTier: v.union(
      v.literal("trial"),      // 14-day free trial
      v.literal("active"),     // Paying clubs
      v.literal("paused"),     // Temporarily paused
      v.literal("cancelled")   // Churned clubs
    ),
    trialEndsAt: v.optional(v.number()),
    subscriptionStartedAt: v.optional(v.number()),

    // Settings
    timezone: v.string(),
    currency: v.literal("GBP"), // Start with GBP only
    platformCommissionRate: v.number(), // e.g., 12 (for 12%)

    // Metadata
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_email", ["email"])
    .index("by_planTier", ["planTier"])
    .index("by_stripeAccountId", ["stripeAccountId"]),

  // Club Members - Junction table linking users to clubs with roles
  clubMembers: defineTable({
    clubId: v.id("clubs"),
    userId: v.string(), // From auth system

    // Personal Info
    email: v.string(),
    name: v.string(),
    dateOfBirth: v.optional(v.number()),
    phone: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),

    // Role & Permissions (RBAC)
    role: v.union(
      v.literal("club_owner"),      // Full control of club
      v.literal("head_sensei"),     // Head instructor (Shihan)
      v.literal("sensei"),          // Instructor
      v.literal("sempai"),          // Senior student/assistant
      v.literal("front_desk"),      // Check-in staff only
      v.literal("judoka")           // Regular member/student
    ),

    // Judo Progression (Kyu/Dan system)
    currentBelt: v.union(
      // Kyu grades (colored belts) - descending order
      v.literal("6th_kyu"),  // White
      v.literal("5th_kyu"),  // Yellow
      v.literal("4th_kyu"),  // Orange
      v.literal("3rd_kyu"),  // Green
      v.literal("2nd_kyu"),  // Blue
      v.literal("1st_kyu"),  // Brown
      // Dan grades (black belts) - ascending order
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
    lastGradingDate: v.optional(v.number()),
    nextGradingEligible: v.optional(v.number()),

    // Membership & Payment
    membershipStatus: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
      v.literal("trial")
    ),
    membershipTier: v.union(
      v.literal("trial"),       // Free trial
      v.literal("student"),     // £35/month
      v.literal("standard"),    // £45/month
      v.literal("unlimited")    // £55/month
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStartDate: v.optional(v.number()),
    subscriptionEndDate: v.optional(v.number()),

    // Activity Tracking
    joinDate: v.number(),
    totalSessions: v.number(),
    lastAttendance: v.optional(v.number()),

    // Notes
    medicalNotes: v.optional(v.string()),
    notes: v.optional(v.string()),

    // Metadata
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clubId", ["clubId"])
    .index("by_userId", ["userId"])
    .index("by_clubId_userId", ["clubId", "userId"])
    .index("by_clubId_role", ["clubId", "role"])
    .index("by_clubId_status", ["clubId", "membershipStatus"])
    .index("by_email", ["email"]),

  // ============================================================================
  // LEGACY MEMBERS TABLE (Deprecated - kept for migration)
  // TODO: Remove after data migration to clubMembers
  // ============================================================================
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

  // Classes/Training Sessions
  classes: defineTable({
    clubId: v.id("clubs"), // Multi-tenant isolation

    // Session Details
    name: v.string(), // e.g., "Adult Randori", "Kids Kata"
    sessionType: v.union(
      v.literal("randori"),      // Free practice/sparring (乱取り)
      v.literal("kata"),         // Forms/techniques (型)
      v.literal("newaza"),       // Ground techniques (寝技)
      v.literal("nage_waza"),    // Throwing techniques (投げ技)
      v.literal("mixed"),        // General training
      v.literal("grading")       // Belt examination
    ),

    // Schedule
    dayOfWeek: v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    ),
    startTime: v.string(), // HH:mm format
    endTime: v.string(),
    recurring: v.boolean(), // Weekly recurring class

    // Instructor (Sensei)
    senseiId: v.string(), // userId of the instructor
    assistantIds: v.optional(v.array(v.string())), // Sempai assisting

    // Capacity
    maxCapacity: v.number(),
    currentAttendance: v.number(),

    // Level & Requirements
    level: v.union(
      v.literal("beginner"),     // White to Orange belt
      v.literal("intermediate"), // Green to Brown belt
      v.literal("advanced"),     // Black belt
      v.literal("all_levels"),   // Mixed ability
      v.literal("kids"),         // Under 16
      v.literal("adults")        // 16+
    ),
    minBeltRequired: v.optional(v.string()), // e.g., "3rd_kyu"

    // Location
    location: v.string(), // e.g., "Main Dojo", "Tatami Room 1"
    tatamiArea: v.optional(v.string()), // Which mat area

    // Status
    active: v.boolean(),
    cancelled: v.optional(v.boolean()),
    cancellationReason: v.optional(v.string()),

    // Metadata
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clubId", ["clubId"])
    .index("by_clubId_dayOfWeek", ["clubId", "dayOfWeek"])
    .index("by_senseiId", ["senseiId"])
    .index("by_clubId_senseiId", ["clubId", "senseiId"])
    .index("by_level", ["level"]),

  // Attendance Records
  attendance: defineTable({
    clubId: v.id("clubs"), // Multi-tenant isolation
    judokaId: v.id("clubMembers"), // The member attending (using judo term)
    classId: v.id("classes"),

    // Check-in/out
    checkInTime: v.number(),
    checkOutTime: v.optional(v.number()),
    checkInMethod: v.union(
      v.literal("qr_code"),
      v.literal("manual"),
      v.literal("nfc"),
      v.literal("front_desk")
    ),

    // Status
    status: v.union(
      v.literal("attended"),
      v.literal("absent"),
      v.literal("late"),
      v.literal("excused"),
      v.literal("cancelled")
    ),

    // Session Notes (for Sensei)
    performanceNotes: v.optional(v.string()), // How did they do?
    techniquesWorkedOn: v.optional(v.array(v.string())), // e.g., ["O-goshi", "Tai-otoshi"]
    injuryReported: v.optional(v.boolean()),
    injuryDetails: v.optional(v.string()),

    // Admin
    manualOverride: v.optional(v.boolean()),
    overrideBy: v.optional(v.string()), // userId who made manual change
    notes: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clubId", ["clubId"])
    .index("by_judokaId", ["judokaId"])
    .index("by_classId", ["classId"])
    .index("by_clubId_judokaId", ["clubId", "judokaId"])
    .index("by_clubId_classId", ["clubId", "classId"])
    .index("by_checkInTime", ["checkInTime"]),

  // Payments
  payments: defineTable({
    clubId: v.id("clubs"), // Multi-tenant isolation
    judokaId: v.id("clubMembers"),

    // Stripe Details
    stripePaymentIntentId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),

    // Amount Breakdown (in pence/cents)
    grossAmount: v.number(), // Total amount charged to member
    platformFee: v.number(), // 12% commission to platform
    stripeFee: v.number(), // Stripe's transaction fee (~1.5% + 20p)
    netAmount: v.number(), // Amount club receives

    currency: v.literal("GBP"),

    // Payment Type
    paymentType: v.union(
      v.literal("subscription"), // Monthly membership
      v.literal("session"),       // Pay-per-session
      v.literal("grading"),       // Belt examination fee
      v.literal("gi"),            // Equipment purchase
      v.literal("tournament"),    // Competition entry
      v.literal("other")
    ),

    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded"),
      v.literal("disputed")
    ),

    // Subscription Details
    membershipTier: v.optional(v.union(
      v.literal("student"),    // £35/month
      v.literal("standard"),   // £45/month
      v.literal("unlimited")   // £55/month
    )),
    subscriptionPeriodStart: v.optional(v.number()),
    subscriptionPeriodEnd: v.optional(v.number()),

    // Session/Event Details
    classesIncluded: v.optional(v.number()),
    sessionDate: v.optional(v.number()),
    eventName: v.optional(v.string()),

    // Receipt & Records
    receiptUrl: v.optional(v.string()),
    invoiceUrl: v.optional(v.string()),

    // Refund Details
    refundedAt: v.optional(v.number()),
    refundAmount: v.optional(v.number()),
    refundReason: v.optional(v.string()),

    // Metadata
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clubId", ["clubId"])
    .index("by_judokaId", ["judokaId"])
    .index("by_clubId_judokaId", ["clubId", "judokaId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_stripePaymentIntentId", ["stripePaymentIntentId"]),

  // Belt Progressions - Track grading history and progression
  beltProgressions: defineTable({
    clubId: v.id("clubs"),
    judokaId: v.id("clubMembers"),

    // Grading Details
    fromBelt: v.string(), // e.g., "5th_kyu" (Yellow)
    toBelt: v.string(), // e.g., "4th_kyu" (Orange)
    gradingDate: v.number(),
    nextGradingEligible: v.optional(v.number()), // When eligible for next

    // Assessment
    examinerSenseiId: v.string(), // Who conducted grading
    passed: v.boolean(),
    score: v.optional(v.number()), // 0-100
    techniquesAssessed: v.optional(v.array(v.string())),

    // Performance Notes
    strengths: v.optional(v.string()),
    areasForImprovement: v.optional(v.string()),
    senseiComments: v.optional(v.string()),

    // Requirements
    sessionsAttended: v.number(), // Sessions since last grading
    minSessionsRequired: v.number(), // e.g., 30 sessions for next belt
    timeSinceLastGrading: v.number(), // Months

    // Certificate
    certificateIssued: v.optional(v.boolean()),
    certificateNumber: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clubId", ["clubId"])
    .index("by_judokaId", ["judokaId"])
    .index("by_clubId_judokaId", ["clubId", "judokaId"])
    .index("by_gradingDate", ["gradingDate"]),

  // Announcements - Club-wide or targeted communications
  announcements: defineTable({
    clubId: v.id("clubs"),

    // Content
    title: v.string(),
    content: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),

    // Targeting
    targetAudience: v.union(
      v.literal("all"),          // Everyone in club
      v.literal("judoka_only"),  // Only members
      v.literal("sensei_only"),  // Only instructors
      v.literal("specific_belt"), // Specific belt ranks
      v.literal("specific_class") // Specific class attendees
    ),
    targetBelts: v.optional(v.array(v.string())),
    targetClassIds: v.optional(v.array(v.id("classes"))),

    // Author
    authorId: v.string(), // userId of who posted
    authorRole: v.string(),

    // Scheduling
    publishAt: v.number(),
    expiresAt: v.optional(v.number()),
    pinned: v.optional(v.boolean()),

    // Engagement
    viewCount: v.optional(v.number()),

    // Metadata
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clubId", ["clubId"])
    .index("by_clubId_publishAt", ["clubId", "publishAt"])
    .index("by_clubId_priority", ["clubId", "priority"]),

  // Platform Analytics - Track usage across all clubs
  platformAnalytics: defineTable({
    clubId: v.optional(v.id("clubs")), // null = platform-wide metric

    // Metric Type
    metricType: v.union(
      v.literal("club_signup"),
      v.literal("member_signup"),
      v.literal("class_booking"),
      v.literal("payment_success"),
      v.literal("payment_failed"),
      v.literal("qr_checkin"),
      v.literal("belt_progression"),
      v.literal("churn")
    ),

    // Values
    count: v.number(),
    value: v.optional(v.number()), // e.g., revenue amount

    // Dimensions
    date: v.number(), // Date of metric (for time series)
    metadata: v.optional(v.string()), // JSON string for extra context

    // Metadata
    createdAt: v.number(),
  })
    .index("by_clubId", ["clubId"])
    .index("by_metricType", ["metricType"])
    .index("by_date", ["date"])
    .index("by_clubId_date", ["clubId", "date"]),

  // ============================================================================
  // LEGACY ADMINS TABLE (Deprecated - replaced by clubMembers with roles)
  // TODO: Remove after data migration
  // ============================================================================
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
    .index("by_role", ["role"])
    .index("by_email", ["email"]),
});
