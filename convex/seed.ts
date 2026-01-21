import { mutation } from "./_generated/server";

// Comprehensive seed function for University of London Judo Club
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // ===== CLUB PROFILE =====
    await ctx.db.insert("clubProfile", {
      name: "University of London Judo Club",
      description:
        "The University of London Judo Club is a vibrant and inclusive community dedicated to the practice and promotion of Judo. Affiliated with the British Judo Association and British Universities & Colleges Sport (BUCS), we welcome students and non-students of all abilities, from complete beginners to competitive black belts. Our experienced coaches provide high-quality instruction in a supportive environment, focusing on technique, fitness, and the core values of Judo: respect, discipline, and mutual benefit.",
      location: "Central YMCA, 112 Great Russell Street, London WC1B 3NQ",
      contactEmail: "judo@lon.ac.uk",
      contactPhone: "+44 20 7343 1234",
      website: "https://uljudo.co.uk",
      socialMedia: {
        facebook: "https://facebook.com/ULJudoClub",
        instagram: "https://instagram.com/ul_judo",
        twitter: "https://twitter.com/ULJudoClub",
      },
      affiliations: [
        "British Judo Association (BJA)",
        "British Universities & Colleges Sport (BUCS)",
        "London Judo Federation",
      ],
      foundedYear: 1968,
      logo: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400",
      bannerImage:
        "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200",
      updatedAt: now,
    });

    // ===== ADMINS =====
    // Joe Doherty - Head Sensei (Super Admin)
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
        "check_in_members",
        "manage_content",
      ],
      active: true,
      createdAt: now - 365 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    // Oliver - Treasurer
    await ctx.db.insert("admins", {
      userId: "treasurer-oliver",
      role: "treasurer",
      name: "Oliver Thompson",
      email: "oliver.thompson@mail.bbk.ac.uk",
      permissions: ["view_payments", "export_data", "manage_members"],
      active: true,
      createdAt: now - 200 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    // Joseph - Content Manager
    await ctx.db.insert("admins", {
      userId: "content-joseph",
      role: "content_manager",
      name: "Joseph Clarke",
      email: "joseph.clarke@mail.bbk.ac.uk",
      permissions: ["manage_content", "manage_announcements", "manage_media"],
      active: true,
      createdAt: now - 150 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    // Sarah Mitchell - Assistant Coach
    await ctx.db.insert("admins", {
      userId: "coach-sarah-mitchell",
      role: "coach",
      name: "Sarah Mitchell",
      email: "s.mitchell@bbk.ac.uk",
      permissions: ["manage_classes", "view_payments", "check_in_members"],
      active: true,
      createdAt: now - 300 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    // ===== CLASSES =====
    const mondayBeginner = await ctx.db.insert("classes", {
      name: "Monday Beginners",
      dayOfWeek: "Monday",
      startTime: "18:00",
      endTime: "19:30",
      coachId: "coach-sarah-mitchell",
      maxCapacity: 25,
      currentAttendance: 0,
      location: "Central YMCA, Studio A",
      level: "beginner",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const tuesdayAdvanced = await ctx.db.insert("classes", {
      name: "Tuesday Advanced",
      dayOfWeek: "Tuesday",
      startTime: "19:30",
      endTime: "21:00",
      coachId: "coach-joe-doherty",
      maxCapacity: 20,
      currentAttendance: 0,
      location: "Central YMCA, Studio B",
      level: "advanced",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const wednesdayMixed = await ctx.db.insert("classes", {
      name: "Wednesday All Levels",
      dayOfWeek: "Wednesday",
      startTime: "19:00",
      endTime: "20:30",
      coachId: "coach-joe-doherty",
      maxCapacity: 30,
      currentAttendance: 0,
      location: "Central YMCA, Studio A",
      level: "mixed",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const thursdayIntermediate = await ctx.db.insert("classes", {
      name: "Thursday Intermediate",
      dayOfWeek: "Thursday",
      startTime: "18:30",
      endTime: "20:00",
      coachId: "coach-sarah-mitchell",
      maxCapacity: 25,
      currentAttendance: 0,
      location: "Central YMCA, Studio A",
      level: "intermediate",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const fridayCompetition = await ctx.db.insert("classes", {
      name: "Friday Competition Squad",
      dayOfWeek: "Friday",
      startTime: "20:00",
      endTime: "21:30",
      coachId: "coach-joe-doherty",
      maxCapacity: 15,
      currentAttendance: 0,
      location: "Crystal Palace National Sports Centre",
      level: "advanced",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const saturdayMorning = await ctx.db.insert("classes", {
      name: "Saturday Morning Fundamentals",
      dayOfWeek: "Saturday",
      startTime: "10:00",
      endTime: "11:30",
      coachId: "coach-sarah-mitchell",
      maxCapacity: 20,
      currentAttendance: 0,
      location: "Central YMCA, Studio A",
      level: "beginner",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const sundayOpen = await ctx.db.insert("classes", {
      name: "Sunday Open Mat",
      dayOfWeek: "Sunday",
      startTime: "14:00",
      endTime: "16:00",
      coachId: "coach-joe-doherty",
      maxCapacity: 25,
      currentAttendance: 0,
      location: "Central YMCA, Studio B",
      level: "mixed",
      active: true,
      createdAt: now - 180 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    const classIds = [
      mondayBeginner,
      tuesdayAdvanced,
      wednesdayMixed,
      thursdayIntermediate,
      fridayCompetition,
      saturdayMorning,
      sundayOpen,
    ];

    // ===== MEMBERS =====
    const membersData = [
      // Students with @mail.bbk.ac.uk
      {
        name: "Alice Chen",
        email: "a.chen@mail.bbk.ac.uk",
        beltRank: "blue" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 52,
        joinDate: now - 280 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Raj Patel",
        email: "r.patel@mail.bbk.ac.uk",
        beltRank: "white" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 12,
        joinDate: now - 45 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Emma Williams",
        email: "e.williams@mail.bbk.ac.uk",
        beltRank: "yellow" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 24,
        joinDate: now - 120 * 24 * 60 * 60 * 1000,
      },
      {
        name: "James O'Brien",
        email: "j.obrien@mail.bbk.ac.uk",
        beltRank: "orange" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 38,
        joinDate: now - 180 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Sofia Rodriguez",
        email: "s.rodriguez@mail.bbk.ac.uk",
        beltRank: "green" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 95,
        joinDate: now - 420 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Mohammed Hassan",
        email: "m.hassan@mail.bbk.ac.uk",
        beltRank: "brown" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 168,
        joinDate: now - 650 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Lucy Taylor",
        email: "l.taylor@mail.bbk.ac.uk",
        beltRank: "white" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "inactive" as const,
        totalSessions: 4,
        joinDate: now - 60 * 24 * 60 * 60 * 1000,
      },
      {
        name: "David Kim",
        email: "d.kim@mail.bbk.ac.uk",
        beltRank: "yellow" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 18,
        joinDate: now - 90 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Hannah Lee",
        email: "h.lee@mail.bbk.ac.uk",
        beltRank: "orange" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 31,
        joinDate: now - 150 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Yuki Tanaka",
        email: "y.tanaka@mail.bbk.ac.uk",
        beltRank: "black" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 320,
        joinDate: now - 1200 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Aisha Khan",
        email: "a.khan@mail.bbk.ac.uk",
        beltRank: "green" as const,
        subscriptionTier: "student" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 76,
        joinDate: now - 350 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Tom Wilson",
        email: "t.wilson@mail.bbk.ac.uk",
        beltRank: "white" as const,
        subscriptionTier: "none" as const,
        subscriptionStatus: "inactive" as const,
        totalSessions: 2,
        joinDate: now - 70 * 24 * 60 * 60 * 1000,
      },
      // Non-students (Standard/Premium)
      {
        name: "George Thompson",
        email: "g.thompson@gmail.com",
        beltRank: "orange" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 44,
        joinDate: now - 210 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Fatima Al-Rashid",
        email: "f.alrashid@hotmail.com",
        beltRank: "blue" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "paused" as const,
        totalSessions: 67,
        joinDate: now - 300 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Oliver Brown",
        email: "o.brown@yahoo.co.uk",
        beltRank: "green" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 89,
        joinDate: now - 400 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Priya Sharma",
        email: "p.sharma@outlook.com",
        beltRank: "brown" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 142,
        joinDate: now - 550 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Marcus Johnson",
        email: "m.johnson@gmail.com",
        beltRank: "blue" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 58,
        joinDate: now - 270 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Nina Kowalski",
        email: "n.kowalski@gmail.com",
        beltRank: "yellow" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 21,
        joinDate: now - 100 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Carlos Mendes",
        email: "c.mendes@hotmail.co.uk",
        beltRank: "black" as const,
        subscriptionTier: "premium" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 287,
        joinDate: now - 1000 * 24 * 60 * 60 * 1000,
      },
      {
        name: "Jessica Wright",
        email: "j.wright@gmail.com",
        beltRank: "orange" as const,
        subscriptionTier: "standard" as const,
        subscriptionStatus: "active" as const,
        totalSessions: 35,
        joinDate: now - 160 * 24 * 60 * 60 * 1000,
      },
    ];

    const memberIds = [];
    for (const memberData of membersData) {
      const isStudent = memberData.email.includes("@mail.bbk.ac.uk");
      const memberId = await ctx.db.insert("members", {
        userId: `user-${memberData.email.split("@")[0]}`,
        email: memberData.email,
        name: memberData.name,
        beltRank: memberData.beltRank,
        joinDate: memberData.joinDate,
        totalSessions: memberData.totalSessions,
        subscriptionStatus: memberData.subscriptionStatus,
        subscriptionTier: memberData.subscriptionTier,
        subscriptionEndDate:
          memberData.subscriptionStatus === "active"
            ? now + 30 * 24 * 60 * 60 * 1000
            : undefined,
        isStudent,
        emailVerified: true,
        verifiedDomain: isStudent ? "mail.bbk.ac.uk" : undefined,
        createdAt: memberData.joinDate,
        updatedAt: now,
      });
      memberIds.push({ id: memberId, ...memberData });
    }

    // ===== ATTENDANCE DATA (Dec 30, 2025 - Jan 20, 2026) =====
    // Generate 3 weeks of realistic attendance
    const startDate = new Date("2025-12-30");
    const endDate = new Date("2026-01-20");
    const dayInMs = 24 * 60 * 60 * 1000;

    // Active members (not inactive)
    const activeMembers = memberIds.filter(
      (m) => m.subscriptionStatus === "active"
    );

    // Map classes to days
    const classByDay: { [key: string]: any } = {
      1: mondayBeginner, // Monday
      2: tuesdayAdvanced,
      3: wednesdayMixed,
      4: thursdayIntermediate,
      5: fridayCompetition,
      6: saturdayMorning,
      0: sundayOpen, // Sunday
    };

    for (
      let date = startDate.getTime();
      date <= endDate.getTime();
      date += dayInMs
    ) {
      const dayOfWeek = new Date(date).getDay();
      const classId = classByDay[dayOfWeek];

      if (classId) {
        // Randomly select 60-80% of active members to attend
        const attendeeCount = Math.floor(
          activeMembers.length * (0.6 + Math.random() * 0.2)
        );
        const shuffled = [...activeMembers].sort(() => 0.5 - Math.random());
        const attendees = shuffled.slice(0, attendeeCount);

        for (const member of attendees) {
          const classStartHour =
            dayOfWeek === 6 ? 10 : dayOfWeek === 0 ? 14 : 18;
          const checkInTime =
            date +
            classStartHour * 60 * 60 * 1000 +
            Math.floor(Math.random() * 15) * 60 * 1000;

          await ctx.db.insert("attendance", {
            memberId: member.id,
            classId,
            checkInTime,
            status: "attended",
            createdAt: checkInTime,
          });
        }
      }
    }

    // ===== PAYMENTS (Last 30 days) =====
    const tierPrices = {
      student: 25,
      standard: 40,
      premium: 60,
    };

    for (const member of memberIds) {
      if (member.subscriptionStatus === "active") {
        const tier = member.subscriptionTier;
        if (tier !== "none") {
          // Create monthly subscription payment
          const paymentDate =
            now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000;
          await ctx.db.insert("payments", {
            memberId: member.id,
            amount: tierPrices[tier as keyof typeof tierPrices],
            currency: "GBP",
            paymentType: "subscription",
            status: "completed",
            subscriptionPeriodStart: paymentDate,
            subscriptionPeriodEnd: paymentDate + 30 * 24 * 60 * 60 * 1000,
            classesIncluded:
              tier === "student" ? 8 : tier === "standard" ? 12 : 999,
            createdAt: paymentDate,
            updatedAt: paymentDate,
          });
        }
      }
    }

    // ===== ANNOUNCEMENTS =====
    const announcements = [
      {
        title: "Welcome Back! New Year Training Schedule",
        content:
          "Happy New Year everyone! We're excited to kick off 2026 with our full training schedule. All classes resume from Monday 6th January. Remember to bring your gi and arrive 10 minutes early for warm-ups. Looking forward to seeing you all on the mat! 🥋",
        authorId: "content-joseph",
        authorName: "Joseph Clarke",
        priority: "normal" as const,
        category: "general" as const,
        published: true,
        pinned: true,
        createdAt: now - 15 * 24 * 60 * 60 * 1000,
      },
      {
        title: "BUCS Championships - Sign Up Now!",
        content:
          "The BUCS Judo Championships are coming up on 15th February at Crystal Palace. This is our biggest competition of the year! If you're interested in competing, please speak to Joe or Sarah by Friday. We need to confirm numbers for team registration. All belt levels welcome!",
        authorId: "coach-joe-doherty",
        authorName: "Joe Doherty",
        priority: "high" as const,
        category: "competition" as const,
        published: true,
        pinned: true,
        createdAt: now - 10 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Grading Scheduled for February 8th",
        content:
          "Our next grading will be held on Saturday 8th February at 2pm. If you think you're ready to test for your next belt, please let your coach know. White to yellow belts need at least 20 sessions, yellow to orange need 30+, and higher grades will be assessed individually. Good luck to all participants!",
        authorId: "coach-joe-doherty",
        authorName: "Joe Doherty",
        priority: "high" as const,
        category: "training" as const,
        published: true,
        pinned: false,
        createdAt: now - 7 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Social Event: Post-Training Drinks 🍻",
        content:
          "Join us this Friday after the competition squad session for drinks at The Marquis Cornwall on Great Russell Street (5 min walk from YMCA). Great chance to socialize outside the dojo! New members especially welcome. See you there from 9:30pm onwards.",
        authorId: "content-joseph",
        authorName: "Joseph Clarke",
        priority: "normal" as const,
        category: "social" as const,
        published: true,
        pinned: false,
        createdAt: now - 5 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Guest Instructor Visit - Olympic Coach Coming!",
        content:
          "We're thrilled to announce that Olympic bronze medalist and GB coach Kate Richardson will be visiting us on Saturday 25th January for a special seminar. The session runs 11:30am-1:30pm at Central YMCA. Cost is £15 for members, £25 for non-members. Places are limited - sign up at reception!",
        authorId: "coach-joe-doherty",
        authorName: "Joe Doherty",
        priority: "urgent" as const,
        category: "event" as const,
        published: true,
        pinned: true,
        createdAt: now - 3 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Membership Renewals Due",
        content:
          "Friendly reminder that monthly memberships renew automatically. If you need to update payment details or change your subscription tier, please contact Oliver (treasurer) at oliver.thompson@mail.bbk.ac.uk. Student discount available with valid university ID.",
        authorId: "treasurer-oliver",
        authorName: "Oliver Thompson",
        priority: "normal" as const,
        category: "general" as const,
        published: true,
        pinned: false,
        createdAt: now - 2 * 24 * 60 * 60 * 1000,
      },
      {
        title: "New Equipment Arrival",
        content:
          "Great news! We've received a shipment of new crash mats and throwing dummies for the competition squad training. These will be available from next week at Crystal Palace. Thanks to everyone who contributed to the equipment fund - your support makes a real difference!",
        authorId: "content-joseph",
        authorName: "Joseph Clarke",
        priority: "low" as const,
        category: "training" as const,
        published: true,
        pinned: false,
        createdAt: now - 1 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Beginners Welcome - No Experience Needed!",
        content:
          "Thinking about trying Judo? Our Monday and Saturday beginners classes are perfect for newcomers. First session is free, and we have spare gis available. No need to book - just turn up 15 minutes early and speak to the coach. Everyone starts somewhere, and we're here to help you learn!",
        authorId: "coach-sarah-mitchell",
        authorName: "Sarah Mitchell",
        priority: "normal" as const,
        category: "training" as const,
        published: true,
        pinned: false,
        createdAt: now - 12 * 60 * 60 * 1000,
      },
    ];

    for (const announcement of announcements) {
      await ctx.db.insert("announcements", {
        ...announcement,
        updatedAt: announcement.createdAt,
      });
    }

    // ===== EVENTS =====
    const events = [
      {
        title: "BUCS Judo Championships 2026",
        description:
          "The premier university judo competition in the UK. Teams from over 40 universities will compete across multiple weight categories. Spectators welcome! Our club will be fielding a full squad - come support your teammates!",
        eventType: "competition" as const,
        location: "Crystal Palace National Sports Centre, London SE19 2BB",
        startDate: new Date("2026-02-15T09:00:00").getTime(),
        endDate: new Date("2026-02-15T18:00:00").getTime(),
        registrationDeadline: new Date("2026-02-01T23:59:00").getTime(),
        maxParticipants: 15,
        currentParticipants: 0,
        requiresRegistration: true,
        cost: 20,
        organizerId: "coach-joe-doherty",
        organizerName: "Joe Doherty",
        status: "published" as const,
        imageUrl:
          "https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=800",
      },
      {
        title: "February Grading Examination",
        description:
          "Quarterly grading for all members ready to test for their next belt. Participants will demonstrate required techniques, kata, and randori. Family and friends welcome to watch. Results announced same day.",
        eventType: "grading" as const,
        location: "Central YMCA, Studio A",
        startDate: new Date("2026-02-08T14:00:00").getTime(),
        endDate: new Date("2026-02-08T17:00:00").getTime(),
        registrationDeadline: new Date("2026-02-05T23:59:00").getTime(),
        maxParticipants: 25,
        currentParticipants: 0,
        requiresRegistration: true,
        organizerId: "coach-joe-doherty",
        organizerName: "Joe Doherty",
        status: "published" as const,
        imageUrl:
          "https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800",
      },
      {
        title: "Olympic Coach Seminar - Kate Richardson",
        description:
          "Join us for an exclusive 2-hour seminar with Kate Richardson, Olympic bronze medalist and GB national team coach. Focus on advanced throwing techniques, transition work, and competition strategy. Suitable for orange belt and above. Early booking recommended!",
        eventType: "seminar" as const,
        location: "Central YMCA, Studio A",
        startDate: new Date("2026-01-25T11:30:00").getTime(),
        endDate: new Date("2026-01-25T13:30:00").getTime(),
        registrationDeadline: new Date("2026-01-23T23:59:00").getTime(),
        maxParticipants: 30,
        currentParticipants: 0,
        requiresRegistration: true,
        cost: 15,
        organizerId: "coach-joe-doherty",
        organizerName: "Joe Doherty",
        status: "published" as const,
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      },
      {
        title: "Club Social & End of Term Celebration",
        description:
          "Join us for our end of term social at The Marquis Cornwall pub. Drinks, food, and good company! Open to all members and their guests. A great chance to get to know your fellow judoka outside the dojo. First round on the club!",
        eventType: "social" as const,
        location:
          "The Marquis Cornwall, 31 Marchmont Street, London WC1N 1AP",
        startDate: new Date("2026-03-20T19:30:00").getTime(),
        endDate: new Date("2026-03-20T23:00:00").getTime(),
        maxParticipants: 50,
        currentParticipants: 0,
        requiresRegistration: false,
        organizerId: "content-joseph",
        organizerName: "Joseph Clarke",
        status: "published" as const,
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800",
      },
      {
        title: "Intensive Weekend Training Camp",
        description:
          "Two-day intensive training camp featuring multiple sessions per day, randori practice, technical workshops, and video analysis. Accommodation not included but recommendations available. Suitable for committed students looking to accelerate their progress. Limited places!",
        eventType: "training" as const,
        location: "Bisham Abbey National Sports Centre, Marlow SL7 1RT",
        startDate: new Date("2026-04-12T09:00:00").getTime(),
        endDate: new Date("2026-04-13T16:00:00").getTime(),
        registrationDeadline: new Date("2026-04-01T23:59:00").getTime(),
        maxParticipants: 20,
        currentParticipants: 0,
        requiresRegistration: true,
        cost: 45,
        organizerId: "coach-joe-doherty",
        organizerName: "Joe Doherty",
        status: "published" as const,
        imageUrl:
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
      },
    ];

    for (const event of events) {
      await ctx.db.insert("events", {
        ...event,
        createdAt: now - 10 * 24 * 60 * 60 * 1000,
        updatedAt: now - 5 * 24 * 60 * 60 * 1000,
      });
    }

    // ===== MEDIA GALLERY =====
    const media = [
      {
        title: "Monday Beginners Class - January 2026",
        description: "Great turnout for the new year!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=1200",
        category: "training" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["beginners", "training", "2026"],
        createdAt: now - 6 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Competition Squad Training",
        description: "Preparing for BUCS Championships",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200",
        category: "training" as const,
        uploadedBy: "coach-joe-doherty",
        uploadedByName: "Joe Doherty",
        tags: ["competition", "training", "crystal palace"],
        createdAt: now - 5 * 24 * 60 * 60 * 1000,
      },
      {
        title: "December Grading Success",
        description: "Congratulations to all who passed!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=1200",
        category: "grading" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["grading", "belts", "achievement"],
        createdAt: now - 20 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Christmas Social 2025",
        description: "What a night! Thanks to everyone who came.",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200",
        category: "social" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["social", "christmas", "2025"],
        createdAt: now - 25 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Randori Practice - Advanced Class",
        description: "Intense sparring session",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200",
        category: "training" as const,
        uploadedBy: "coach-sarah-mitchell",
        uploadedByName: "Sarah Mitchell",
        tags: ["randori", "advanced", "sparring"],
        createdAt: now - 8 * 24 * 60 * 60 * 1000,
      },
      {
        title: "New Members Welcome Session",
        description: "Fresh faces joining the club!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200",
        category: "training" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["beginners", "welcome", "new members"],
        createdAt: now - 12 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Saturday Morning Fundamentals",
        description: "Working on breakfalls and ukemi",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200",
        category: "training" as const,
        uploadedBy: "coach-sarah-mitchell",
        uploadedByName: "Sarah Mitchell",
        tags: ["fundamentals", "technique", "saturday"],
        createdAt: now - 4 * 24 * 60 * 60 * 1000,
      },
      {
        title: "London Open Competition Results",
        description: "Bronze medals for Alice and Mohammed!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200",
        category: "competition" as const,
        uploadedBy: "coach-joe-doherty",
        uploadedByName: "Joe Doherty",
        tags: ["competition", "medals", "achievement"],
        createdAt: now - 30 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Central YMCA Training Hall",
        description: "Our main training venue",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
        category: "other" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["venue", "ymca", "facilities"],
        createdAt: now - 40 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Throwing Practice - Uchi Mata Focus",
        description: "Technical session on inner thigh throws",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1559163499-413811fb2344?w=1200",
        category: "training" as const,
        uploadedBy: "coach-joe-doherty",
        uploadedByName: "Joe Doherty",
        tags: ["technique", "uchi mata", "throws"],
        createdAt: now - 9 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Sunday Open Mat",
        description: "Free practice and open sparring",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1517344800994-1e9b4f11568e?w=1200",
        category: "training" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["open mat", "sunday", "sparring"],
        createdAt: now - 3 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Newaza Groundwork Session",
        description: "Working on pins and submissions",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200",
        category: "training" as const,
        uploadedBy: "coach-sarah-mitchell",
        uploadedByName: "Sarah Mitchell",
        tags: ["newaza", "groundwork", "technique"],
        createdAt: now - 11 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Pre-Competition Team Photo",
        description: "Good luck at BUCS team!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200",
        category: "competition" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["team", "competition", "bucs"],
        createdAt: now - 2 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Autumn Term Showcase",
        description: "End of term demonstration for families",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200",
        category: "other" as const,
        uploadedBy: "coach-joe-doherty",
        uploadedByName: "Joe Doherty",
        tags: ["showcase", "demonstration", "families"],
        createdAt: now - 50 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Kids Class Visit",
        description: "Local school group trying judo for the first time",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200",
        category: "other" as const,
        uploadedBy: "coach-sarah-mitchell",
        uploadedByName: "Sarah Mitchell",
        tags: ["kids", "outreach", "beginners"],
        createdAt: now - 14 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Thursday Intermediate Class",
        description: "Combination techniques and transition drills",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1577221861138-e6a9b99d2e89?w=1200",
        category: "training" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["intermediate", "thursday", "technique"],
        createdAt: now - 7 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Club Anniversary Celebration",
        description: "58 years of judo excellence!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200",
        category: "social" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["anniversary", "history", "celebration"],
        createdAt: now - 60 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Fitness Circuit Training",
        description: "Building strength and conditioning",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1517344800994-1e9b4f11568e?w=1200",
        category: "training" as const,
        uploadedBy: "coach-sarah-mitchell",
        uploadedByName: "Sarah Mitchell",
        tags: ["fitness", "conditioning", "circuit"],
        createdAt: now - 13 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Black Belt Ceremony",
        description: "Congratulations to our newest black belts!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=1200",
        category: "grading" as const,
        uploadedBy: "coach-joe-doherty",
        uploadedByName: "Joe Doherty",
        tags: ["black belt", "ceremony", "achievement"],
        createdAt: now - 70 * 24 * 60 * 60 * 1000,
      },
      {
        title: "New Year Training Kickoff",
        description: "Starting 2026 strong!",
        mediaType: "image" as const,
        url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200",
        category: "training" as const,
        uploadedBy: "content-joseph",
        uploadedByName: "Joseph Clarke",
        tags: ["new year", "2026", "training"],
        createdAt: now - 15 * 24 * 60 * 60 * 1000,
      },
    ];

    for (const item of media) {
      await ctx.db.insert("media", item);
    }

    return {
      success: true,
      message:
        "University of London Judo Club database seeded successfully with comprehensive mock data",
      counts: {
        clubProfile: 1,
        admins: 4,
        classes: 7,
        members: membersData.length,
        announcements: announcements.length,
        events: events.length,
        media: media.length,
        attendanceRecords: "~3 weeks (Dec 30 2025 - Jan 20 2026)",
        payments: "Last 30 days for all active members",
      },
    };
  },
});
