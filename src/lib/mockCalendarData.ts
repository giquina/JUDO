// Mock Calendar Data for Judo Club App
// This file contains comprehensive mock data for classes, events, bookings, and recommendations

export type BeltRank = "white" | "yellow" | "orange" | "green" | "blue" | "brown" | "black";
export type ClassLevel = "beginner" | "intermediate" | "advanced" | "all-levels" | "competition";
export type ClassType = "fundamentals" | "technique" | "randori" | "kata" | "competition-prep" | "grading-prep" | "kids";
export type BookingStatus = "confirmed" | "waitlist" | "cancelled";
export type AttendanceStatus = "attended" | "missed" | "upcoming" | "booked";

export interface JudoClass {
  id: string;
  name: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  duration: number; // minutes
  coach: string;
  coachId: string;
  level: ClassLevel;
  type: ClassType;
  capacity: number;
  currentBookings: number;
  location: string;
  description: string;
  difficulty: number; // 1-5
  requiredEquipment: string[];
  recurring: boolean;
  color: string; // For calendar color coding
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: "grading" | "competition" | "seminar" | "social" | "holiday";
  location?: string;
  description?: string;
  color: string;
  registrationRequired?: boolean;
  registered?: boolean;
}

export interface ClassBooking {
  id: string;
  classId: string;
  userId: string;
  date: Date;
  status: BookingStatus;
  recurring?: boolean;
  recurringPattern?: "weekly" | "biweekly";
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  userId: string;
  date: Date;
  status: AttendanceStatus;
  className: string;
  points?: number;
}

export interface Recommendation {
  id: string;
  type: "class" | "event" | "partner" | "achievement" | "content" | "goal";
  title: string;
  description: string;
  reason: string;
  priority: "high" | "medium" | "low";
  actionLabel: string;
  actionUrl?: string;
  relatedId?: string;
  dismissed?: boolean;
  icon: string;
}

export interface SmartInsight {
  id: string;
  type: "attendance" | "streak" | "progress" | "comparison" | "suggestion" | "milestone";
  message: string;
  details?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  actionable?: boolean;
  actionLabel?: string;
  icon: string;
  variant: "default" | "success" | "warning" | "danger";
}

export interface TrainingPartner {
  id: string;
  name: string;
  beltRank: BeltRank;
  avatar?: string;
  commonClasses: string[];
  attendanceMatch: number; // Percentage
}

// Mock Coaches
export const mockCoaches = [
  { id: "coach1", name: "Sensei David Martinez", specialty: "Competition", avatar: "👨‍🏫" },
  { id: "coach2", name: "Sensei Emma Thompson", specialty: "Fundamentals", avatar: "👩‍🏫" },
  { id: "coach3", name: "Sensei James Wilson", specialty: "Kata", avatar: "👨‍🏫" },
  { id: "coach4", name: "Coach Sarah Johnson", specialty: "Youth Development", avatar: "👩‍🏫" },
];

// Mock Classes (Recurring Weekly Schedule)
export const mockClasses: JudoClass[] = [
  {
    id: "class-mon-1",
    name: "Monday Evening Fundamentals",
    dayOfWeek: 1,
    startTime: "19:00",
    duration: 90,
    coach: "Sensei Emma Thompson",
    coachId: "coach2",
    level: "beginner",
    type: "fundamentals",
    capacity: 20,
    currentBookings: 15,
    location: "Main Dojo",
    description: "Perfect for beginners. Focus on basic techniques, breakfalls, and fundamental grips.",
    difficulty: 1,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#10b981", // green
  },
  {
    id: "class-mon-2",
    name: "Monday Advanced Randori",
    dayOfWeek: 1,
    startTime: "20:45",
    duration: 75,
    coach: "Sensei David Martinez",
    coachId: "coach1",
    level: "advanced",
    type: "randori",
    capacity: 16,
    currentBookings: 12,
    location: "Main Dojo",
    description: "High-intensity sparring session for experienced judoka. Competitive pace.",
    difficulty: 5,
    requiredEquipment: ["Gi", "Belt", "Mouthguard"],
    recurring: true,
    color: "#ef4444", // red
  },
  {
    id: "class-tue-1",
    name: "Tuesday Technique Workshop",
    dayOfWeek: 2,
    startTime: "18:30",
    duration: 90,
    coach: "Sensei James Wilson",
    coachId: "coach3",
    level: "intermediate",
    type: "technique",
    capacity: 18,
    currentBookings: 14,
    location: "Main Dojo",
    description: "Deep dive into specific techniques. This week: Seoi Nage variations.",
    difficulty: 3,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#3b82f6", // blue
  },
  {
    id: "class-wed-1",
    name: "Wednesday All-Levels",
    dayOfWeek: 3,
    startTime: "19:00",
    duration: 90,
    coach: "Sensei Emma Thompson",
    coachId: "coach2",
    level: "all-levels",
    type: "fundamentals",
    capacity: 24,
    currentBookings: 20,
    location: "Main Dojo",
    description: "Mixed ability class. Beginners and advanced students train together.",
    difficulty: 2,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#8b5cf6", // violet
  },
  {
    id: "class-thu-1",
    name: "Thursday Kids Judo",
    dayOfWeek: 4,
    startTime: "17:00",
    duration: 60,
    coach: "Coach Sarah Johnson",
    coachId: "coach4",
    level: "beginner",
    type: "kids",
    capacity: 15,
    currentBookings: 12,
    location: "Kids Area",
    description: "Fun and engaging judo for ages 6-12. Focus on discipline and basic skills.",
    difficulty: 1,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#f59e0b", // amber
  },
  {
    id: "class-thu-2",
    name: "Thursday Intermediate",
    dayOfWeek: 4,
    startTime: "19:00",
    duration: 90,
    coach: "Sensei David Martinez",
    coachId: "coach1",
    level: "intermediate",
    type: "technique",
    capacity: 20,
    currentBookings: 16,
    location: "Main Dojo",
    description: "Progression class for intermediate students working toward blue belt.",
    difficulty: 3,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#3b82f6", // blue
  },
  {
    id: "class-fri-1",
    name: "Friday Competition Prep",
    dayOfWeek: 5,
    startTime: "19:00",
    duration: 120,
    coach: "Sensei David Martinez",
    coachId: "coach1",
    level: "competition",
    type: "competition-prep",
    capacity: 12,
    currentBookings: 10,
    location: "Main Dojo",
    description: "Training for upcoming competitions. Intense randori and match simulation.",
    difficulty: 5,
    requiredEquipment: ["Gi", "Belt", "Mouthguard", "IJF-approved Gi for competitions"],
    recurring: true,
    color: "#dc2626", // red-600
  },
  {
    id: "class-sat-1",
    name: "Saturday Morning All-Levels",
    dayOfWeek: 6,
    startTime: "10:00",
    duration: 90,
    coach: "Sensei Emma Thompson",
    coachId: "coach2",
    level: "all-levels",
    type: "fundamentals",
    capacity: 25,
    currentBookings: 22,
    location: "Main Dojo",
    description: "Popular weekend class. Great mix of students and relaxed atmosphere.",
    difficulty: 2,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#10b981", // green
  },
  {
    id: "class-sat-2",
    name: "Saturday Kata Practice",
    dayOfWeek: 6,
    startTime: "12:00",
    duration: 90,
    coach: "Sensei James Wilson",
    coachId: "coach3",
    level: "intermediate",
    type: "kata",
    capacity: 16,
    currentBookings: 8,
    location: "Main Dojo",
    description: "Practice Nage-no-Kata and other formal kata. Essential for grading.",
    difficulty: 4,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#6366f1", // indigo
  },
  {
    id: "class-sun-1",
    name: "Sunday Open Mat",
    dayOfWeek: 0,
    startTime: "14:00",
    duration: 120,
    coach: "Various",
    coachId: "coach1",
    level: "all-levels",
    type: "randori",
    capacity: 30,
    currentBookings: 18,
    location: "Main Dojo",
    description: "Casual open training. Practice what you want, work with different partners.",
    difficulty: 2,
    requiredEquipment: ["Gi", "Belt"],
    recurring: true,
    color: "#06b6d4", // cyan
  },
];

// Generate Calendar Events for 3 months (past, current, future)
export const generateCalendarEvents = (): CalendarEvent[] => {
  const now = new Date();
  const events: CalendarEvent[] = [];

  // Upcoming Grading
  const nextGrading = new Date(now);
  nextGrading.setDate(now.getDate() + 21);
  events.push({
    id: "event-grading-1",
    title: "Belt Grading",
    date: nextGrading,
    startTime: "10:00",
    endTime: "14:00",
    type: "grading",
    location: "Main Dojo",
    description: "Quarterly belt grading for all levels. Register by " + new Date(nextGrading.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    color: "#f59e0b", // amber
    registrationRequired: true,
    registered: false,
  });

  // Past Competition
  const pastComp = new Date(now);
  pastComp.setDate(now.getDate() - 14);
  events.push({
    id: "event-comp-1",
    title: "London Open Championships",
    date: pastComp,
    startTime: "09:00",
    endTime: "17:00",
    type: "competition",
    location: "Crystal Palace National Sports Centre",
    description: "Regional judo competition. Great experience for all levels.",
    color: "#dc2626", // red-600
    registrationRequired: true,
    registered: true,
  });

  // Upcoming Competition
  const futureComp = new Date(now);
  futureComp.setDate(now.getDate() + 42);
  events.push({
    id: "event-comp-2",
    title: "British University Championships",
    date: futureComp,
    startTime: "08:00",
    endTime: "18:00",
    type: "competition",
    location: "Birmingham NEC",
    description: "Annual university championship. Team and individual events.",
    color: "#dc2626", // red-600
    registrationRequired: true,
    registered: false,
  });

  // Seminar
  const seminar = new Date(now);
  seminar.setDate(now.getDate() + 35);
  events.push({
    id: "event-seminar-1",
    title: "Olympic Coach Master Class",
    date: seminar,
    startTime: "13:00",
    endTime: "17:00",
    type: "seminar",
    location: "Main Dojo",
    description: "Special seminar with Olympic coach. Limited spots available!",
    color: "#8b5cf6", // violet
    registrationRequired: true,
    registered: false,
  });

  // Social Event
  const social = new Date(now);
  social.setDate(now.getDate() + 28);
  events.push({
    id: "event-social-1",
    title: "Club Social Evening",
    date: social,
    startTime: "19:00",
    endTime: "22:00",
    type: "social",
    location: "The Judo Arms Pub",
    description: "Monthly social gathering. No gi required!",
    color: "#10b981", // green
    registrationRequired: false,
  });

  // Holiday Closure
  const holiday = new Date(now);
  holiday.setDate(now.getDate() + 60);
  events.push({
    id: "event-holiday-1",
    title: "Easter Break - No Classes",
    date: holiday,
    type: "holiday",
    description: "Dojo closed for Easter holidays. Resumes April 10th.",
    color: "#6b7280", // gray
  });

  return events;
};

// Generate User's Bookings
export const generateMockBookings = (userId: string = "user123"): ClassBooking[] => {
  const now = new Date();
  const bookings: ClassBooking[] = [];

  // User regularly attends Monday and Wednesday
  const regularClasses = ["class-mon-1", "class-wed-1", "class-sat-1"];

  regularClasses.forEach((classId) => {
    // Book for next 4 weeks
    for (let week = 0; week < 4; week++) {
      const classInfo = mockClasses.find(c => c.id === classId);
      if (!classInfo) continue;

      const bookingDate = new Date(now);
      bookingDate.setDate(now.getDate() + (week * 7) + (classInfo.dayOfWeek - now.getDay()));

      bookings.push({
        id: `booking-${classId}-${week}`,
        classId,
        userId,
        date: bookingDate,
        status: "confirmed",
        recurring: true,
        recurringPattern: "weekly",
      });
    }
  });

  // One-off booking for Friday competition prep
  const oneOffDate = new Date(now);
  oneOffDate.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7)); // Next Friday
  bookings.push({
    id: "booking-oneoff-1",
    classId: "class-fri-1",
    userId,
    date: oneOffDate,
    status: "confirmed",
    notes: "Trying out competition prep",
  });

  return bookings;
};

// Generate Attendance History (last 3 months)
export const generateAttendanceHistory = (userId: string = "user123"): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const now = new Date();

  // Simulate 3 months of attendance
  const regularClasses = [
    { id: "class-mon-1", name: "Monday Evening Fundamentals" },
    { id: "class-wed-1", name: "Wednesday All-Levels" },
    { id: "class-sat-1", name: "Saturday Morning All-Levels" },
  ];

  for (let weeksAgo = 12; weeksAgo > 0; weeksAgo--) {
    regularClasses.forEach(({ id, name }) => {
      const classInfo = mockClasses.find(c => c.id === id);
      if (!classInfo) return;

      const recordDate = new Date(now);
      recordDate.setDate(now.getDate() - (weeksAgo * 7) + (classInfo.dayOfWeek - now.getDay()));

      // 85% attendance rate
      const attended = Math.random() > 0.15;

      records.push({
        id: `attendance-${id}-${weeksAgo}`,
        classId: id,
        userId,
        date: recordDate,
        status: attended ? "attended" : "missed",
        className: name,
        points: attended ? 10 : 0,
      });
    });
  }

  return records.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate Personalized Recommendations
export const generateRecommendations = (_userLevel: BeltRank = "blue"): Recommendation[] => {
  const recommendations: Recommendation[] = [
    {
      id: "rec-1",
      type: "class",
      title: "Try Advanced Randori",
      description: "You're ready for the next level! Join Monday Advanced Randori.",
      reason: "Based on your attendance and progress in intermediate classes, you're performing at advanced level.",
      priority: "high",
      actionLabel: "View Class Details",
      relatedId: "class-mon-2",
      icon: "TrendingUp",
    },
    {
      id: "rec-2",
      type: "event",
      title: "Register for Belt Grading",
      description: "You qualify for grading to brown belt. Registration closes in 7 days.",
      reason: "You've attended 45+ sessions and demonstrated required techniques.",
      priority: "high",
      actionLabel: "Register Now",
      relatedId: "event-grading-1",
      icon: "Award",
    },
    {
      id: "rec-3",
      type: "partner",
      title: "Connect with Sarah Chen",
      description: "Sarah also attends Monday 7pm and is at your level.",
      reason: "You both attend the same classes and are working toward similar goals.",
      priority: "medium",
      actionLabel: "Send Message",
      relatedId: "user-sarah",
      icon: "Users",
    },
    {
      id: "rec-4",
      type: "achievement",
      title: "2 Sessions from Achievement",
      description: "Attend 2 more classes this month to unlock '50 Sessions' badge.",
      reason: "You're on track to complete this milestone. Keep up the great work!",
      priority: "medium",
      actionLabel: "View Progress",
      icon: "Target",
    },
    {
      id: "rec-5",
      type: "content",
      title: "Watch: Seoi Nage Masterclass",
      description: "Improve your seoi nage with this video from Olympic medalist.",
      reason: "You practiced this technique in your last class.",
      priority: "low",
      actionLabel: "Watch Video",
      relatedId: "video-seoi-nage",
      icon: "Play",
    },
    {
      id: "rec-6",
      type: "class",
      title: "Join Competition Prep Group",
      description: "Friday competition prep sessions starting next week.",
      reason: "Several blue belts are preparing for British Championships. Great opportunity!",
      priority: "medium",
      actionLabel: "Book Class",
      relatedId: "class-fri-1",
      icon: "Trophy",
    },
    {
      id: "rec-7",
      type: "goal",
      title: "Set Your Next Goal",
      description: "You've achieved your attendance goal. Time to set a new challenge!",
      reason: "Goal-oriented training improves results by 40%.",
      priority: "low",
      actionLabel: "Set Goal",
      icon: "Flag",
    },
  ];

  return recommendations;
};

// Generate Smart Insights
export const generateSmartInsights = (): SmartInsight[] => {
  return [
    {
      id: "insight-1",
      type: "attendance",
      message: "Your attendance is up 20% this month!",
      details: "You've attended 12 classes compared to 10 last month. Excellent consistency.",
      trend: "up",
      trendValue: 20,
      icon: "TrendingUp",
      variant: "success",
    },
    {
      id: "insight-2",
      type: "streak",
      message: "Your streak is at risk!",
      details: "Book a class before Friday to maintain your 6-week attendance streak.",
      actionable: true,
      actionLabel: "Book Class",
      icon: "Flame",
      variant: "warning",
    },
    {
      id: "insight-3",
      type: "progress",
      message: "5 more sessions to hit your monthly goal",
      details: "You're targeting 15 sessions this month. Currently at 10/15.",
      actionable: true,
      actionLabel: "View Schedule",
      icon: "Target",
      variant: "default",
    },
    {
      id: "insight-4",
      type: "comparison",
      message: "You're in the top 25% for attendance",
      details: "Your attendance rate is 85%, above the club average of 68%.",
      trend: "up",
      icon: "BarChart3",
      variant: "success",
    },
    {
      id: "insight-5",
      type: "suggestion",
      message: "You train most on Mondays",
      details: "65% of your sessions are on Monday. Consider adding variety to your schedule.",
      actionable: true,
      actionLabel: "Explore Classes",
      icon: "Calendar",
      variant: "default",
    },
    {
      id: "insight-6",
      type: "milestone",
      message: "Next milestone: 50 Total Sessions",
      details: "You're 3 sessions away! This unlocks the 'Dedicated Student' achievement.",
      trend: "up",
      actionable: true,
      actionLabel: "View Achievements",
      icon: "Award",
      variant: "success",
    },
  ];
};

// Generate Training Partners
export const generateTrainingPartners = (): TrainingPartner[] => {
  return [
    {
      id: "partner-1",
      name: "Sarah Chen",
      beltRank: "blue",
      avatar: "SC",
      commonClasses: ["Monday Evening Fundamentals", "Wednesday All-Levels"],
      attendanceMatch: 87,
    },
    {
      id: "partner-2",
      name: "Marcus Williams",
      beltRank: "brown",
      avatar: "MW",
      commonClasses: ["Monday Advanced Randori", "Friday Competition Prep"],
      attendanceMatch: 65,
    },
    {
      id: "partner-3",
      name: "Emily Rodriguez",
      beltRank: "blue",
      avatar: "ER",
      commonClasses: ["Saturday Morning All-Levels", "Wednesday All-Levels"],
      attendanceMatch: 78,
    },
    {
      id: "partner-4",
      name: "Tom Anderson",
      beltRank: "green",
      avatar: "TA",
      commonClasses: ["Monday Evening Fundamentals", "Saturday Morning All-Levels"],
      attendanceMatch: 72,
    },
  ];
};

// Helper function to get class instances for a date range
export const getClassInstancesForDateRange = (startDate: Date, endDate: Date): Array<{
  classInfo: JudoClass;
  date: Date;
  startDateTime: Date;
  endDateTime: Date;
}> => {
  const instances: Array<{
    classInfo: JudoClass;
    date: Date;
    startDateTime: Date;
    endDateTime: Date;
  }> = [];

  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    // Find all classes for this day
    const classesForDay = mockClasses.filter(c => c.dayOfWeek === dayOfWeek);

    classesForDay.forEach(classInfo => {
      const [hours, minutes] = classInfo.startTime.split(':').map(Number);
      const startDateTime = new Date(currentDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + classInfo.duration);

      instances.push({
        classInfo,
        date: new Date(currentDate),
        startDateTime,
        endDateTime,
      });
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return instances;
};

// Helper function to check if user has booking for a class instance
export const hasBooking = (classId: string, date: Date, bookings: ClassBooking[]): ClassBooking | undefined => {
  return bookings.find(booking => {
    const bookingDate = new Date(booking.date);
    const targetDate = new Date(date);
    return booking.classId === classId &&
      bookingDate.toDateString() === targetDate.toDateString() &&
      booking.status !== "cancelled";
  });
};

// Helper function to get attendance status for a class instance
export const getAttendanceStatus = (classId: string, date: Date, attendance: AttendanceRecord[]): AttendanceStatus => {
  const record = attendance.find(att => {
    const attDate = new Date(att.date);
    const targetDate = new Date(date);
    return att.classId === classId && attDate.toDateString() === targetDate.toDateString();
  });

  if (!record) return "upcoming";
  return record.status;
};

// Export default mock data
export const mockCalendarData = {
  classes: mockClasses,
  events: generateCalendarEvents(),
  bookings: generateMockBookings(),
  attendance: generateAttendanceHistory(),
  recommendations: generateRecommendations(),
  insights: generateSmartInsights(),
  trainingPartners: generateTrainingPartners(),
  coaches: mockCoaches,
};
