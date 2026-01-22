/**
 * Judo Belt Progression Constants
 * Based on BJA Kyu Grade Syllabus (November 2024)
 * https://www.britishjudo.org.uk/wp-content/uploads/2024/11/Kyu-Grade-Syllabus-8th-November-2024.pdf
 */

export interface BeltRank {
  grade: string;
  name: string;
  color: string;
  hexColor: string;
  textColor: string;
  minDaysToNext: number | null;
  minAge: number | null;
  order: number;
}

/**
 * BJA Belt Progression System
 * Kyu grades (beginner → advanced): 6th Kyu to 1st Kyu
 * Dan grades (black belt): 1st Dan to 10th Dan
 */
export const BELT_RANKS: BeltRank[] = [
  // Kyu Grades (colored belts)
  {
    grade: "6th Kyu",
    name: "Red",
    color: "red",
    hexColor: "#DC2626",
    textColor: "#FFFFFF",
    minDaysToNext: 30, // 1 month per BJA
    minAge: null,
    order: 1,
  },
  {
    grade: "5th Kyu",
    name: "Yellow",
    color: "yellow",
    hexColor: "#EAB308",
    textColor: "#000000",
    minDaysToNext: 30, // 1 month
    minAge: null,
    order: 2,
  },
  {
    grade: "4th Kyu",
    name: "Orange",
    color: "orange",
    hexColor: "#EA580C",
    textColor: "#FFFFFF",
    minDaysToNext: 56, // 8 weeks per BJA
    minAge: null,
    order: 3,
  },
  {
    grade: "3rd Kyu",
    name: "Green",
    color: "green",
    hexColor: "#16A34A",
    textColor: "#FFFFFF",
    minDaysToNext: 56, // 8 weeks
    minAge: null,
    order: 4,
  },
  {
    grade: "2nd Kyu",
    name: "Blue",
    color: "blue",
    hexColor: "#2563EB",
    textColor: "#FFFFFF",
    minDaysToNext: 90, // 3 months per BJA
    minAge: null,
    order: 5,
  },
  {
    grade: "1st Kyu",
    name: "Brown",
    color: "brown",
    hexColor: "#92400E",
    textColor: "#FFFFFF",
    minDaysToNext: 90, // 3 months before Dan grade
    minAge: null,
    order: 6,
  },
  // Dan Grades (black belts)
  {
    grade: "1st Dan",
    name: "Black",
    color: "black",
    hexColor: "#171717",
    textColor: "#FFFFFF",
    minDaysToNext: 365, // 1 year minimum
    minAge: 15, // BJA minimum age
    order: 7,
  },
  {
    grade: "2nd Dan",
    name: "Black",
    color: "black",
    hexColor: "#171717",
    textColor: "#FFFFFF",
    minDaysToNext: 730, // 2 years
    minAge: 17,
    order: 8,
  },
  {
    grade: "3rd Dan",
    name: "Black",
    color: "black",
    hexColor: "#171717",
    textColor: "#FFFFFF",
    minDaysToNext: 1095, // 3 years
    minAge: 20,
    order: 9,
  },
  {
    grade: "4th Dan",
    name: "Black",
    color: "black",
    hexColor: "#171717",
    textColor: "#FFFFFF",
    minDaysToNext: 1460, // 4 years
    minAge: 24,
    order: 10,
  },
  {
    grade: "5th Dan",
    name: "Black",
    color: "black",
    hexColor: "#171717",
    textColor: "#FFFFFF",
    minDaysToNext: 1825, // 5 years
    minAge: 29,
    order: 11,
  },
];

/**
 * Belt color mapping for UI components
 * Used in badges, cards, and member displays
 */
export const BELT_COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  white: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" },
  red: { bg: "bg-red-600", text: "text-white", border: "border-red-700" },
  yellow: { bg: "bg-yellow-400", text: "text-black", border: "border-yellow-500" },
  orange: { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" },
  green: { bg: "bg-green-600", text: "text-white", border: "border-green-700" },
  blue: { bg: "bg-blue-600", text: "text-white", border: "border-blue-700" },
  brown: { bg: "bg-amber-800", text: "text-white", border: "border-amber-900" },
  black: { bg: "bg-gray-900", text: "text-white", border: "border-black" },
};

/**
 * Age restrictions for techniques
 * Based on IJF and BJA safety guidelines
 */
export const TECHNIQUE_AGE_RESTRICTIONS = {
  chokes: {
    minAge: 13,
    japaneseName: "Shime-waza",
    description: "Choking/strangling techniques",
  },
  armLocks: {
    minAge: 16,
    japaneseName: "Kansetsu-waza",
    description: "Joint locking techniques",
  },
  fullCompetition: {
    minAge: 15,
    description: "Full senior competition rules",
  },
};

/**
 * Subscription tiers for the club
 */
export const SUBSCRIPTION_TIERS = {
  student: {
    name: "Student",
    priceMonthly: 1500, // £15.00 in pence
    features: ["2 classes per week", "Basic access", "Student discount"],
  },
  standard: {
    name: "Standard",
    priceMonthly: 2500, // £25.00
    features: ["Unlimited classes", "Full access", "Priority booking"],
  },
  premium: {
    name: "Premium",
    priceMonthly: 4000, // £40.00
    features: ["Unlimited classes", "1-on-1 coaching", "Competition support", "Guest passes"],
  },
};

/**
 * Helper function to get belt info by grade name
 */
export function getBeltByGrade(grade: string): BeltRank | undefined {
  return BELT_RANKS.find((belt) => belt.grade.toLowerCase() === grade.toLowerCase());
}

/**
 * Helper function to get belt info by color name
 */
export function getBeltByColor(color: string): BeltRank | undefined {
  return BELT_RANKS.find((belt) => belt.color.toLowerCase() === color.toLowerCase());
}

/**
 * Check if member is eligible for next grade based on time
 */
export function isEligibleForPromotion(
  currentGrade: string,
  daysSinceLastPromotion: number
): boolean {
  const currentBelt = getBeltByGrade(currentGrade);
  if (!currentBelt || !currentBelt.minDaysToNext) return false;
  return daysSinceLastPromotion >= currentBelt.minDaysToNext;
}

/**
 * Get the next belt rank after current
 */
export function getNextBelt(currentGrade: string): BeltRank | undefined {
  const currentBelt = getBeltByGrade(currentGrade);
  if (!currentBelt) return undefined;
  return BELT_RANKS.find((belt) => belt.order === currentBelt.order + 1);
}
