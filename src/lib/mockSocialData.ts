// Mock Social Data for JUDO App
import type { BeltRank } from "@/types";

export interface SocialMember {
  _id: string;
  userId: string;
  name: string;
  email: string;
  beltRank: BeltRank;
  avatar?: string;
  bio?: string;
  joinDate: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  favoriteTechniques: string[];
  trainingFocus: ("randori" | "kata" | "competition")[];
  availability: {
    days: string[];
    preferredTime: string;
  };
  publicProfile: boolean;
  stats: {
    thisMonthSessions: number;
    lastMonthSessions: number;
    totalCompetitions: number;
    totalWins: number;
  };
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number;
  category: "attendance" | "competition" | "technique" | "social" | "milestone";
}

export interface TrainingPartner {
  _id: string;
  memberId: string;
  partnerId: string;
  timesTrainedTogether: number;
  lastTrainedTogether: number;
  matchScore: number; // 0-100
  mutualTechniques: string[];
  status: "active" | "pending" | "inactive";
}

export interface LeaderboardEntry {
  memberId: string;
  name: string;
  beltRank: BeltRank;
  avatar?: string;
  score: number;
  previousRank?: number;
  currentRank: number;
}

export interface CommunityPost {
  _id: string;
  authorId: string;
  authorName: string;
  authorBelt: BeltRank;
  authorAvatar?: string;
  type: "achievement" | "photo" | "tip" | "competition" | "welcome" | "announcement";
  content: string;
  imageUrl?: string;
  likes: string[]; // Array of member IDs
  comments: Comment[];
  createdAt: number;
  category?: string;
}

export interface Comment {
  _id: string;
  authorId: string;
  authorName: string;
  authorBelt: BeltRank;
  content: string;
  createdAt: number;
}

export interface SocialNotification {
  _id: string;
  userId: string;
  type: "partner_request" | "position_change" | "achievement" | "event_invite" | "mention" | "new_follower";
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: number;
  relatedUserId?: string;
  relatedUserName?: string;
}

// Mock Members (30+ club members)
export const mockSocialMembers: SocialMember[] = [
  {
    _id: "mem-001",
    userId: "user-001",
    name: "John Smith",
    email: "john.smith@example.com",
    beltRank: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "Passionate judoka focusing on competitive sparring. Always looking for challenging partners!",
    joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
    totalSessions: 156,
    currentStreak: 12,
    longestStreak: 28,
    achievements: [],
    favoriteTechniques: ["Uchi-mata", "Seoi-nage", "Juji-gatame"],
    trainingFocus: ["randori", "competition"],
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 14,
      lastMonthSessions: 12,
      totalCompetitions: 8,
      totalWins: 5,
    },
  },
  {
    _id: "mem-002",
    userId: "user-002",
    name: "Sarah Jones",
    email: "sarah.jones@example.com",
    beltRank: "brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Senior member with a love for kata and teaching. Here to help beginners!",
    joinDate: Date.now() - 730 * 24 * 60 * 60 * 1000,
    totalSessions: 245,
    currentStreak: 8,
    longestStreak: 42,
    achievements: [],
    favoriteTechniques: ["Harai-goshi", "Tai-otoshi", "Sankaku-jime"],
    trainingFocus: ["kata", "randori"],
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 16,
      lastMonthSessions: 18,
      totalCompetitions: 15,
      totalWins: 11,
    },
  },
  {
    _id: "mem-003",
    userId: "user-003",
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    beltRank: "white",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    bio: "New to judo, excited to learn! Looking for patient training partners.",
    joinDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
    totalSessions: 24,
    currentStreak: 3,
    longestStreak: 5,
    achievements: [],
    favoriteTechniques: ["O-goshi", "Basic ukemi"],
    trainingFocus: ["randori"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 8,
      lastMonthSessions: 6,
      totalCompetitions: 0,
      totalWins: 0,
    },
  },
  {
    _id: "mem-004",
    userId: "user-004",
    name: "Emily Brown",
    email: "emily.brown@example.com",
    beltRank: "yellow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    bio: "Training for my first competition. Love the community here!",
    joinDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
    totalSessions: 68,
    currentStreak: 5,
    longestStreak: 14,
    achievements: [],
    favoriteTechniques: ["Ippon-seoi-nage", "Kesa-gatame"],
    trainingFocus: ["randori", "competition"],
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 10,
      lastMonthSessions: 9,
      totalCompetitions: 1,
      totalWins: 0,
    },
  },
  {
    _id: "mem-005",
    userId: "user-005",
    name: "David Taylor",
    email: "david.taylor@example.com",
    beltRank: "black",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    bio: "Head coach and senior instructor. 20+ years of judo experience.",
    joinDate: Date.now() - 1460 * 24 * 60 * 60 * 1000,
    totalSessions: 512,
    currentStreak: 24,
    longestStreak: 89,
    achievements: [],
    favoriteTechniques: ["Morote-seoi-nage", "Uchi-mata", "Osoto-gari"],
    trainingFocus: ["kata", "randori", "competition"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      preferredTime: "all-day",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 22,
      lastMonthSessions: 20,
      totalCompetitions: 45,
      totalWins: 32,
    },
  },
  {
    _id: "mem-006",
    userId: "user-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    beltRank: "green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    bio: "Working on my green belt techniques. Love newaza!",
    joinDate: Date.now() - 240 * 24 * 60 * 60 * 1000,
    totalSessions: 92,
    currentStreak: 7,
    longestStreak: 18,
    achievements: [],
    favoriteTechniques: ["Tomoe-nage", "Yoko-shiho-gatame"],
    trainingFocus: ["randori"],
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 11,
      lastMonthSessions: 10,
      totalCompetitions: 3,
      totalWins: 1,
    },
  },
  {
    _id: "mem-007",
    userId: "user-007",
    name: "James Chen",
    email: "james.chen@example.com",
    beltRank: "orange",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    bio: "Competitive mindset, always pushing to improve!",
    joinDate: Date.now() - 200 * 24 * 60 * 60 * 1000,
    totalSessions: 78,
    currentStreak: 6,
    longestStreak: 15,
    achievements: [],
    favoriteTechniques: ["Kouchi-gari", "Tani-otoshi"],
    trainingFocus: ["randori", "competition"],
    availability: {
      days: ["Monday", "Wednesday", "Friday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 13,
      lastMonthSessions: 11,
      totalCompetitions: 4,
      totalWins: 2,
    },
  },
  {
    _id: "mem-008",
    userId: "user-008",
    name: "Rachel Green",
    email: "rachel.green@example.com",
    beltRank: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    bio: "Balancing work and training. Love the mental discipline of judo.",
    joinDate: Date.now() - 400 * 24 * 60 * 60 * 1000,
    totalSessions: 134,
    currentStreak: 9,
    longestStreak: 22,
    achievements: [],
    favoriteTechniques: ["Osoto-gari", "Koshi-guruma"],
    trainingFocus: ["kata", "randori"],
    availability: {
      days: ["Tuesday", "Thursday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 8,
      lastMonthSessions: 7,
      totalCompetitions: 5,
      totalWins: 3,
    },
  },
  {
    _id: "mem-009",
    userId: "user-009",
    name: "Tom Harris",
    email: "tom.harris@example.com",
    beltRank: "white",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    bio: "Just started my judo journey. Loving every minute!",
    joinDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
    totalSessions: 18,
    currentStreak: 4,
    longestStreak: 4,
    achievements: [],
    favoriteTechniques: ["De-ashi-barai", "Basic breakfalls"],
    trainingFocus: ["randori"],
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 7,
      lastMonthSessions: 5,
      totalCompetitions: 0,
      totalWins: 0,
    },
  },
  {
    _id: "mem-010",
    userId: "user-010",
    name: "Nina Patel",
    email: "nina.patel@example.com",
    beltRank: "brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina",
    bio: "Assistant coach focusing on women's judo development.",
    joinDate: Date.now() - 900 * 24 * 60 * 60 * 1000,
    totalSessions: 298,
    currentStreak: 15,
    longestStreak: 52,
    achievements: [],
    favoriteTechniques: ["Ouchi-gari", "Ude-garami", "Kata-guruma"],
    trainingFocus: ["kata", "randori", "competition"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 18,
      lastMonthSessions: 17,
      totalCompetitions: 22,
      totalWins: 16,
    },
  },
  // Additional members 11-30 with varying belts and profiles
  {
    _id: "mem-011",
    userId: "user-011",
    name: "Alex Martinez",
    email: "alex.martinez@example.com",
    beltRank: "yellow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "University student, training when I can!",
    joinDate: Date.now() - 150 * 24 * 60 * 60 * 1000,
    totalSessions: 56,
    currentStreak: 2,
    longestStreak: 11,
    achievements: [],
    favoriteTechniques: ["Uki-goshi", "Yoko-tomoe-nage"],
    trainingFocus: ["randori"],
    availability: {
      days: ["Saturday", "Sunday"],
      preferredTime: "morning",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 6,
      lastMonthSessions: 5,
      totalCompetitions: 1,
      totalWins: 0,
    },
  },
  {
    _id: "mem-012",
    userId: "user-012",
    name: "Sophie Turner",
    email: "sophie.turner@example.com",
    beltRank: "green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    bio: "Former gymnast, loving the transition to judo!",
    joinDate: Date.now() - 280 * 24 * 60 * 60 * 1000,
    totalSessions: 102,
    currentStreak: 11,
    longestStreak: 19,
    achievements: [],
    favoriteTechniques: ["Sumi-gaeshi", "Yoko-guruma"],
    trainingFocus: ["randori", "kata"],
    availability: {
      days: ["Monday", "Wednesday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 12,
      lastMonthSessions: 10,
      totalCompetitions: 4,
      totalWins: 2,
    },
  },
  {
    _id: "mem-013",
    userId: "user-013",
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    beltRank: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    bio: "Strength and conditioning coach by day, judoka by night!",
    joinDate: Date.now() - 500 * 24 * 60 * 60 * 1000,
    totalSessions: 162,
    currentStreak: 13,
    longestStreak: 26,
    achievements: [],
    favoriteTechniques: ["Harai-makikomi", "Kami-shiho-gatame"],
    trainingFocus: ["randori", "competition"],
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 14,
      lastMonthSessions: 13,
      totalCompetitions: 9,
      totalWins: 6,
    },
  },
  {
    _id: "mem-014",
    userId: "user-014",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    beltRank: "orange",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    bio: "Medical student finding balance through judo.",
    joinDate: Date.now() - 220 * 24 * 60 * 60 * 1000,
    totalSessions: 84,
    currentStreak: 4,
    longestStreak: 12,
    achievements: [],
    favoriteTechniques: ["Sasae-tsurikomi-ashi", "Hon-kesa-gatame"],
    trainingFocus: ["randori"],
    availability: {
      days: ["Wednesday", "Saturday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 7,
      lastMonthSessions: 8,
      totalCompetitions: 2,
      totalWins: 1,
    },
  },
  {
    _id: "mem-015",
    userId: "user-015",
    name: "Ryan Cooper",
    email: "ryan.cooper@example.com",
    beltRank: "white",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
    bio: "Excited beginner, ready to learn from everyone!",
    joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    totalSessions: 12,
    currentStreak: 3,
    longestStreak: 3,
    achievements: [],
    favoriteTechniques: ["Basic grips", "Forward rolls"],
    trainingFocus: ["randori"],
    availability: {
      days: ["Monday", "Thursday"],
      preferredTime: "evening",
    },
    publicProfile: true,
    stats: {
      thisMonthSessions: 5,
      lastMonthSessions: 3,
      totalCompetitions: 0,
      totalWins: 0,
    },
  },
  // Continue with more members...
  {
    _id: "mem-016",
    userId: "user-016",
    name: "Hannah Lee",
    email: "hannah.lee@example.com",
    beltRank: "green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah",
    totalSessions: 95,
    currentStreak: 8,
    longestStreak: 17,
    joinDate: Date.now() - 260 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Tsurikomi-goshi", "Okuri-eri-jime"],
    trainingFocus: ["randori", "kata"],
    availability: { days: ["Tuesday", "Friday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 10, lastMonthSessions: 9, totalCompetitions: 3, totalWins: 2 },
  },
  {
    _id: "mem-017",
    userId: "user-017",
    name: "Daniel Kim",
    email: "daniel.kim@example.com",
    beltRank: "brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
    totalSessions: 276,
    currentStreak: 17,
    longestStreak: 48,
    joinDate: Date.now() - 850 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Sode-tsurikomi-goshi", "Juji-gatame", "Uchi-mata-sukashi"],
    trainingFocus: ["kata", "randori", "competition"],
    availability: { days: ["Monday", "Wednesday", "Friday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 17, lastMonthSessions: 16, totalCompetitions: 18, totalWins: 13 },
  },
  {
    _id: "mem-018",
    userId: "user-018",
    name: "Grace Wilson",
    email: "grace.wilson@example.com",
    beltRank: "yellow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
    totalSessions: 48,
    currentStreak: 5,
    longestStreak: 9,
    joinDate: Date.now() - 140 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["O-goshi", "Kuzure-kesa-gatame"],
    trainingFocus: ["randori"],
    availability: { days: ["Monday", "Wednesday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 8, lastMonthSessions: 6, totalCompetitions: 0, totalWins: 0 },
  },
  {
    _id: "mem-019",
    userId: "user-019",
    name: "Ethan Moore",
    email: "ethan.moore@example.com",
    beltRank: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
    totalSessions: 142,
    currentStreak: 10,
    longestStreak: 21,
    joinDate: Date.now() - 380 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Ashi-guruma", "Kata-ha-jime"],
    trainingFocus: ["randori", "competition"],
    availability: { days: ["Tuesday", "Thursday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 12, lastMonthSessions: 11, totalCompetitions: 6, totalWins: 4 },
  },
  {
    _id: "mem-020",
    userId: "user-020",
    name: "Isabella Garcia",
    email: "isabella.garcia@example.com",
    beltRank: "orange",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    totalSessions: 72,
    currentStreak: 6,
    longestStreak: 13,
    joinDate: Date.now() - 190 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Harai-goshi", "Mune-gatame"],
    trainingFocus: ["randori", "kata"],
    availability: { days: ["Monday", "Friday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 9, lastMonthSessions: 8, totalCompetitions: 2, totalWins: 1 },
  },
  // Members 21-30
  {
    _id: "mem-021",
    userId: "user-021",
    name: "Liam Brown",
    email: "liam.brown@example.com",
    beltRank: "green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    totalSessions: 108,
    currentStreak: 9,
    longestStreak: 20,
    joinDate: Date.now() - 300 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Kouchi-gari", "Tate-shiho-gatame"],
    trainingFocus: ["randori", "competition"],
    availability: { days: ["Wednesday", "Friday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 11, lastMonthSessions: 10, totalCompetitions: 5, totalWins: 3 },
  },
  {
    _id: "mem-022",
    userId: "user-022",
    name: "Ava Thompson",
    email: "ava.thompson@example.com",
    beltRank: "white",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    totalSessions: 16,
    currentStreak: 4,
    longestStreak: 4,
    joinDate: Date.now() - 40 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Basic ukemi", "Osoto-otoshi"],
    trainingFocus: ["randori"],
    availability: { days: ["Tuesday", "Thursday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 6, lastMonthSessions: 4, totalCompetitions: 0, totalWins: 0 },
  },
  {
    _id: "mem-023",
    userId: "user-023",
    name: "Noah White",
    email: "noah.white@example.com",
    beltRank: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    totalSessions: 148,
    currentStreak: 11,
    longestStreak: 23,
    joinDate: Date.now() - 420 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Sumi-otoshi", "Hadaka-jime"],
    trainingFocus: ["randori", "competition"],
    availability: { days: ["Monday", "Wednesday", "Friday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 13, lastMonthSessions: 12, totalCompetitions: 7, totalWins: 5 },
  },
  {
    _id: "mem-024",
    userId: "user-024",
    name: "Mia Robinson",
    email: "mia.robinson@example.com",
    beltRank: "yellow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    totalSessions: 52,
    currentStreak: 4,
    longestStreak: 10,
    joinDate: Date.now() - 160 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Ippon-seoi-nage", "Ushiro-kesa-gatame"],
    trainingFocus: ["randori"],
    availability: { days: ["Monday", "Thursday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 7, lastMonthSessions: 6, totalCompetitions: 1, totalWins: 0 },
  },
  {
    _id: "mem-025",
    userId: "user-025",
    name: "Lucas Clark",
    email: "lucas.clark@example.com",
    beltRank: "brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    totalSessions: 268,
    currentStreak: 16,
    longestStreak: 45,
    joinDate: Date.now() - 820 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Uchi-mata", "Obi-otoshi", "Sankaku-jime"],
    trainingFocus: ["kata", "randori", "competition"],
    availability: { days: ["Tuesday", "Thursday", "Friday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 16, lastMonthSessions: 15, totalCompetitions: 16, totalWins: 12 },
  },
  {
    _id: "mem-026",
    userId: "user-026",
    name: "Charlotte Lewis",
    email: "charlotte.lewis@example.com",
    beltRank: "orange",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte",
    totalSessions: 76,
    currentStreak: 5,
    longestStreak: 12,
    joinDate: Date.now() - 210 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Tai-otoshi", "Kata-gatame"],
    trainingFocus: ["randori", "kata"],
    availability: { days: ["Wednesday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 8, lastMonthSessions: 7, totalCompetitions: 2, totalWins: 1 },
  },
  {
    _id: "mem-027",
    userId: "user-027",
    name: "Mason Walker",
    email: "mason.walker@example.com",
    beltRank: "green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mason",
    totalSessions: 98,
    currentStreak: 7,
    longestStreak: 16,
    joinDate: Date.now() - 270 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Hiza-guruma", "Ude-hishigi-juji-gatame"],
    trainingFocus: ["randori", "competition"],
    availability: { days: ["Monday", "Wednesday", "Friday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 10, lastMonthSessions: 9, totalCompetitions: 4, totalWins: 2 },
  },
  {
    _id: "mem-028",
    userId: "user-028",
    name: "Amelia Hall",
    email: "amelia.hall@example.com",
    beltRank: "blue",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia",
    totalSessions: 138,
    currentStreak: 10,
    longestStreak: 20,
    joinDate: Date.now() - 360 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Morote-gari", "Ude-garami"],
    trainingFocus: ["randori", "competition"],
    availability: { days: ["Tuesday", "Thursday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 11, lastMonthSessions: 10, totalCompetitions: 6, totalWins: 4 },
  },
  {
    _id: "mem-029",
    userId: "user-029",
    name: "Logan Allen",
    email: "logan.allen@example.com",
    beltRank: "yellow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Logan",
    totalSessions: 44,
    currentStreak: 3,
    longestStreak: 8,
    joinDate: Date.now() - 130 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["De-ashi-barai", "Yoko-shiho-gatame"],
    trainingFocus: ["randori"],
    availability: { days: ["Monday", "Friday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 6, lastMonthSessions: 5, totalCompetitions: 0, totalWins: 0 },
  },
  {
    _id: "mem-030",
    userId: "user-030",
    name: "Ella Young",
    email: "ella.young@example.com",
    beltRank: "white",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ella",
    totalSessions: 14,
    currentStreak: 3,
    longestStreak: 3,
    joinDate: Date.now() - 35 * 24 * 60 * 60 * 1000,
    achievements: [],
    favoriteTechniques: ["Basic grips", "Breakfalls"],
    trainingFocus: ["randori"],
    availability: { days: ["Wednesday", "Saturday"], preferredTime: "evening" },
    publicProfile: true,
    stats: { thisMonthSessions: 5, lastMonthSessions: 3, totalCompetitions: 0, totalWins: 0 },
  },
];

// Training Partner Relationships
export const mockTrainingPartners: TrainingPartner[] = [
  {
    _id: "tp-001",
    memberId: "mem-001",
    partnerId: "mem-002",
    timesTrainedTogether: 42,
    lastTrainedTogether: Date.now() - 2 * 24 * 60 * 60 * 1000,
    matchScore: 85,
    mutualTechniques: ["Uchi-mata", "Harai-goshi"],
    status: "active",
  },
  {
    _id: "tp-002",
    memberId: "mem-001",
    partnerId: "mem-013",
    timesTrainedTogether: 38,
    lastTrainedTogether: Date.now() - 3 * 24 * 60 * 60 * 1000,
    matchScore: 82,
    mutualTechniques: ["Seoi-nage", "Juji-gatame"],
    status: "active",
  },
  {
    _id: "tp-003",
    memberId: "mem-001",
    partnerId: "mem-008",
    timesTrainedTogether: 35,
    lastTrainedTogether: Date.now() - 5 * 24 * 60 * 60 * 1000,
    matchScore: 78,
    mutualTechniques: ["Osoto-gari"],
    status: "active",
  },
  {
    _id: "tp-004",
    memberId: "mem-001",
    partnerId: "mem-019",
    timesTrainedTogether: 28,
    lastTrainedTogether: Date.now() - 7 * 24 * 60 * 60 * 1000,
    matchScore: 75,
    mutualTechniques: ["Uchi-mata"],
    status: "active",
  },
  {
    _id: "tp-005",
    memberId: "mem-001",
    partnerId: "mem-023",
    timesTrainedTogether: 24,
    lastTrainedTogether: Date.now() - 10 * 24 * 60 * 60 * 1000,
    matchScore: 72,
    mutualTechniques: ["Juji-gatame"],
    status: "active",
  },
];

// Community Posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    _id: "post-001",
    authorId: "mem-005",
    authorName: "David Taylor",
    authorBelt: "black",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    type: "announcement",
    content: "Reminder: Next Saturday's competition prep class will focus on grip fighting strategies. All levels welcome!",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    likes: ["mem-001", "mem-002", "mem-008", "mem-013", "mem-019"],
    comments: [
      {
        _id: "comment-001",
        authorId: "mem-001",
        authorName: "John Smith",
        authorBelt: "blue",
        content: "Looking forward to this!",
        createdAt: Date.now() - 60 * 60 * 1000,
      },
    ],
    category: "training",
  },
  {
    _id: "post-002",
    authorId: "mem-007",
    authorName: "James Chen",
    authorBelt: "orange",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    type: "competition",
    content: "Just won silver at the London Regional Tournament! Thanks to everyone who helped me prepare. Special shoutout to Sarah for the coaching!",
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    likes: ["mem-001", "mem-002", "mem-003", "mem-004", "mem-005", "mem-006", "mem-008", "mem-010"],
    comments: [
      {
        _id: "comment-002",
        authorId: "mem-002",
        authorName: "Sarah Jones",
        authorBelt: "brown",
        content: "So proud of you James! That final match was incredible!",
        createdAt: Date.now() - 5 * 60 * 60 * 1000,
      },
      {
        _id: "comment-003",
        authorId: "mem-005",
        authorName: "David Taylor",
        authorBelt: "black",
        content: "Excellent performance! Keep up the great work!",
        createdAt: Date.now() - 4 * 60 * 60 * 1000,
      },
    ],
    category: "achievement",
  },
  {
    _id: "post-003",
    authorId: "mem-015",
    authorName: "Ryan Cooper",
    authorBelt: "white",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
    type: "welcome",
    content: "Hi everyone! Just joined the club last week. Everyone has been so welcoming. Can't wait to learn from you all!",
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    likes: ["mem-001", "mem-002", "mem-003", "mem-005", "mem-009"],
    comments: [
      {
        _id: "comment-004",
        authorId: "mem-003",
        authorName: "Mike Wilson",
        authorBelt: "white",
        content: "Welcome Ryan! I'm pretty new too. Let's train together!",
        createdAt: Date.now() - 11 * 60 * 60 * 1000,
      },
    ],
    category: "social",
  },
  {
    _id: "post-004",
    authorId: "mem-010",
    authorName: "Nina Patel",
    authorBelt: "brown",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina",
    type: "tip",
    content: "Training tip: When practicing your breakfalls, focus on slapping the mat with your whole arm, not just your hand. This distributes the impact and prevents injury. Start slow and build up speed!",
    createdAt: Date.now() - 18 * 60 * 60 * 1000,
    likes: ["mem-003", "mem-009", "mem-015", "mem-022", "mem-030"],
    comments: [],
    category: "technique",
  },
  {
    _id: "post-005",
    authorId: "mem-002",
    authorName: "Sarah Jones",
    authorBelt: "brown",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    type: "achievement",
    content: "Hit 250 total sessions today! Judo has been such an incredible journey. Grateful for this amazing community!",
    imageUrl: "https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=800",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    likes: ["mem-001", "mem-004", "mem-005", "mem-006", "mem-007", "mem-008", "mem-010", "mem-013"],
    comments: [
      {
        _id: "comment-005",
        authorId: "mem-005",
        authorName: "David Taylor",
        authorBelt: "black",
        content: "Incredible milestone Sarah! Your dedication is inspiring!",
        createdAt: Date.now() - 23 * 60 * 60 * 1000,
      },
    ],
    category: "milestone",
  },
  {
    _id: "post-006",
    authorId: "mem-001",
    authorName: "John Smith",
    authorBelt: "blue",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    type: "photo",
    content: "Great randori session tonight! The energy was amazing!",
    imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
    createdAt: Date.now() - 36 * 60 * 60 * 1000,
    likes: ["mem-002", "mem-008", "mem-013", "mem-019"],
    comments: [],
    category: "training",
  },
];

// Leaderboard Data
export const generateLeaderboard = (
  type: "sessions" | "streak" | "improved" | "competitions"
): LeaderboardEntry[] => {
  const members = [...mockSocialMembers];

  let sorted: LeaderboardEntry[];

  switch (type) {
    case "sessions":
      sorted = members
        .sort((a, b) => b.stats.thisMonthSessions - a.stats.thisMonthSessions)
        .map((m, i) => ({
          memberId: m._id,
          name: m.name,
          beltRank: m.beltRank,
          avatar: m.avatar,
          score: m.stats.thisMonthSessions,
          currentRank: i + 1,
          previousRank: i + Math.floor(Math.random() * 3) - 1, // Random previous rank for demo
        }));
      break;

    case "streak":
      sorted = members
        .sort((a, b) => b.currentStreak - a.currentStreak)
        .map((m, i) => ({
          memberId: m._id,
          name: m.name,
          beltRank: m.beltRank,
          avatar: m.avatar,
          score: m.currentStreak,
          currentRank: i + 1,
          previousRank: i + Math.floor(Math.random() * 3) - 1,
        }));
      break;

    case "improved":
      sorted = members
        .map(m => ({
          ...m,
          improvement: m.stats.thisMonthSessions - m.stats.lastMonthSessions,
        }))
        .sort((a, b) => b.improvement - a.improvement)
        .map((m, i) => ({
          memberId: m._id,
          name: m.name,
          beltRank: m.beltRank,
          avatar: m.avatar,
          score: m.improvement,
          currentRank: i + 1,
          previousRank: i + Math.floor(Math.random() * 5) - 2,
        }));
      break;

    case "competitions":
      sorted = members
        .sort((a, b) => b.stats.totalWins - a.stats.totalWins)
        .filter(m => m.stats.totalCompetitions > 0)
        .map((m, i) => ({
          memberId: m._id,
          name: m.name,
          beltRank: m.beltRank,
          avatar: m.avatar,
          score: m.stats.totalWins,
          currentRank: i + 1,
          previousRank: i + Math.floor(Math.random() * 3) - 1,
        }));
      break;
  }

  return sorted.slice(0, 10);
};

// Social Notifications
export const mockSocialNotifications: SocialNotification[] = [
  {
    _id: "notif-001",
    userId: "mem-001",
    type: "partner_request",
    title: "New Training Partner Request",
    message: "Tom Harris wants to be your training partner",
    actionUrl: "/social/partners",
    read: false,
    createdAt: Date.now() - 30 * 60 * 1000,
    relatedUserId: "mem-009",
    relatedUserName: "Tom Harris",
  },
  {
    _id: "notif-002",
    userId: "mem-001",
    type: "position_change",
    title: "Leaderboard Update",
    message: "You moved up to #3 in Monthly Sessions!",
    actionUrl: "/social/leaderboard",
    read: false,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    _id: "notif-003",
    userId: "mem-001",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "Rachel Green earned '10 Day Streak' achievement",
    actionUrl: "/social/community",
    read: true,
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    relatedUserId: "mem-008",
    relatedUserName: "Rachel Green",
  },
  {
    _id: "notif-004",
    userId: "mem-001",
    type: "mention",
    title: "Mentioned in Post",
    message: "James Chen mentioned you in a competition result post",
    actionUrl: "/social/community",
    read: true,
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    relatedUserId: "mem-007",
    relatedUserName: "James Chen",
  },
];

// Helper to get member by ID
export const getMemberById = (id: string): SocialMember | undefined => {
  return mockSocialMembers.find(m => m._id === id);
};

// Helper to get training partners for a member
export const getTrainingPartnersForMember = (memberId: string): (TrainingPartner & { partner: SocialMember })[] => {
  return mockTrainingPartners
    .filter(tp => tp.memberId === memberId)
    .map(tp => ({
      ...tp,
      partner: getMemberById(tp.partnerId)!,
    }))
    .filter(tp => tp.partner);
};
