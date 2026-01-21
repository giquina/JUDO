// Mock data for belt progression and progress analytics

export interface BeltLevel {
  name: string;
  color: string;
  rank: number;
  gradient: string;
}

export const BELT_LEVELS: BeltLevel[] = [
  { name: "White", color: "#FFFFFF", rank: 1, gradient: "from-gray-100 to-gray-300" },
  { name: "Yellow", color: "#FCD34D", rank: 2, gradient: "from-yellow-200 to-yellow-400" },
  { name: "Orange", color: "#FB923C", rank: 3, gradient: "from-orange-300 to-orange-500" },
  { name: "Green", color: "#4ADE80", rank: 4, gradient: "from-green-300 to-green-500" },
  { name: "Blue", color: "#60A5FA", rank: 5, gradient: "from-blue-300 to-blue-500" },
  { name: "Brown", color: "#A16207", rank: 6, gradient: "from-yellow-700 to-yellow-900" },
  { name: "Black", color: "#1F2937", rank: 7, gradient: "from-gray-800 to-gray-950" },
];

export interface BeltRequirement {
  id: string;
  category: "hours" | "techniques" | "time" | "recommendation";
  title: string;
  current: number;
  required: number;
  unit: string;
  completed: boolean;
}

export interface Technique {
  id: string;
  name: string;
  category: "throws" | "pins" | "chokes" | "armlocks" | "kata";
  completed: boolean;
  videoUrl?: string;
  senseiNotes?: string;
}

export interface BeltHistory {
  belt: string;
  dateAwarded: Date;
  gradingScore?: number;
  examiner?: string;
  location?: string;
}

export interface TrainingSession {
  id: string;
  date: Date;
  type: "Beginners" | "Intermediate" | "Advanced" | "Randori" | "Kata" | "Competition";
  duration: number; // in minutes
  rating?: number; // 1-5 stars
  notes?: string;
  techniquesPracticed: string[];
  trainingPartners?: string[];
  energyLevel?: number; // 1-5
  mood?: "excellent" | "good" | "okay" | "tired" | "injured";
  injuries?: string[];
  personalRecords?: string[];
}

export interface AttendanceData {
  date: string;
  classes: number;
  hours: number;
}

export interface ClassTypeData {
  type: string;
  count: number;
  color: string;
}

export interface WeeklyHeatmapData {
  day: string;
  week: string;
  value: number;
}

// Current belt progress
export const currentBelt: BeltLevel = BELT_LEVELS[3]; // Green belt
export const nextBelt: BeltLevel = BELT_LEVELS[4]; // Blue belt

// Belt requirements for next grading
export const beltRequirements: BeltRequirement[] = [
  {
    id: "req-1",
    category: "hours",
    title: "Training Hours",
    current: 78,
    required: 100,
    unit: "hours",
    completed: false,
  },
  {
    id: "req-2",
    category: "techniques",
    title: "Techniques Mastered",
    current: 18,
    required: 25,
    unit: "techniques",
    completed: false,
  },
  {
    id: "req-3",
    category: "time",
    title: "Time at Current Belt",
    current: 5,
    required: 6,
    unit: "months",
    completed: false,
  },
  {
    id: "req-4",
    category: "recommendation",
    title: "Sensei Recommendation",
    current: 0,
    required: 1,
    unit: "approval",
    completed: false,
  },
];

// Techniques to master for next belt
export const techniquesList: Technique[] = [
  // Throws (Nage-waza)
  { id: "tech-1", name: "O-soto-gari", category: "throws", completed: true },
  { id: "tech-2", name: "Uchi-mata", category: "throws", completed: true },
  { id: "tech-3", name: "Harai-goshi", category: "throws", completed: true },
  { id: "tech-4", name: "Seoi-nage", category: "throws", completed: true },
  { id: "tech-5", name: "Tai-otoshi", category: "throws", completed: true },
  { id: "tech-6", name: "Ko-uchi-gari", category: "throws", completed: false },
  { id: "tech-7", name: "O-uchi-gari", category: "throws", completed: false },
  { id: "tech-8", name: "Tomoe-nage", category: "throws", completed: false },

  // Pins (Osaekomi-waza)
  { id: "tech-9", name: "Kesa-gatame", category: "pins", completed: true },
  { id: "tech-10", name: "Yoko-shiho-gatame", category: "pins", completed: true },
  { id: "tech-11", name: "Kami-shiho-gatame", category: "pins", completed: true },
  { id: "tech-12", name: "Tate-shiho-gatame", category: "pins", completed: false },
  { id: "tech-13", name: "Kuzure-kesa-gatame", category: "pins", completed: false },

  // Chokes (Shime-waza)
  { id: "tech-14", name: "Hadaka-jime", category: "chokes", completed: true },
  { id: "tech-15", name: "Okuri-eri-jime", category: "chokes", completed: true },
  { id: "tech-16", name: "Kata-juji-jime", category: "chokes", completed: false },
  { id: "tech-17", name: "Gyaku-juji-jime", category: "chokes", completed: false },

  // Armlocks (Kansetsu-waza)
  { id: "tech-18", name: "Juji-gatame", category: "armlocks", completed: true },
  { id: "tech-19", name: "Ude-garami", category: "armlocks", completed: true },
  { id: "tech-20", name: "Ude-hishigi-waki-gatame", category: "armlocks", completed: false },

  // Kata
  { id: "tech-21", name: "Nage-no-Kata (1st set)", category: "kata", completed: true },
  { id: "tech-22", name: "Nage-no-Kata (2nd set)", category: "kata", completed: true },
  { id: "tech-23", name: "Nage-no-Kata (3rd set)", category: "kata", completed: false },
  { id: "tech-24", name: "Katame-no-Kata (1st set)", category: "kata", completed: false },
  { id: "tech-25", name: "Katame-no-Kata (2nd set)", category: "kata", completed: false },
];

// Belt history
export const beltHistory: BeltHistory[] = [
  {
    belt: "White",
    dateAwarded: new Date("2023-09-15"),
    location: "Birkbeck University Dojo",
  },
  {
    belt: "Yellow",
    dateAwarded: new Date("2024-01-20"),
    gradingScore: 85,
    examiner: "Sensei Tanaka",
    location: "Birkbeck University Dojo",
  },
  {
    belt: "Orange",
    dateAwarded: new Date("2024-06-10"),
    gradingScore: 88,
    examiner: "Sensei Yamamoto",
    location: "Birkbeck University Dojo",
  },
  {
    belt: "Green",
    dateAwarded: new Date("2024-11-15"),
    gradingScore: 92,
    examiner: "Sensei Tanaka",
    location: "Birkbeck University Dojo",
  },
];

// Generate 6 months of attendance data
export const generateAttendanceData = (): AttendanceData[] => {
  const data: AttendanceData[] = [];
  const today = new Date();

  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate realistic attendance (0-3 classes per day)
    const dayOfWeek = date.getDay();
    let classes = 0;

    // Higher attendance on training days (Mon, Wed, Fri)
    if ([1, 3, 5].includes(dayOfWeek)) {
      classes = Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
    } else if ([2, 4].includes(dayOfWeek)) {
      // Occasional Tuesday/Thursday sessions
      classes = Math.random() > 0.7 ? 1 : 0;
    }

    data.push({
      date: date.toISOString().split('T')[0],
      classes,
      hours: classes * 1.5, // 1.5 hours per class
    });
  }

  return data;
};

export const attendanceData = generateAttendanceData();

// Class type distribution
export const classTypeData: ClassTypeData[] = [
  { type: "Beginners", count: 45, color: "#60A5FA" },
  { type: "Intermediate", count: 38, color: "#34D399" },
  { type: "Randori", count: 25, color: "#F59E0B" },
  { type: "Kata", count: 15, color: "#A78BFA" },
  { type: "Advanced", count: 12, color: "#F87171" },
  { type: "Competition", count: 8, color: "#EC4899" },
];

// Weekly heatmap data (last 12 weeks)
export const generateWeeklyHeatmap = (): WeeklyHeatmapData[] => {
  const data: WeeklyHeatmapData[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let week = 12; week >= 1; week--) {
    days.forEach((day) => {
      let value = 0;

      // Higher activity on Mon, Wed, Fri
      if (["Mon", "Wed", "Fri"].includes(day)) {
        value = Math.floor(Math.random() * 3); // 0-2 classes
      } else if (["Tue", "Thu"].includes(day)) {
        value = Math.random() > 0.7 ? 1 : 0;
      }

      data.push({
        day,
        week: `W${week}`,
        value,
      });
    });
  }

  return data;
};

export const weeklyHeatmapData = generateWeeklyHeatmap();

// Training log entries
export const trainingLog: TrainingSession[] = [
  {
    id: "log-1",
    date: new Date("2026-01-20"),
    type: "Intermediate",
    duration: 90,
    rating: 5,
    notes: "Excellent session! Finally nailed the uchi-mata transition.",
    techniquesPracticed: ["Uchi-mata", "O-soto-gari", "Newaza transitions"],
    trainingPartners: ["Alex", "Sarah", "James"],
    energyLevel: 4,
    mood: "excellent",
  },
  {
    id: "log-2",
    date: new Date("2026-01-18"),
    type: "Randori",
    duration: 90,
    rating: 4,
    notes: "Tough randori session. Need to work on grip fighting.",
    techniquesPracticed: ["Randori", "Grip fighting", "Counter techniques"],
    trainingPartners: ["Mike", "Chen", "Oliver"],
    energyLevel: 3,
    mood: "good",
  },
  {
    id: "log-3",
    date: new Date("2026-01-17"),
    type: "Kata",
    duration: 60,
    rating: 4,
    notes: "Working on Nage-no-Kata 3rd set. Getting smoother.",
    techniquesPracticed: ["Nage-no-Kata"],
    trainingPartners: ["Sarah"],
    energyLevel: 4,
    mood: "good",
  },
  {
    id: "log-4",
    date: new Date("2026-01-15"),
    type: "Intermediate",
    duration: 90,
    rating: 3,
    notes: "Felt a bit tired today. Focused on technique refinement.",
    techniquesPracticed: ["Seoi-nage", "Tai-otoshi", "Osaekomi drills"],
    trainingPartners: ["Alex", "Emma"],
    energyLevel: 2,
    mood: "tired",
  },
  {
    id: "log-5",
    date: new Date("2026-01-13"),
    type: "Beginners",
    duration: 90,
    rating: 5,
    notes: "Great session helping newer students. Teaching really helps solidify fundamentals.",
    techniquesPracticed: ["O-soto-gari", "Kesa-gatame", "Ukemi"],
    trainingPartners: ["New students"],
    energyLevel: 5,
    mood: "excellent",
  },
  {
    id: "log-6",
    date: new Date("2026-01-11"),
    type: "Randori",
    duration: 90,
    rating: 4,
    notes: "Managed to successfully apply ko-uchi-gari for the first time in randori!",
    techniquesPracticed: ["Ko-uchi-gari", "Randori", "Combinations"],
    trainingPartners: ["James", "Oliver", "Chen"],
    energyLevel: 4,
    mood: "excellent",
    personalRecords: ["First successful ko-uchi-gari in randori"],
  },
  {
    id: "log-7",
    date: new Date("2026-01-10"),
    type: "Intermediate",
    duration: 90,
    rating: 3,
    notes: "Minor shoulder strain. Took it easy on throws.",
    techniquesPracticed: ["Newaza", "Pins", "Light uchikomi"],
    trainingPartners: ["Sarah"],
    energyLevel: 3,
    mood: "okay",
    injuries: ["Minor shoulder strain - right shoulder"],
  },
  {
    id: "log-8",
    date: new Date("2026-01-08"),
    type: "Competition",
    duration: 120,
    rating: 5,
    notes: "Internal club competition. Won 2 matches, lost in semifinals. Great experience!",
    techniquesPracticed: ["Competition shiai", "All techniques"],
    trainingPartners: ["Various club members"],
    energyLevel: 5,
    mood: "excellent",
    personalRecords: ["Best competition performance to date"],
  },
];

// Statistics
export const progressStats = {
  totalTrainingHours: 247,
  averageSessionsPerWeek: 2.8,
  mostAttendedClass: "Intermediate",
  favoriteTrainingDay: "Wednesday",
  trainingPartnersCount: 15,
  classesAtCurrentBelt: 52,
  daysToNextBeltMilestone: 45,
  improvementMetrics: {
    attendanceIncrease: 12, // percentage
    techniqueMastery: 72, // percentage
    competitionWins: 8,
    injuryFreeDays: 156,
  },
  previousPeriodComparison: {
    hoursChange: 15, // percentage increase
    sessionsChange: 8,
    techniqueProgress: 5,
  },
};

// Next grading dates
export const nextGradingDates = [
  new Date("2026-03-15"),
  new Date("2026-06-20"),
  new Date("2026-09-15"),
];

// Estimated time to next belt (in days)
export const estimatedDaysToNextBelt = 45;
