// Mock data for Activity Feed, Announcements, and Events
// University of London Judo Club themed

export type ActivityType =
  | 'check-in'
  | 'belt-promotion'
  | 'new-member'
  | 'event-signup'
  | 'achievement'
  | 'announcement';

export type AnnouncementCategory = 'competition' | 'training' | 'social' | 'admin';
export type AnnouncementPriority = 'urgent' | 'important' | 'info';
export type EventType = 'competition' | 'grading' | 'social' | 'training-camp';
export type RSVPStatus = 'going' | 'maybe' | 'not-going' | null;

export interface Activity {
  _id: string;
  type: ActivityType;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: number;
  metadata?: {
    beltRank?: string;
    eventName?: string;
    achievementName?: string;
    announcementTitle?: string;
  };
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  isPinned: boolean;
  isRead: boolean;
  author: {
    name: string;
    role: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  date: number;
  endDate?: number;
  location: string;
  capacity: number;
  attendees: number;
  rsvpStatus: RSVPStatus;
  thumbnail?: string;
  organizer: string;
  isFeatured: boolean;
}

// Helper function to get time ago
const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

// Mock Activities
export const mockActivities: Activity[] = [
  {
    _id: "act-001",
    type: "check-in",
    user: { name: "Sarah Johnson", initials: "SJ" },
    content: "checked in for Monday Evening Fundamentals",
    timestamp: now - 5 * minute,
  },
  {
    _id: "act-002",
    type: "belt-promotion",
    user: { name: "Marcus Chen", initials: "MC" },
    content: "earned their Blue Belt",
    timestamp: now - 15 * minute,
    metadata: { beltRank: "blue" },
  },
  {
    _id: "act-003",
    type: "new-member",
    user: { name: "Emma Williams", initials: "EW" },
    content: "joined the club",
    timestamp: now - 1 * hour,
  },
  {
    _id: "act-004",
    type: "check-in",
    user: { name: "James Potter", initials: "JP" },
    content: "checked in for Monday Evening Fundamentals",
    timestamp: now - 1 * hour,
  },
  {
    _id: "act-005",
    type: "event-signup",
    user: { name: "Olivia Brown", initials: "OB" },
    content: "signed up for London Universities Championship",
    timestamp: now - 2 * hour,
    metadata: { eventName: "London Universities Championship" },
  },
  {
    _id: "act-006",
    type: "achievement",
    user: { name: "Alice Chen", initials: "AC" },
    content: "unlocked '50 Sessions' achievement",
    timestamp: now - 3 * hour,
    metadata: { achievementName: "50 Sessions" },
  },
  {
    _id: "act-007",
    type: "check-in",
    user: { name: "David Lee", initials: "DL" },
    content: "checked in for Advanced Training",
    timestamp: now - 4 * hour,
  },
  {
    _id: "act-008",
    type: "belt-promotion",
    user: { name: "Sophie Anderson", initials: "SA" },
    content: "earned their Green Belt",
    timestamp: now - 5 * hour,
    metadata: { beltRank: "green" },
  },
  {
    _id: "act-009",
    type: "announcement",
    user: { name: "Coach Mike", initials: "CM" },
    content: "posted a new announcement about Competition Training",
    timestamp: now - 6 * hour,
    metadata: { announcementTitle: "Competition Training Sessions" },
  },
  {
    _id: "act-010",
    type: "event-signup",
    user: { name: "Ryan Thomas", initials: "RT" },
    content: "signed up for Winter Training Camp",
    timestamp: now - 8 * hour,
    metadata: { eventName: "Winter Training Camp" },
  },
  {
    _id: "act-011",
    type: "check-in",
    user: { name: "Isabella Martinez", initials: "IM" },
    content: "checked in for Intermediate Class",
    timestamp: now - 10 * hour,
  },
  {
    _id: "act-012",
    type: "new-member",
    user: { name: "Lucas White", initials: "LW" },
    content: "joined the club",
    timestamp: now - 12 * hour,
  },
  {
    _id: "act-013",
    type: "achievement",
    user: { name: "Mia Robinson", initials: "MR" },
    content: "unlocked 'Early Bird' achievement",
    timestamp: now - 1 * day,
    metadata: { achievementName: "Early Bird" },
  },
  {
    _id: "act-014",
    type: "belt-promotion",
    user: { name: "Ethan Harris", initials: "EH" },
    content: "earned their Yellow Belt",
    timestamp: now - 1 * day,
    metadata: { beltRank: "yellow" },
  },
  {
    _id: "act-015",
    type: "check-in",
    user: { name: "Ava Taylor", initials: "AT" },
    content: "checked in for Friday Advanced",
    timestamp: now - 1 * day,
  },
  {
    _id: "act-016",
    type: "event-signup",
    user: { name: "Noah Walker", initials: "NW" },
    content: "signed up for Belt Grading Exam",
    timestamp: now - 1 * day,
    metadata: { eventName: "Belt Grading Exam" },
  },
  {
    _id: "act-017",
    type: "check-in",
    user: { name: "Charlotte King", initials: "CK" },
    content: "checked in for Wednesday Intermediate",
    timestamp: now - 1 * day,
  },
  {
    _id: "act-018",
    type: "achievement",
    user: { name: "Liam Scott", initials: "LS" },
    content: "unlocked 'Perfect Month' achievement",
    timestamp: now - 2 * day,
    metadata: { achievementName: "Perfect Month" },
  },
  {
    _id: "act-019",
    type: "new-member",
    user: { name: "Amelia Green", initials: "AG" },
    content: "joined the club",
    timestamp: now - 2 * day,
  },
  {
    _id: "act-020",
    type: "belt-promotion",
    user: { name: "Benjamin Adams", initials: "BA" },
    content: "earned their Orange Belt",
    timestamp: now - 2 * day,
    metadata: { beltRank: "orange" },
  },
  {
    _id: "act-021",
    type: "check-in",
    user: { name: "Harper Baker", initials: "HB" },
    content: "checked in for Monday Fundamentals",
    timestamp: now - 2 * day,
  },
  {
    _id: "act-022",
    type: "event-signup",
    user: { name: "Mason Nelson", initials: "MN" },
    content: "signed up for Spring Social Event",
    timestamp: now - 2 * day,
    metadata: { eventName: "Spring Social Event" },
  },
  {
    _id: "act-023",
    type: "announcement",
    user: { name: "Sensei Yuki", initials: "SY" },
    content: "posted a new announcement about Dojo Etiquette",
    timestamp: now - 3 * day,
    metadata: { announcementTitle: "Dojo Etiquette Reminder" },
  },
  {
    _id: "act-024",
    type: "check-in",
    user: { name: "Evelyn Carter", initials: "EC" },
    content: "checked in for Advanced Training",
    timestamp: now - 3 * day,
  },
  {
    _id: "act-025",
    type: "achievement",
    user: { name: "Alexander Mitchell", initials: "AM" },
    content: "unlocked 'Dedication' achievement",
    timestamp: now - 3 * day,
    metadata: { achievementName: "Dedication" },
  },
  {
    _id: "act-026",
    type: "belt-promotion",
    user: { name: "Abigail Perez", initials: "AP" },
    content: "earned their Brown Belt",
    timestamp: now - 3 * day,
    metadata: { beltRank: "brown" },
  },
  {
    _id: "act-027",
    type: "new-member",
    user: { name: "Daniel Roberts", initials: "DR" },
    content: "joined the club",
    timestamp: now - 4 * day,
  },
  {
    _id: "act-028",
    type: "check-in",
    user: { name: "Emily Turner", initials: "ET" },
    content: "checked in for Wednesday Intermediate",
    timestamp: now - 4 * day,
  },
  {
    _id: "act-029",
    type: "event-signup",
    user: { name: "Michael Phillips", initials: "MP" },
    content: "signed up for Inter-University Tournament",
    timestamp: now - 4 * day,
    metadata: { eventName: "Inter-University Tournament" },
  },
  {
    _id: "act-030",
    type: "achievement",
    user: { name: "Sofia Campbell", initials: "SC" },
    content: "unlocked 'Team Player' achievement",
    timestamp: now - 4 * day,
    metadata: { achievementName: "Team Player" },
  },
  {
    _id: "act-031",
    type: "check-in",
    user: { name: "Matthew Parker", initials: "MP" },
    content: "checked in for Friday Advanced",
    timestamp: now - 5 * day,
  },
  {
    _id: "act-032",
    type: "belt-promotion",
    user: { name: "Elizabeth Evans", initials: "EE" },
    content: "earned their Black Belt",
    timestamp: now - 5 * day,
    metadata: { beltRank: "black" },
  },
  {
    _id: "act-033",
    type: "new-member",
    user: { name: "Joseph Edwards", initials: "JE" },
    content: "joined the club",
    timestamp: now - 5 * day,
  },
  {
    _id: "act-034",
    type: "announcement",
    user: { name: "Coach Sarah", initials: "CS" },
    content: "posted a new announcement about Equipment Maintenance",
    timestamp: now - 5 * day,
    metadata: { announcementTitle: "Equipment Maintenance Day" },
  },
  {
    _id: "act-035",
    type: "check-in",
    user: { name: "Victoria Collins", initials: "VC" },
    content: "checked in for Monday Fundamentals",
    timestamp: now - 6 * day,
  },
  {
    _id: "act-036",
    type: "event-signup",
    user: { name: "Christopher Stewart", initials: "CS" },
    content: "signed up for Summer Training Camp",
    timestamp: now - 6 * day,
    metadata: { eventName: "Summer Training Camp" },
  },
  {
    _id: "act-037",
    type: "achievement",
    user: { name: "Madison Sanchez", initials: "MS" },
    content: "unlocked 'First Win' achievement",
    timestamp: now - 6 * day,
    metadata: { achievementName: "First Win" },
  },
  {
    _id: "act-038",
    type: "belt-promotion",
    user: { name: "Anthony Morris", initials: "AM" },
    content: "earned their Blue Belt",
    timestamp: now - 6 * day,
    metadata: { beltRank: "blue" },
  },
  {
    _id: "act-039",
    type: "check-in",
    user: { name: "Grace Rogers", initials: "GR" },
    content: "checked in for Wednesday Intermediate",
    timestamp: now - 1 * week,
  },
  {
    _id: "act-040",
    type: "new-member",
    user: { name: "Andrew Reed", initials: "AR" },
    content: "joined the club",
    timestamp: now - 1 * week,
  },
  {
    _id: "act-041",
    type: "event-signup",
    user: { name: "Chloe Cook", initials: "CC" },
    content: "signed up for Charity Demonstration",
    timestamp: now - 1 * week,
    metadata: { eventName: "Charity Demonstration" },
  },
  {
    _id: "act-042",
    type: "achievement",
    user: { name: "Joshua Morgan", initials: "JM" },
    content: "unlocked 'Competitor' achievement",
    timestamp: now - 1 * week,
    metadata: { achievementName: "Competitor" },
  },
  {
    _id: "act-043",
    type: "check-in",
    user: { name: "Natalie Bell", initials: "NB" },
    content: "checked in for Friday Advanced",
    timestamp: now - 1 * week,
  },
  {
    _id: "act-044",
    type: "belt-promotion",
    user: { name: "Ryan Murphy", initials: "RM" },
    content: "earned their Green Belt",
    timestamp: now - 1 * week,
    metadata: { beltRank: "green" },
  },
  {
    _id: "act-045",
    type: "announcement",
    user: { name: "President Tom", initials: "PT" },
    content: "posted a new announcement about Club Elections",
    timestamp: now - 1 * week,
    metadata: { announcementTitle: "Annual Club Elections" },
  },
  {
    _id: "act-046",
    type: "new-member",
    user: { name: "Hannah Bailey", initials: "HB" },
    content: "joined the club",
    timestamp: now - 1 * week,
  },
  {
    _id: "act-047",
    type: "check-in",
    user: { name: "Nathan Rivera", initials: "NR" },
    content: "checked in for Monday Fundamentals",
    timestamp: now - 1 * week,
  },
  {
    _id: "act-048",
    type: "event-signup",
    user: { name: "Zoe Cooper", initials: "ZC" },
    content: "signed up for Beginners Workshop",
    timestamp: now - 1 * week,
    metadata: { eventName: "Beginners Workshop" },
  },
  {
    _id: "act-049",
    type: "achievement",
    user: { name: "Dylan Richardson", initials: "DR" },
    content: "unlocked 'Technique Master' achievement",
    timestamp: now - 1 * week,
    metadata: { achievementName: "Technique Master" },
  },
  {
    _id: "act-050",
    type: "belt-promotion",
    user: { name: "Lily Cox", initials: "LC" },
    content: "earned their Yellow Belt",
    timestamp: now - 1 * week,
    metadata: { beltRank: "yellow" },
  },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    _id: "ann-001",
    title: "Competition Training Sessions",
    content: "Special competition preparation sessions will run every Saturday morning from 9:00-11:00 starting next week. Open to all belt ranks. Focus on tournament tactics, match psychology, and competitive randori. Sign up at reception!",
    category: "competition",
    priority: "important",
    isPinned: true,
    isRead: false,
    author: { name: "Coach Mike", role: "Head Coach" },
    createdAt: now - 6 * hour,
    updatedAt: now - 6 * hour,
  },
  {
    _id: "ann-002",
    title: "Dojo Closed - Bank Holiday",
    content: "Please note the dojo will be closed on Monday, January 27th for the bank holiday. Normal training resumes on Wednesday, January 29th. Have a great long weekend!",
    category: "admin",
    priority: "urgent",
    isPinned: true,
    isRead: false,
    author: { name: "Club Secretary", role: "Administrator" },
    createdAt: now - 1 * day,
    updatedAt: now - 1 * day,
  },
  {
    _id: "ann-003",
    title: "Spring Social Event - Save the Date",
    content: "Join us for our Spring Social on March 15th at 7:00 PM! Location: The Student Union Bar. Great food, drinks, and a chance to socialize with your fellow judoka. More details coming soon. All members and guests welcome!",
    category: "social",
    priority: "info",
    isPinned: false,
    isRead: true,
    author: { name: "Social Secretary", role: "Committee Member" },
    createdAt: now - 2 * day,
    updatedAt: now - 2 * day,
  },
  {
    _id: "ann-004",
    title: "Belt Grading Applications Open",
    content: "Applications for the March belt grading are now open. If you believe you're ready to test for your next belt, please speak with your coach and submit your application by February 15th. Grading date: March 8th.",
    category: "training",
    priority: "important",
    isPinned: true,
    isRead: false,
    author: { name: "Sensei Yuki", role: "Senior Instructor" },
    createdAt: now - 3 * day,
    updatedAt: now - 3 * day,
  },
  {
    _id: "ann-005",
    title: "New Equipment Available",
    content: "We've received our new shipment of crash mats and throwing dummies! These will be available for use starting this week. Please handle with care and report any damage to the committee.",
    category: "admin",
    priority: "info",
    isPinned: false,
    isRead: true,
    author: { name: "Equipment Officer", role: "Committee Member" },
    createdAt: now - 4 * day,
    updatedAt: now - 4 * day,
  },
  {
    _id: "ann-006",
    title: "London Universities Championship",
    content: "The London Universities Judo Championship is on February 22nd. This is a great opportunity to represent Birkbeck and gain competition experience. All levels welcome. Registration deadline: February 10th. See Coach Mike for details.",
    category: "competition",
    priority: "important",
    isPinned: false,
    isRead: false,
    author: { name: "Competition Secretary", role: "Committee Member" },
    createdAt: now - 5 * day,
    updatedAt: now - 5 * day,
  },
  {
    _id: "ann-007",
    title: "Membership Renewals Due",
    content: "Friendly reminder that semester memberships expire at the end of January. Please renew your membership to continue training. Student: £45, Standard: £65. Renew online or at reception.",
    category: "admin",
    priority: "urgent",
    isPinned: false,
    isRead: true,
    author: { name: "Treasurer", role: "Committee Member" },
    createdAt: now - 6 * day,
    updatedAt: now - 6 * day,
  },
  {
    _id: "ann-008",
    title: "Guest Instructor Workshop",
    content: "We're thrilled to announce that Olympic bronze medalist Ashley McKenzie will be running a special workshop on February 8th! 2-hour session covering advanced throwing techniques and competition strategies. Limited spaces - sign up now!",
    category: "training",
    priority: "important",
    isPinned: true,
    isRead: false,
    author: { name: "Head Coach", role: "Coach" },
    createdAt: now - 1 * week,
    updatedAt: now - 1 * week,
  },
  {
    _id: "ann-009",
    title: "Winter Training Camp Recap",
    content: "Huge thank you to everyone who attended the winter training camp last weekend! We had 35 members participate in an amazing two days of intensive training. Photos will be posted on our social media soon. Can't wait for the next one!",
    category: "social",
    priority: "info",
    isPinned: false,
    isRead: true,
    author: { name: "Social Secretary", role: "Committee Member" },
    createdAt: now - 1 * week,
    updatedAt: now - 1 * week,
  },
  {
    _id: "ann-010",
    title: "Dojo Etiquette Reminder",
    content: "Please remember to bow when entering and leaving the mat, keep your gi clean and in good repair, and arrive on time for classes. Let's maintain the respectful atmosphere that makes our dojo special. Thank you!",
    category: "training",
    priority: "info",
    isPinned: false,
    isRead: true,
    author: { name: "Sensei Yuki", role: "Senior Instructor" },
    createdAt: now - 1 * week,
    updatedAt: now - 1 * week,
  },
  {
    _id: "ann-011",
    title: "Committee Elections Coming Soon",
    content: "Annual club committee elections will be held in March. Positions available: President, Secretary, Treasurer, Social Secretary, Competition Secretary, and Equipment Officer. Nominations open February 1st. Get involved and help shape the club!",
    category: "admin",
    priority: "info",
    isPinned: false,
    isRead: false,
    author: { name: "Current President", role: "President" },
    createdAt: now - 1 * week,
    updatedAt: now - 1 * week,
  },
  {
    _id: "ann-012",
    title: "Beginner Course Starting Soon",
    content: "Our next 6-week beginner course starts February 3rd! Perfect for complete newcomers to judo. Runs Monday & Wednesday 6:00-7:00 PM. Spread the word to friends interested in trying judo. No experience necessary, all equipment provided!",
    category: "training",
    priority: "info",
    isPinned: false,
    isRead: true,
    author: { name: "Beginners Coach", role: "Coach" },
    createdAt: now - 1 * week,
    updatedAt: now - 1 * week,
  },
];

// Mock Upcoming Events
export const mockUpcomingEvents: Event[] = [
  {
    _id: "evt-001",
    title: "London Universities Championship",
    description: "Annual inter-university judo championship. Great opportunity to compete and represent Birkbeck. All weight categories and skill levels. Transportation provided.",
    type: "competition",
    date: now + 4 * week,
    endDate: now + 4 * week + 8 * hour,
    location: "Imperial College Sports Centre",
    capacity: 50,
    attendees: 23,
    rsvpStatus: null,
    thumbnail: "🏆",
    organizer: "London Universities Sport",
    isFeatured: true,
  },
  {
    _id: "evt-002",
    title: "Belt Grading Exam",
    description: "Quarterly belt grading for members ready to test for their next rank. Please ensure you have submitted your application and trained consistently. Good luck to all candidates!",
    type: "grading",
    date: now + 6 * week,
    endDate: now + 6 * week + 4 * hour,
    location: "Main Dojo - Birkbeck",
    capacity: 30,
    attendees: 18,
    rsvpStatus: "going",
    thumbnail: "🥋",
    organizer: "Sensei Yuki",
    isFeatured: true,
  },
  {
    _id: "evt-003",
    title: "Spring Social Evening",
    description: "Join us for food, drinks, and good company! Celebrate the end of term with your fellow club members. Prizes for best stories from the mat. Partners and friends welcome!",
    type: "social",
    date: now + 8 * week,
    endDate: now + 8 * week + 4 * hour,
    location: "Student Union Bar",
    capacity: 80,
    attendees: 45,
    rsvpStatus: "maybe",
    thumbnail: "🎉",
    organizer: "Social Committee",
    isFeatured: false,
  },
  {
    _id: "evt-004",
    title: "Guest Workshop - Ashley McKenzie",
    description: "Olympic bronze medalist Ashley McKenzie shares his expertise! Advanced throwing techniques, competition preparation, and Q&A session. Don't miss this incredible opportunity!",
    type: "training-camp",
    date: now + 2 * week + 3 * day,
    endDate: now + 2 * week + 3 * day + 2 * hour,
    location: "Main Dojo - Birkbeck",
    capacity: 40,
    attendees: 37,
    rsvpStatus: "going",
    thumbnail: "⭐",
    organizer: "Head Coach",
    isFeatured: true,
  },
  {
    _id: "evt-005",
    title: "Inter-University Tournament",
    description: "Friendly team tournament against UCL, King's, and LSE. Great competitive experience in a supportive environment. Team selection based on recent performance and attendance.",
    type: "competition",
    date: now + 5 * week,
    endDate: now + 5 * week + 6 * hour,
    location: "UCL Sports Centre",
    capacity: 20,
    attendees: 16,
    rsvpStatus: null,
    thumbnail: "🥇",
    organizer: "Competition Secretary",
    isFeatured: false,
  },
  {
    _id: "evt-006",
    title: "Summer Training Camp",
    description: "Intensive weekend training camp. Accommodation, meals, and expert coaching included. Perfect for serious students wanting to improve rapidly. Beautiful countryside location.",
    type: "training-camp",
    date: now + 12 * week,
    endDate: now + 12 * week + 2 * day,
    location: "Crystal Palace National Sports Centre",
    capacity: 35,
    attendees: 22,
    rsvpStatus: "going",
    thumbnail: "⛺",
    organizer: "Head Coach",
    isFeatured: true,
  },
  {
    _id: "evt-007",
    title: "Charity Demonstration",
    description: "Judo demonstration at local community centre to raise funds for youth sports programs. Show off your skills and give back to the community. All levels can participate!",
    type: "social",
    date: now + 7 * week,
    endDate: now + 7 * week + 3 * hour,
    location: "Birkbeck Community Centre",
    capacity: 25,
    attendees: 14,
    rsvpStatus: null,
    thumbnail: "❤️",
    organizer: "Community Outreach",
    isFeatured: false,
  },
  {
    _id: "evt-008",
    title: "Beginners Workshop",
    description: "Special workshop for white and yellow belts. Focus on fundamental breakfalls, gripping, and basic throws. Small group sizes for maximum attention. Great opportunity to refine basics!",
    type: "training-camp",
    date: now + 3 * week,
    endDate: now + 3 * week + 2 * hour,
    location: "Main Dojo - Birkbeck",
    capacity: 20,
    attendees: 15,
    rsvpStatus: "maybe",
    thumbnail: "📚",
    organizer: "Beginners Coach",
    isFeatured: false,
  },
  {
    _id: "evt-009",
    title: "National Student Championships",
    description: "The premier student judo competition in the UK. Representing Birkbeck at nationals! Selection process starts next month. This is what we train for!",
    type: "competition",
    date: now + 14 * week,
    endDate: now + 14 * week + 2 * day,
    location: "University of Bath Sports Training Village",
    capacity: 15,
    attendees: 8,
    rsvpStatus: null,
    thumbnail: "🏅",
    organizer: "British Universities Sport",
    isFeatured: true,
  },
  {
    _id: "evt-010",
    title: "Mid-Term Grading",
    description: "Additional grading opportunity for members who have shown excellent progress. Speak to your instructor if you're interested in testing. Limited spaces available.",
    type: "grading",
    date: now + 9 * week,
    endDate: now + 9 * week + 3 * hour,
    location: "Main Dojo - Birkbeck",
    capacity: 15,
    attendees: 9,
    rsvpStatus: null,
    thumbnail: "🎯",
    organizer: "Sensei Yuki",
    isFeatured: false,
  },
];

// Helper function to format time ago
export function getTimeAgo(timestamp: number): string {
  const diff = now - timestamp;

  if (diff < minute) {
    return 'just now';
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins}m ago`;
  } else if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return `${hrs}h ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}d ago`;
  } else {
    const weeks = Math.floor(diff / week);
    return `${weeks}w ago`;
  }
}

// Helper function to get days until event
export function getDaysUntil(timestamp: number): string {
  const diff = timestamp - now;

  if (diff < 0) {
    return 'Past event';
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return hours <= 1 ? 'Today' : `${hours}h away`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} day${days === 1 ? '' : 's'} away`;
  } else {
    const weeks = Math.floor(diff / week);
    return `${weeks} week${weeks === 1 ? '' : 's'} away`;
  }
}

// Helper to get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
