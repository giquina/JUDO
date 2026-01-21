import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Auth tables
  ...authTables,

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
    isStudent: v.boolean(),
    emailVerified: v.boolean(),
    verifiedDomain: v.optional(v.string()),
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

  // Admins collection (coaches, treasurer, content manager, super admin)
  admins: defineTable({
    userId: v.string(),
    role: v.union(
      v.literal("coach"),
      v.literal("treasurer"),
      v.literal("content_manager"),
      v.literal("super_admin")
    ),
    name: v.string(),
    email: v.string(),
    permissions: v.array(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_role", ["role"])
    .index("by_email", ["email"])
    .index("by_active", ["active"]),

  // Groups collection (chat groups)
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("club-wide"),
      v.literal("sub-group"),
      v.literal("competition"),
      v.literal("class-based")
    ),
    createdBy: v.id("members"),
    isPrivate: v.boolean(),
    autoJoin: v.boolean(), // Auto-join all active members (for club-wide)
    avatar: v.optional(v.string()),
    settings: v.optional(
      v.object({
        allowMemberInvites: v.boolean(),
        allowFileSharing: v.boolean(),
        maxMembers: v.optional(v.number()),
      })
    ),
    classId: v.optional(v.id("classes")), // Link to class if class-based
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_createdBy", ["createdBy"])
    .index("by_classId", ["classId"])
    .index("by_active", ["active"]),

  // Group memberships collection
  groupMemberships: defineTable({
    groupId: v.id("groups"),
    memberId: v.id("members"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member")
    ),
    joinedAt: v.number(),
    lastReadAt: v.optional(v.number()),
    notificationsEnabled: v.boolean(),
    isMuted: v.boolean(),
    isPinned: v.boolean(),
  })
    .index("by_groupId", ["groupId"])
    .index("by_memberId", ["memberId"])
    .index("by_groupId_memberId", ["groupId", "memberId"])
    .index("by_memberId_isPinned", ["memberId", "isPinned"]),

  // Messages collection
  messages: defineTable({
    groupId: v.id("groups"),
    senderId: v.id("members"),
    senderName: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("system")
    ),
    replyTo: v.optional(v.id("messages")),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          size: v.number(),
          mimeType: v.string(),
        })
      )
    ),
    reactions: v.optional(
      v.array(
        v.object({
          emoji: v.string(),
          memberId: v.id("members"),
          memberName: v.string(),
        })
      )
    ),
    readBy: v.array(v.id("members")),
    edited: v.boolean(),
    editedAt: v.optional(v.number()),
    deleted: v.boolean(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_groupId", ["groupId"])
    .index("by_senderId", ["senderId"])
    .index("by_groupId_createdAt", ["groupId", "createdAt"])
    .index("by_createdAt", ["createdAt"]),

  // Club Profile collection
  clubProfile: defineTable({
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
    updatedAt: v.number(),
  }),

  // Announcements collection
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    category: v.union(
      v.literal("general"),
      v.literal("event"),
      v.literal("training"),
      v.literal("competition"),
      v.literal("social")
    ),
    published: v.boolean(),
    pinned: v.boolean(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_authorId", ["authorId"])
    .index("by_published", ["published"])
    .index("by_createdAt", ["createdAt"])
    .index("by_priority", ["priority"]),

  // Events collection
  events: defineTable({
    title: v.string(),
    description: v.string(),
    eventType: v.union(
      v.literal("training"),
      v.literal("competition"),
      v.literal("grading"),
      v.literal("social"),
      v.literal("seminar"),
      v.literal("other")
    ),
    location: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    registrationDeadline: v.optional(v.number()),
    maxParticipants: v.optional(v.number()),
    currentParticipants: v.number(),
    requiresRegistration: v.boolean(),
    cost: v.optional(v.number()),
    organizerId: v.string(),
    organizerName: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizerId", ["organizerId"])
    .index("by_startDate", ["startDate"])
    .index("by_eventType", ["eventType"])
    .index("by_status", ["status"]),

  // Event Registrations collection
  eventRegistrations: defineTable({
    eventId: v.id("events"),
    memberId: v.id("members"),
    memberName: v.string(),
    registeredAt: v.number(),
    status: v.union(
      v.literal("registered"),
      v.literal("attended"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    notes: v.optional(v.string()),
  })
    .index("by_eventId", ["eventId"])
    .index("by_memberId", ["memberId"])
    .index("by_status", ["status"]),

  // Media Gallery collection
  media: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    category: v.union(
      v.literal("training"),
      v.literal("competition"),
      v.literal("social"),
      v.literal("grading"),
      v.literal("other")
    ),
    uploadedBy: v.string(),
    uploadedByName: v.string(),
    eventId: v.optional(v.id("events")),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_uploadedBy", ["uploadedBy"])
    .index("by_category", ["category"])
    .index("by_eventId", ["eventId"])
    .index("by_createdAt", ["createdAt"]),
});
