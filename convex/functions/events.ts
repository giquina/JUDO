import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get all published events
export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    return events.sort((a, b) => a.startDate - b.startDate);
  },
});

// Get upcoming events (published and not completed)
export const getUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    return events
      .filter((event) => event.endDate >= now)
      .sort((a, b) => a.startDate - b.startDate);
  },
});

// Get past events
export const getPast = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .collect();

    return events.sort((a, b) => b.startDate - a.startDate);
  },
});

// Get events by type
export const getByType = query({
  args: {
    eventType: v.union(
      v.literal("training"),
      v.literal("competition"),
      v.literal("grading"),
      v.literal("social"),
      v.literal("seminar"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_eventType", (q) => q.eq("eventType", args.eventType))
      .collect();
  },
});

// Get events by organizer
export const getByOrganizer = query({
  args: { organizerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_organizerId", (q) => q.eq("organizerId", args.organizerId))
      .collect();
  },
});

// Get single event by ID
export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get event registrations for a specific event
export const getRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});

// Get member's registrations
export const getMemberRegistrations = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventRegistrations")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .collect();
  },
});

// Create event
export const create = mutation({
  args: {
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
    requiresRegistration: v.boolean(),
    cost: v.optional(v.number()),
    organizerId: v.string(),
    organizerName: v.string(),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("cancelled"),
        v.literal("completed")
      )
    ),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      eventType: args.eventType,
      location: args.location,
      startDate: args.startDate,
      endDate: args.endDate,
      registrationDeadline: args.registrationDeadline,
      maxParticipants: args.maxParticipants,
      currentParticipants: 0,
      requiresRegistration: args.requiresRegistration,
      cost: args.cost,
      organizerId: args.organizerId,
      organizerName: args.organizerName,
      status: args.status ?? "draft",
      imageUrl: args.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    eventType: v.optional(
      v.union(
        v.literal("training"),
        v.literal("competition"),
        v.literal("grading"),
        v.literal("social"),
        v.literal("seminar"),
        v.literal("other")
      )
    ),
    location: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    maxParticipants: v.optional(v.number()),
    requiresRegistration: v.optional(v.boolean()),
    cost: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("cancelled"),
        v.literal("completed")
      )
    ),
    imageUrl: v.optional(v.string()),
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

// Delete event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    // Delete all registrations for this event first
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.id))
      .collect();

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    // Delete the event
    return await ctx.db.delete(args.id);
  },
});

// Register member for event
export const registerMember = mutation({
  args: {
    eventId: v.id("events"),
    memberId: v.id("members"),
    memberName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if registration is required
    if (!event.requiresRegistration) {
      throw new Error("This event does not require registration");
    }

    // Check if already registered
    const existingRegistration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("memberId"), args.memberId))
      .first();

    if (existingRegistration) {
      throw new Error("Member already registered for this event");
    }

    // Check if event is full
    if (
      event.maxParticipants &&
      event.currentParticipants >= event.maxParticipants
    ) {
      throw new Error("Event is full");
    }

    // Check registration deadline
    if (
      event.registrationDeadline &&
      Date.now() > event.registrationDeadline
    ) {
      throw new Error("Registration deadline has passed");
    }

    // Create registration
    const registrationId = await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      memberId: args.memberId,
      memberName: args.memberName,
      registeredAt: Date.now(),
      status: "registered",
      notes: args.notes,
    });

    // Update event participant count
    await ctx.db.patch(args.eventId, {
      currentParticipants: event.currentParticipants + 1,
      updatedAt: Date.now(),
    });

    return registrationId;
  },
});

// Cancel registration
export const cancelRegistration = mutation({
  args: {
    registrationId: v.id("eventRegistrations"),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      throw new Error("Registration not found");
    }

    const event = await ctx.db.get(registration.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Update registration status
    await ctx.db.patch(args.registrationId, {
      status: "cancelled",
    });

    // Decrement participant count
    await ctx.db.patch(registration.eventId, {
      currentParticipants: Math.max(0, event.currentParticipants - 1),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Mark registration as attended
export const markAttended = mutation({
  args: {
    registrationId: v.id("eventRegistrations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.registrationId, {
      status: "attended",
    });
  },
});

// Publish event
export const publish = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "published",
      updatedAt: Date.now(),
    });
  },
});

// Cancel event
export const cancel = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});

// Complete event
export const complete = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "completed",
      updatedAt: Date.now(),
    });
  },
});
