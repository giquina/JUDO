// Mock data for gamification features

export interface LeaderboardEntry {
  id: string;
  name: string;
  value: number;
  avatarUrl?: string;
  beltRank: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedDate?: string;
  category: "streak" | "sessions" | "timing" | "competition" | "social";
}

export interface ProgressStat {
  label: string;
  value: number;
  maxValue?: number;
  icon: string;
  color: string;
}

// Leaderboard Data
export const leaderboardAttendance: LeaderboardEntry[] = [
  { id: "1", name: "Sarah Johnson", value: 16, beltRank: "brown" },
  { id: "2", name: "Alice Chen", value: 14, beltRank: "blue" },
  { id: "3", name: "Mike Rodriguez", value: 13, beltRank: "black" },
  { id: "4", name: "Emma Wilson", value: 12, beltRank: "green" },
  { id: "5", name: "James Smith", value: 11, beltRank: "blue" },
  { id: "6", name: "Lisa Anderson", value: 10, beltRank: "orange" },
  { id: "7", name: "David Park", value: 9, beltRank: "brown" },
  { id: "8", name: "Maria Garcia", value: 8, beltRank: "green" },
  { id: "9", name: "Tom Brown", value: 8, beltRank: "yellow" },
  { id: "10", name: "Sophie Taylor", value: 7, beltRank: "blue" },
];

export const leaderboardStreak: LeaderboardEntry[] = [
  { id: "3", name: "Mike Rodriguez", value: 28, beltRank: "black" },
  { id: "1", name: "Sarah Johnson", value: 21, beltRank: "brown" },
  { id: "2", name: "Alice Chen", value: 14, beltRank: "blue" },
  { id: "4", name: "Emma Wilson", value: 12, beltRank: "green" },
  { id: "7", name: "David Park", value: 10, beltRank: "brown" },
  { id: "5", name: "James Smith", value: 8, beltRank: "blue" },
  { id: "10", name: "Sophie Taylor", value: 7, beltRank: "blue" },
  { id: "6", name: "Lisa Anderson", value: 5, beltRank: "orange" },
  { id: "8", name: "Maria Garcia", value: 4, beltRank: "green" },
  { id: "9", name: "Tom Brown", value: 3, beltRank: "yellow" },
];

export const leaderboardMatTime: LeaderboardEntry[] = [
  { id: "3", name: "Mike Rodriguez", value: 156, beltRank: "black" },
  { id: "1", name: "Sarah Johnson", value: 142, beltRank: "brown" },
  { id: "7", name: "David Park", value: 128, beltRank: "brown" },
  { id: "2", name: "Alice Chen", value: 94, beltRank: "blue" },
  { id: "4", name: "Emma Wilson", value: 87, beltRank: "green" },
  { id: "5", name: "James Smith", value: 76, beltRank: "blue" },
  { id: "10", name: "Sophie Taylor", value: 68, beltRank: "blue" },
  { id: "6", name: "Lisa Anderson", value: 52, beltRank: "orange" },
  { id: "8", name: "Maria Garcia", value: 45, beltRank: "green" },
  { id: "9", name: "Tom Brown", value: 38, beltRank: "yellow" },
];

export const leaderboardAllTime: LeaderboardEntry[] = [
  { id: "3", name: "Mike Rodriguez", value: 487, beltRank: "black" },
  { id: "1", name: "Sarah Johnson", value: 412, beltRank: "brown" },
  { id: "7", name: "David Park", value: 356, beltRank: "brown" },
  { id: "10", name: "Sophie Taylor", value: 298, beltRank: "blue" },
  { id: "5", name: "James Smith", value: 267, beltRank: "blue" },
  { id: "4", name: "Emma Wilson", value: 234, beltRank: "green" },
  { id: "6", name: "Lisa Anderson", value: 198, beltRank: "orange" },
  { id: "8", name: "Maria Garcia", value: 176, beltRank: "green" },
  { id: "9", name: "Tom Brown", value: 145, beltRank: "yellow" },
  { id: "2", name: "Alice Chen", value: 47, beltRank: "blue" },
];

// Achievement Definitions
export const allAchievements: Achievement[] = [
  {
    id: "fire-starter",
    title: "Fire Starter",
    description: "Maintain a 7-day training streak",
    icon: "🔥",
    unlocked: true,
    unlockedDate: "2026-01-14",
    category: "streak",
  },
  {
    id: "committed",
    title: "Committed",
    description: "Maintain a 30-day training streak",
    icon: "🎯",
    unlocked: true,
    unlockedDate: "2026-01-10",
    category: "streak",
  },
  {
    id: "century-club",
    title: "Century Club",
    description: "Complete 100 training sessions",
    icon: "💯",
    unlocked: false,
    progress: 47,
    maxProgress: 100,
    category: "sessions",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Attend 10 morning classes (before 12pm)",
    icon: "🌅",
    unlocked: true,
    unlockedDate: "2025-12-20",
    category: "timing",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Attend 10 evening classes (after 7pm)",
    icon: "🦉",
    unlocked: false,
    progress: 6,
    maxProgress: 10,
    category: "timing",
  },
  {
    id: "champion",
    title: "Champion",
    description: "Win a judo competition",
    icon: "🏆",
    unlocked: false,
    category: "competition",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Help 5 new students with their technique",
    icon: "🤝",
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    category: "social",
  },
  {
    id: "half-century",
    title: "Half Century",
    description: "Complete 50 training sessions",
    icon: "⭐",
    unlocked: false,
    progress: 47,
    maxProgress: 50,
    category: "sessions",
  },
];

// User's current progress stats
export const currentUserStats = {
  currentStreak: 14,
  longestStreak: 21,
  totalSessions: 47,
  totalMatTime: 94, // hours
  nextMilestone: {
    name: "Half Century",
    description: "Complete 50 sessions",
    progress: 47,
    maxProgress: 50,
  },
  rank: {
    attendance: 2,
    streak: 3,
    matTime: 4,
    allTime: 10,
  },
};

// Current user ID for highlighting in leaderboards
export const CURRENT_USER_ID = "2"; // Alice Chen
