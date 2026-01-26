import { mutation } from "./_generated/server";

// Seed function to populate initial data for testing
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Create sample admins (coaches)
    await ctx.db.insert("admins", {
      userId: "coach-joe-doherty",
      role: "super_admin",
      name: "Joe Doherty",
      email: "joe.doherty@bbk.ac.uk",
      permissions: [
        "manage_classes",
        "view_payments",
        "manage_members",
        "export_data",
        "manage_admins",
      ],
      createdAt: now,
    });

    await ctx.db.insert("admins", {
      userId: "coach-sarah-mitchell",
      role: "coach",
      name: "Sarah Mitchell",
      email: "s.mitchell@bbk.ac.uk",
      permissions: ["manage_classes", "view_payments"],
      createdAt: now,
    });

    await ctx.db.insert("admins", {
      userId: "treasurer-mike-chen",
      role: "treasurer",
      name: "Mike Chen",
      email: "m.chen@bbk.ac.uk",
      permissions: ["view_payments", "export_data", "manage_members"],
      createdAt: now,
    });

    // Create sample classes
    await ctx.db.insert("classes", {
      name: "Monday Evening Fundamentals",
      dayOfWeek: "Monday",
      startTime: "19:00",
      endTime: "20:30",
      coachId: "coach-joe-doherty",
      maxCapacity: 25,
      currentAttendance: 0,
      location: "Central YMCA, Studio A",
      level: "beginner",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("classes", {
      name: "Wednesday Intermediate",
      dayOfWeek: "Wednesday",
      startTime: "19:00",
      endTime: "20:30",
      coachId: "coach-sarah-mitchell",
      maxCapacity: 20,
      currentAttendance: 0,
      location: "Central YMCA, Studio A",
      level: "intermediate",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("classes", {
      name: "Friday Advanced",
      dayOfWeek: "Friday",
      startTime: "20:00",
      endTime: "21:30",
      coachId: "coach-joe-doherty",
      maxCapacity: 15,
      currentAttendance: 0,
      location: "Central YMCA, Studio B",
      level: "advanced",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    // Sample members data
    const sampleMembers = [
      {
        name: "Alice Chen",
        email: "a.chen@bbk.ac.uk",
        beltRank: "blue" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 47,
      },
      {
        name: "Raj Patel",
        email: "r.patel@bbk.ac.uk",
        beltRank: "white" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 8,
      },
      {
        name: "Emma Williams",
        email: "e.williams@bbk.ac.uk",
        beltRank: "yellow" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 15,
      },
      {
        name: "James O'Brien",
        email: "j.obrien@bbk.ac.uk",
        beltRank: "orange" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 32,
      },
      {
        name: "Sofia Rodriguez",
        email: "s.rodriguez@bbk.ac.uk",
        beltRank: "green" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 89,
      },
      {
        name: "Mohammed Hassan",
        email: "m.hassan@bbk.ac.uk",
        beltRank: "brown" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 156,
      },
      {
        name: "Lucy Taylor",
        email: "l.taylor@bbk.ac.uk",
        beltRank: "white" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "inactive" as const,
        totalSessions: 3,
      },
      {
        name: "David Kim",
        email: "d.kim@bbk.ac.uk",
        beltRank: "yellow" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 12,
      },
      {
        name: "Fatima Al-Rashid",
        email: "f.alrashid@bbk.ac.uk",
        beltRank: "blue" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "paused" as const,
        totalSessions: 65,
      },
      {
        name: "Oliver Brown",
        email: "o.brown@bbk.ac.uk",
        beltRank: "orange" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 28,
      },
      {
        name: "Priya Sharma",
        email: "p.sharma@bbk.ac.uk",
        beltRank: "green" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 78,
      },
      {
        name: "Tom Wilson",
        email: "t.wilson@bbk.ac.uk",
        beltRank: "white" as const,
        subscriptionTier: "none" as const,
        subscriptionStatus: "inactive" as const,
        totalSessions: 1,
      },
      {
        name: "Hannah Lee",
        email: "h.lee@bbk.ac.uk",
        beltRank: "yellow" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 18,
      },
      {
        name: "George Thompson",
        email: "g.thompson@gmail.com",
        beltRank: "orange" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 41,
      },
      {
        name: "Yuki Tanaka",
        email: "y.tanaka@bbk.ac.uk",
        beltRank: "black" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 312,
      },
    ];

    // Insert members
    for (const memberData of sampleMembers) {
      await ctx.db.insert("members", {
        userId: `user-${memberData.email.split("@")[0]}`,
        email: memberData.email,
        name: memberData.name,
        beltRank: memberData.beltRank,
        joinDate: oneMonthAgo - Math.random() * 365 * 24 * 60 * 60 * 1000,
        totalSessions: memberData.totalSessions,
        subscriptionStatus: memberData.subscriptionStatus,
        subscriptionTier: memberData.subscriptionTier,
        subscriptionEndDate:
          memberData.subscriptionStatus === "active"
            ? now + 30 * 24 * 60 * 60 * 1000
            : undefined,
        createdAt: oneMonthAgo,
        updatedAt: now,
      });
    }

    return {
      success: true,
      message: "Database seeded successfully",
      counts: {
        admins: 3,
        classes: 3,
        members: sampleMembers.length,
      },
    };
  },
});
