import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// ============================================================================
// TYPES
// ============================================================================

export type ClubRole =
  | "club_owner"
  | "head_sensei"
  | "sensei"
  | "sempai"
  | "front_desk"
  | "judoka";

export type MembershipStatus = "active" | "inactive" | "suspended" | "trial";

export type BeltRank =
  | "6th_kyu" // White
  | "5th_kyu" // Yellow
  | "4th_kyu" // Orange
  | "3rd_kyu" // Green
  | "2nd_kyu" // Blue
  | "1st_kyu" // Brown
  | "1st_dan" // Black belt 1st degree
  | "2nd_dan"
  | "3rd_dan"
  | "4th_dan"
  | "5th_dan"
  | "6th_dan"
  | "7th_dan"
  | "8th_dan"
  | "9th_dan"
  | "10th_dan";

interface Club {
  _id: Id<"clubs">;
  name: string;
  slug: string;
  dojoName?: string;
  email: string;
  city: string;
  country: string;
  logoUrl?: string;
  primaryColor?: string;
  planTier: "trial" | "active" | "paused" | "cancelled";
  trialEndsAt?: number;
}

interface ClubMember {
  _id: Id<"clubMembers">;
  clubId: Id<"clubs">;
  userId: string;
  name: string;
  email: string;
  role: ClubRole;
  currentBelt: BeltRank;
  membershipStatus: MembershipStatus;
  membershipTier: "trial" | "student" | "standard" | "unlimited";
  joinDate: number;
  totalSessions: number;
  lastAttendance?: number;
}

interface ClubContextType {
  // Current Club
  club: Club | null;
  clubId: Id<"clubs"> | null;
  isLoadingClub: boolean;

  // Current User's Membership
  membership: ClubMember | null;
  role: ClubRole | null;
  isLoadingMembership: boolean;

  // Permissions
  isOwner: boolean;
  isHeadSensei: boolean;
  isSensei: boolean;
  isSempai: boolean;
  isFrontDesk: boolean;
  isJudoka: boolean;
  canManageMembers: boolean;
  canManageClasses: boolean;
  canViewPayments: boolean;
  canGradeStudents: boolean;

  // Actions
  setClubId: (clubId: Id<"clubs"> | null) => void;
  refreshMembership: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ClubContext = createContext<ClubContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ClubProviderProps {
  children: ReactNode;
  userId: string; // From auth context
}

export function ClubProvider({ children, userId }: ClubProviderProps) {
  const [clubId, setClubId] = useState<Id<"clubs"> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load club from localStorage on mount
  useEffect(() => {
    const savedClubId = localStorage.getItem("currentClubId");
    if (savedClubId) {
      setClubId(savedClubId as Id<"clubs">);
    }
  }, []);

  // Save club to localStorage when it changes
  useEffect(() => {
    if (clubId) {
      localStorage.setItem("currentClubId", clubId);
    } else {
      localStorage.removeItem("currentClubId");
    }
  }, [clubId]);

  // Fetch club data
  const club = useQuery(
    api.functions.clubs.getById,
    clubId ? { clubId } : "skip"
  );

  // Fetch user's membership in this club
  const membership = useQuery(
    api.functions.clubMembers.getByUserId,
    clubId && userId ? { clubId, userId } : "skip"
  );

  const isLoadingClub = clubId !== null && club === undefined;
  const isLoadingMembership = clubId !== null && membership === undefined;

  // Compute permissions based on role
  const role = membership?.role || null;
  const isOwner = role === "club_owner";
  const isHeadSensei = role === "head_sensei";
  const isSensei = role === "sensei";
  const isSempai = role === "sempai";
  const isFrontDesk = role === "front_desk";
  const isJudoka = role === "judoka";

  // Permission helpers
  const canManageMembers = isOwner || isHeadSensei || isSensei;
  const canManageClasses = isOwner || isHeadSensei || isSensei;
  const canViewPayments = isOwner || isHeadSensei;
  const canGradeStudents = isOwner || isHeadSensei || isSensei;

  const refreshMembership = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const value: ClubContextType = {
    club: club || null,
    clubId,
    isLoadingClub,
    membership: membership || null,
    role,
    isLoadingMembership,
    isOwner,
    isHeadSensei,
    isSensei,
    isSempai,
    isFrontDesk,
    isJudoka,
    canManageMembers,
    canManageClasses,
    canViewPayments,
    canGradeStudents,
    setClubId,
    refreshMembership,
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useClub() {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
}

// ============================================================================
// UTILITIES
// ============================================================================

// Belt rank display names
export const BELT_NAMES: Record<BeltRank, { name: string; color: string }> = {
  "6th_kyu": { name: "White Belt (6th Kyu)", color: "#FFFFFF" },
  "5th_kyu": { name: "Yellow Belt (5th Kyu)", color: "#FFD700" },
  "4th_kyu": { name: "Orange Belt (4th Kyu)", color: "#FF8C00" },
  "3rd_kyu": { name: "Green Belt (3rd Kyu)", color: "#228B22" },
  "2nd_kyu": { name: "Blue Belt (2nd Kyu)", color: "#1E90FF" },
  "1st_kyu": { name: "Brown Belt (1st Kyu)", color: "#8B4513" },
  "1st_dan": { name: "Black Belt 1st Dan (Shodan)", color: "#000000" },
  "2nd_dan": { name: "Black Belt 2nd Dan (Nidan)", color: "#000000" },
  "3rd_dan": { name: "Black Belt 3rd Dan (Sandan)", color: "#000000" },
  "4th_dan": { name: "Black Belt 4th Dan (Yondan)", color: "#000000" },
  "5th_dan": { name: "Black Belt 5th Dan (Godan)", color: "#000000" },
  "6th_dan": { name: "Black Belt 6th Dan (Rokudan)", color: "#000000" },
  "7th_dan": { name: "Black Belt 7th Dan (Shichidan)", color: "#000000" },
  "8th_dan": { name: "Black Belt 8th Dan (Hachidan)", color: "#000000" },
  "9th_dan": { name: "Black Belt 9th Dan (Kudan)", color: "#000000" },
  "10th_dan": { name: "Black Belt 10th Dan (Judan)", color: "#000000" },
};

// Role display names
export const ROLE_NAMES: Record<ClubRole, string> = {
  club_owner: "Club Owner",
  head_sensei: "Head Sensei (Shihan)",
  sensei: "Sensei (Instructor)",
  sempai: "Sempai (Senior Student)",
  front_desk: "Front Desk",
  judoka: "Judoka (Member)",
};

// Get belt color for badge
export function getBeltColor(belt: BeltRank): string {
  return BELT_NAMES[belt]?.color || "#CCCCCC";
}

// Get belt display name
export function getBeltDisplayName(belt: BeltRank): string {
  return BELT_NAMES[belt]?.name || belt;
}

// Get role display name
export function getRoleDisplayName(role: ClubRole): string {
  return ROLE_NAMES[role] || role;
}

// Check if user can perform action
export function hasPermission(
  role: ClubRole | null,
  permission: "manage_members" | "manage_classes" | "view_payments" | "grade_students"
): boolean {
  if (!role) return false;

  const permissions = {
    club_owner: ["manage_members", "manage_classes", "view_payments", "grade_students"],
    head_sensei: ["manage_members", "manage_classes", "view_payments", "grade_students"],
    sensei: ["manage_members", "manage_classes", "grade_students"],
    sempai: ["manage_classes"],
    front_desk: [],
    judoka: [],
  };

  return permissions[role]?.includes(permission) || false;
}
