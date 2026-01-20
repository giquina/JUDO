// Judo Club App - TypeScript Types

// Belt ranks in order of progression
export type BeltRank =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black";

export const BELT_RANKS: BeltRank[] = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "brown",
  "black",
];

export const BELT_COLORS: Record<BeltRank, string> = {
  white: "#FFFFFF",
  yellow: "#FFD700",
  orange: "#FFA500",
  green: "#228B22",
  blue: "#1E40AF",
  brown: "#8B4513",
  black: "#000000",
};

// Subscription types
export type SubscriptionStatus = "active" | "inactive" | "paused";
export type SubscriptionTier = "none" | "student" | "standard" | "premium";

export interface SubscriptionPricing {
  tier: SubscriptionTier;
  name: string;
  priceMonthly: number; // in pence
  features: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionPricing[] = [
  {
    tier: "student",
    name: "Student",
    priceMonthly: 2500, // £25
    features: ["2 sessions/week", "Belt progression tracking", "Basic support"],
  },
  {
    tier: "standard",
    name: "Standard",
    priceMonthly: 4000, // £40
    features: ["Unlimited sessions", "Priority booking", "Email support"],
  },
  {
    tier: "premium",
    name: "Premium",
    priceMonthly: 6000, // £60
    features: [
      "Everything in Standard",
      "1 private coaching session/month",
      "Competition prep",
    ],
  },
];

// Day of week
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// Class level
export type ClassLevel = "beginner" | "intermediate" | "advanced" | "mixed";

// Attendance status
export type AttendanceStatus = "attended" | "absent" | "cancelled";

// Payment types
export type PaymentType = "subscription" | "session";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

// Admin roles
export type AdminRole = "coach" | "treasurer" | "super_admin";

// User interface (from auth)
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "member" | "coach" | "treasurer" | "super_admin";
}

// Member interface
export interface Member {
  _id: string;
  userId: string;
  email: string;
  name: string;
  beltRank: BeltRank;
  joinDate: number;
  totalSessions: number;
  stripeCustomerId?: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionEndDate?: number;
  emergencyContact?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Class interface
export interface JudoClass {
  _id: string;
  name: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  coachId: string;
  maxCapacity: number;
  currentAttendance: number;
  location: string;
  level: ClassLevel;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

// Attendance record
export interface AttendanceRecord {
  _id: string;
  memberId: string;
  classId: string;
  checkInTime: number;
  checkOutTime?: number;
  status: AttendanceStatus;
  manualOverride?: boolean;
  notes?: string;
  createdAt: number;
}

// Payment record
export interface Payment {
  _id: string;
  memberId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: "GBP";
  paymentType: PaymentType;
  status: PaymentStatus;
  subscriptionPeriodStart?: number;
  subscriptionPeriodEnd?: number;
  classesIncluded?: number;
  sessionDate?: number;
  receipt?: string;
  createdAt: number;
  updatedAt: number;
}

// Admin user
export interface Admin {
  _id: string;
  userId: string;
  role: AdminRole;
  name: string;
  email: string;
  permissions: string[];
  createdAt: number;
}

// Dashboard stats
export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  sessionsThisMonth: number;
  averageAttendance: number;
}

// QR Code data structure
export interface QRCheckInData {
  classId: string;
  date: string; // ISO date string
  timestamp: number;
}
