export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'attendance' | 'streaks' | 'social' | 'competition' | 'milestones' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  requirement: number;
  points: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isNew?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'attendance' | 'belt' | 'technique' | 'competition' | 'streak';
  targetValue: number;
  currentValue: number;
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface StreakDay {
  date: Date;
  attended: boolean;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master' | 'Grand Master';
  streakFreezeAvailable: boolean;
  lastStreakFreezeUsed?: Date;
  totalPoints: number;
}

// Achievement definitions
export const achievements: Achievement[] = [
  // Attendance achievements
  {
    id: 'attend_10',
    name: 'Getting Started',
    description: 'Attend 10 training sessions',
    category: 'attendance',
    rarity: 'common',
    icon: '🥋',
    requirement: 10,
    points: 50,
  },
  {
    id: 'attend_25',
    name: 'Dedicated Student',
    description: 'Attend 25 training sessions',
    category: 'attendance',
    rarity: 'common',
    icon: '🎯',
    requirement: 25,
    points: 100,
  },
  {
    id: 'attend_50',
    name: 'Training Warrior',
    description: 'Attend 50 training sessions',
    category: 'attendance',
    rarity: 'rare',
    icon: '💪',
    requirement: 50,
    points: 200,
  },
  {
    id: 'attend_100',
    name: 'Century Club',
    description: 'Attend 100 training sessions',
    category: 'attendance',
    rarity: 'epic',
    icon: '💯',
    requirement: 100,
    points: 500,
  },
  {
    id: 'attend_250',
    name: 'Judo Master',
    description: 'Attend 250 training sessions',
    category: 'attendance',
    rarity: 'legendary',
    icon: '👑',
    requirement: 250,
    points: 1000,
  },

  // Streak achievements
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day training streak',
    category: 'streaks',
    rarity: 'common',
    icon: '🔥',
    requirement: 7,
    points: 75,
  },
  {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day training streak',
    category: 'streaks',
    rarity: 'rare',
    icon: '⚡',
    requirement: 14,
    points: 150,
  },
  {
    id: 'streak_30',
    name: 'Monthly Marathon',
    description: 'Maintain a 30-day training streak',
    category: 'streaks',
    rarity: 'epic',
    icon: '🌟',
    requirement: 30,
    points: 300,
  },
  {
    id: 'streak_60',
    name: 'Unstoppable Force',
    description: 'Maintain a 60-day training streak',
    category: 'streaks',
    rarity: 'legendary',
    icon: '💫',
    requirement: 60,
    points: 750,
  },
  {
    id: 'streak_100',
    name: 'Eternal Flame',
    description: 'Maintain a 100-day training streak',
    category: 'streaks',
    rarity: 'legendary',
    icon: '🏆',
    requirement: 100,
    points: 1500,
  },

  // Social achievements
  {
    id: 'refer_3',
    name: 'Friend Bringer',
    description: 'Refer 3 new members',
    category: 'social',
    rarity: 'common',
    icon: '👥',
    requirement: 3,
    points: 100,
  },
  {
    id: 'refer_5',
    name: 'Ambassador',
    description: 'Refer 5 new members',
    category: 'social',
    rarity: 'rare',
    icon: '🤝',
    requirement: 5,
    points: 200,
  },
  {
    id: 'refer_10',
    name: 'Recruitment Legend',
    description: 'Refer 10 new members',
    category: 'social',
    rarity: 'epic',
    icon: '🌐',
    requirement: 10,
    points: 400,
  },
  {
    id: 'help_beginners',
    name: 'Sensei Helper',
    description: 'Help train 5 beginners',
    category: 'social',
    rarity: 'rare',
    icon: '🙏',
    requirement: 5,
    points: 150,
  },

  // Competition achievements
  {
    id: 'first_competition',
    name: 'First Step',
    description: 'Enter your first competition',
    category: 'competition',
    rarity: 'common',
    icon: '🎪',
    requirement: 1,
    points: 100,
  },
  {
    id: 'bronze_medal',
    name: 'Bronze Warrior',
    description: 'Win a bronze medal',
    category: 'competition',
    rarity: 'rare',
    icon: '🥉',
    requirement: 1,
    points: 200,
  },
  {
    id: 'silver_medal',
    name: 'Silver Champion',
    description: 'Win a silver medal',
    category: 'competition',
    rarity: 'epic',
    icon: '🥈',
    requirement: 1,
    points: 350,
  },
  {
    id: 'gold_medal',
    name: 'Gold Legend',
    description: 'Win a gold medal',
    category: 'competition',
    rarity: 'legendary',
    icon: '🥇',
    requirement: 1,
    points: 500,
  },
  {
    id: 'tournament_5',
    name: 'Tournament Regular',
    description: 'Compete in 5 tournaments',
    category: 'competition',
    rarity: 'rare',
    icon: '🏅',
    requirement: 5,
    points: 250,
  },

  // Milestone achievements
  {
    id: 'member_6months',
    name: 'Half Year Hero',
    description: 'Member for 6 months',
    category: 'milestones',
    rarity: 'common',
    icon: '📅',
    requirement: 1,
    points: 100,
  },
  {
    id: 'member_1year',
    name: 'One Year Strong',
    description: 'Member for 1 year',
    category: 'milestones',
    rarity: 'rare',
    icon: '🎂',
    requirement: 1,
    points: 300,
  },
  {
    id: 'member_2years',
    name: 'Two Year Titan',
    description: 'Member for 2 years',
    category: 'milestones',
    rarity: 'epic',
    icon: '🎊',
    requirement: 1,
    points: 600,
  },
  {
    id: 'member_5years',
    name: 'Five Year Legend',
    description: 'Member for 5 years',
    category: 'milestones',
    rarity: 'legendary',
    icon: '💎',
    requirement: 1,
    points: 1500,
  },
  {
    id: 'yellow_belt',
    name: 'Yellow Belt Achievement',
    description: 'Achieve yellow belt rank',
    category: 'milestones',
    rarity: 'common',
    icon: '🟡',
    requirement: 1,
    points: 150,
  },
  {
    id: 'green_belt',
    name: 'Green Belt Achievement',
    description: 'Achieve green belt rank',
    category: 'milestones',
    rarity: 'rare',
    icon: '🟢',
    requirement: 1,
    points: 250,
  },
  {
    id: 'blue_belt',
    name: 'Blue Belt Achievement',
    description: 'Achieve blue belt rank',
    category: 'milestones',
    rarity: 'epic',
    icon: '🔵',
    requirement: 1,
    points: 400,
  },
  {
    id: 'brown_belt',
    name: 'Brown Belt Achievement',
    description: 'Achieve brown belt rank',
    category: 'milestones',
    rarity: 'epic',
    icon: '🟤',
    requirement: 1,
    points: 600,
  },
  {
    id: 'black_belt',
    name: 'Black Belt Master',
    description: 'Achieve black belt rank',
    category: 'milestones',
    rarity: 'legendary',
    icon: '⚫',
    requirement: 1,
    points: 1000,
  },

  // Special achievements
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Attend every session in a month',
    category: 'special',
    rarity: 'epic',
    icon: '✨',
    requirement: 1,
    points: 400,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Check in first 10 times',
    category: 'special',
    rarity: 'rare',
    icon: '🐦',
    requirement: 10,
    points: 150,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Attend 20 evening sessions',
    category: 'special',
    rarity: 'rare',
    icon: '🦉',
    requirement: 20,
    points: 150,
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Attend 25 weekend sessions',
    category: 'special',
    rarity: 'rare',
    icon: '🌅',
    requirement: 25,
    points: 200,
  },
];

// Mock user achievements (what the user has unlocked)
export const userAchievements: UserAchievement[] = [
  {
    achievementId: 'attend_10',
    unlockedAt: new Date('2025-12-15'),
    progress: 10,
  },
  {
    achievementId: 'attend_25',
    unlockedAt: new Date('2026-01-05'),
    progress: 25,
  },
  {
    achievementId: 'streak_7',
    unlockedAt: new Date('2025-12-20'),
    progress: 7,
  },
  {
    achievementId: 'member_6months',
    unlockedAt: new Date('2026-01-01'),
    progress: 1,
  },
  {
    achievementId: 'first_competition',
    unlockedAt: new Date('2025-12-28'),
    progress: 1,
  },
  {
    achievementId: 'yellow_belt',
    unlockedAt: new Date('2026-01-10'),
    progress: 1,
    isNew: true,
  },
  {
    achievementId: 'refer_3',
    unlockedAt: new Date('2026-01-15'),
    progress: 3,
  },
];

// Mock user goals
export const userGoals: Goal[] = [
  {
    id: 'goal_1',
    title: 'Attend 15 classes this month',
    description: 'Keep up the momentum and attend 15 classes before the end of January',
    type: 'attendance',
    targetValue: 15,
    currentValue: 8,
    deadline: new Date('2026-01-31'),
    completed: false,
  },
  {
    id: 'goal_2',
    title: 'Achieve Green Belt',
    description: 'Master the required techniques and pass the grading exam',
    type: 'belt',
    targetValue: 1,
    currentValue: 0,
    deadline: new Date('2026-03-30'),
    completed: false,
  },
  {
    id: 'goal_3',
    title: 'Master Osoto Gari',
    description: 'Practice and perfect the major outer reaping throw',
    type: 'technique',
    targetValue: 1,
    currentValue: 0,
    completed: false,
  },
  {
    id: 'goal_4',
    title: 'Maintain 14-day streak',
    description: 'Train consistently for two weeks straight',
    type: 'streak',
    targetValue: 14,
    currentValue: 5,
    deadline: new Date('2026-02-05'),
    completed: false,
  },
  {
    id: 'goal_5',
    title: 'Completed: Winter Tournament',
    description: 'Participated in the university winter tournament',
    type: 'competition',
    targetValue: 1,
    currentValue: 1,
    completed: true,
    completedAt: new Date('2025-12-28'),
  },
];

// Generate streak history for last 30 days
export const generateStreakHistory = (): StreakDay[] => {
  const history: StreakDay[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Mock pattern: attended most days, with some gaps
    let attended = true;

    // Skip some weekends and random days
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      attended = Math.random() > 0.6; // 40% chance on weekends
    } else {
      attended = Math.random() > 0.2; // 80% chance on weekdays
    }

    // Last 5 days have perfect attendance
    if (i < 5) {
      attended = true;
    }

    history.push({
      date,
      attended,
    });
  }

  return history;
};

// Mock user stats
export const userStats: UserStats = {
  currentStreak: 5,
  longestStreak: 12,
  totalSessions: 32,
  level: 8,
  xp: 2850,
  xpToNextLevel: 3200,
  rank: 'Intermediate',
  streakFreezeAvailable: true,
  totalPoints: 1750,
};

// Helper function to get achievement by id
export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find((a) => a.id === id);
};

// Helper function to check if achievement is unlocked
export const isAchievementUnlocked = (achievementId: string): boolean => {
  return userAchievements.some((ua) => ua.achievementId === achievementId);
};

// Helper function to get next achievement in category
export const getNextAchievementInCategory = (category: AchievementCategory): Achievement | undefined => {
  const categoryAchievements = achievements
    .filter((a) => a.category === category)
    .sort((a, b) => a.requirement - b.requirement);

  return categoryAchievements.find((a) => !isAchievementUnlocked(a.id));
};

// Helper function to calculate progress to next level
export const calculateProgress = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

// Rarity colors for UI
export const rarityColors: Record<AchievementRarity, { bg: string; text: string; border: string }> = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
  },
  rare: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-600',
  },
  epic: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-600',
  },
  legendary: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-600',
  },
};

// Category display names
export const categoryNames: Record<AchievementCategory, string> = {
  attendance: 'Attendance',
  streaks: 'Streaks',
  social: 'Social',
  competition: 'Competition',
  milestones: 'Milestones',
  special: 'Special',
};

// Suggested goals based on user level
export const suggestedGoals = [
  {
    title: 'Attend 20 classes this month',
    description: 'Push yourself to attend more training sessions',
    type: 'attendance' as const,
    targetValue: 20,
  },
  {
    title: 'Compete in next tournament',
    description: 'Sign up and compete in the upcoming competition',
    type: 'competition' as const,
    targetValue: 1,
  },
  {
    title: 'Maintain 30-day streak',
    description: 'Train consistently for a full month',
    type: 'streak' as const,
    targetValue: 30,
  },
  {
    title: 'Learn 5 new techniques',
    description: 'Expand your judo repertoire',
    type: 'technique' as const,
    targetValue: 5,
  },
];
