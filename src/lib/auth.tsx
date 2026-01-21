import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Role types matching backend schema
export type AdminRole = "coach" | "treasurer" | "content_manager" | "super_admin";
export type UserRole = "member" | AdminRole;

// Permission types matching backend
export type Permission =
  | "view_payments"
  | "export_financial_data"
  | "manage_subscriptions"
  | "manage_members"
  | "view_members"
  | "export_member_data"
  | "check_in_members"
  | "view_attendance"
  | "manage_attendance"
  | "post_announcements"
  | "edit_announcements"
  | "delete_announcements"
  | "upload_media"
  | "manage_media"
  | "manage_events"
  | "view_events"
  | "manage_classes"
  | "view_classes"
  | "manage_admins"
  | "view_reports"
  | "system_settings";

// Role-based permission sets (matching backend)
const ROLE_PERMISSIONS: Record<AdminRole | "member", Permission[]> = {
  super_admin: [
    "view_payments", "export_financial_data", "manage_subscriptions",
    "manage_members", "view_members", "export_member_data",
    "check_in_members", "view_attendance", "manage_attendance",
    "post_announcements", "edit_announcements", "delete_announcements",
    "upload_media", "manage_media", "manage_events", "view_events",
    "manage_classes", "view_classes", "manage_admins", "view_reports", "system_settings"
  ],
  treasurer: [
    "view_payments", "export_financial_data", "manage_subscriptions",
    "manage_members", "view_members", "export_member_data", "view_reports"
  ],
  content_manager: [
    "post_announcements", "edit_announcements", "delete_announcements",
    "upload_media", "manage_media", "manage_events", "view_events", "view_members"
  ],
  coach: [
    "check_in_members", "view_attendance", "manage_attendance",
    "view_classes", "view_members", "view_events"
  ],
  member: []
};

interface User {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  beltRank: string;
  subscriptionStatus: string;
  isStudent?: boolean;
  emailVerified?: boolean;
  verifiedDomain?: string;
  permissions?: Permission[];
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  pendingEmail: string | null;
  hasPermission: (permission: Permission) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isTreasurer: boolean;
  isContentManager: boolean;
  isCoach: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Email verification helpers (mirroring backend logic)
const VALID_UNIVERSITY_DOMAINS = [
  "@mail.bbk.ac.uk", "@bbk.ac.uk", "@ucl.ac.uk", "@imperial.ac.uk",
  "@kcl.ac.uk", "@qmul.ac.uk", "@soas.ac.uk", "@lse.ac.uk",
  "@ox.ac.uk", "@cam.ac.uk", "@manchester.ac.uk", "@ed.ac.uk"
];

function isUniversityEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  return VALID_UNIVERSITY_DOMAINS.some(domain => normalizedEmail.endsWith(domain));
}

function extractEmailDomain(email: string): string | null {
  const normalizedEmail = email.toLowerCase().trim();
  const atIndex = normalizedEmail.indexOf("@");
  if (atIndex === -1) return null;
  return normalizedEmail.substring(atIndex);
}

// DEV MODE: Set to true to auto-login as admin (skip login during development)
const DEV_MODE = true;
const DEV_USER_ROLE: UserRole = "super_admin"; // Change this to test different roles (member, coach, treasurer, content_manager, super_admin)

// Mock users for demo - will be replaced with Convex queries
const MOCK_USERS: Record<string, { user: User; role: UserRole }> = {
  "a.chen@bbk.ac.uk": {
    user: { _id: "1", name: "Alice Chen", email: "a.chen@bbk.ac.uk", beltRank: "blue", subscriptionStatus: "active", isStudent: true, emailVerified: true, verifiedDomain: "@bbk.ac.uk" },
    role: "member"
  },
  "coach@bbk.ac.uk": {
    user: { _id: "2", name: "Sensei Tanaka", email: "coach@bbk.ac.uk", beltRank: "black", subscriptionStatus: "active", isStudent: true, emailVerified: true, verifiedDomain: "@bbk.ac.uk" },
    role: "coach"
  },
  "oliver@bbk.ac.uk": {
    user: { _id: "3", name: "Oliver", email: "oliver@bbk.ac.uk", beltRank: "brown", subscriptionStatus: "active", isStudent: true, emailVerified: true, verifiedDomain: "@bbk.ac.uk" },
    role: "treasurer"
  },
  "joseph@bbk.ac.uk": {
    user: { _id: "4", name: "Joseph", email: "joseph@bbk.ac.uk", beltRank: "blue", subscriptionStatus: "active", isStudent: true, emailVerified: true, verifiedDomain: "@bbk.ac.uk" },
    role: "content_manager"
  },
  "joe.doherty@bbk.ac.uk": {
    user: { _id: "5", name: "Joe Doherty", email: "joe.doherty@bbk.ac.uk", beltRank: "black", subscriptionStatus: "active", isStudent: true, emailVerified: true, verifiedDomain: "@bbk.ac.uk" },
    role: "super_admin"
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Permission checking helper
  const hasPermission = (permission: Permission): boolean => {
    if (!role || role === "member") return false;
    const permissions = ROLE_PERMISSIONS[role as AdminRole];
    return permissions.includes(permission);
  };

  // Role checking helpers
  const isAdmin = role !== null && role !== "member";
  const isSuperAdmin = role === "super_admin";
  const isTreasurer = role === "treasurer";
  const isContentManager = role === "content_manager";
  const isCoach = role === "coach";

  // Check for existing session on mount
  useEffect(() => {
    // DEV MODE: Auto-login for development/testing
    if (DEV_MODE) {
      const devEmails: Record<UserRole, string> = {
        member: "a.chen@bbk.ac.uk",
        coach: "coach@bbk.ac.uk",
        treasurer: "oliver@bbk.ac.uk",
        content_manager: "joseph@bbk.ac.uk",
        super_admin: "joe.doherty@bbk.ac.uk"
      };
      const devEmail = devEmails[DEV_USER_ROLE];
      if (MOCK_USERS[devEmail]) {
        setUser(MOCK_USERS[devEmail].user);
        setRole(MOCK_USERS[devEmail].role);
      }
      setIsLoading(false);
      return;
    }

    const savedEmail = localStorage.getItem("judo_auth_email");
    if (savedEmail) {
      const normalizedEmail = savedEmail.toLowerCase();
      if (MOCK_USERS[normalizedEmail]) {
        setUser(MOCK_USERS[normalizedEmail].user);
        setRole(MOCK_USERS[normalizedEmail].role);
      } else {
        // Restore session for any previously logged-in user
        const savedUser = localStorage.getItem("judo_auth_user");
        const savedRole = localStorage.getItem("judo_auth_role");
        if (savedUser && savedRole) {
          setUser(JSON.parse(savedUser));
          setRole(savedRole as UserRole);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;

  const signIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate magic link sending
    setPendingEmail(email);

    // For demo: auto-login after "sending" magic link
    // In production, this would send an actual email via Resend
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists (or create new member)
    const normalizedEmail = email.toLowerCase();

    // For demo, allow any @bbk.ac.uk email
    if (!normalizedEmail.includes("@")) {
      return { success: false, error: "Invalid email address" };
    }

    return { success: true };
  };

  // Called when user clicks the magic link (simulated)
  const confirmSignIn = (email: string) => {
    const normalizedEmail = email.toLowerCase();
    let newUser: User;
    let newRole: UserRole;

    if (MOCK_USERS[normalizedEmail]) {
      newUser = MOCK_USERS[normalizedEmail].user;
      newRole = MOCK_USERS[normalizedEmail].role;
    } else {
      // Create new member for any email
      const isStudent = isUniversityEmail(normalizedEmail);
      const domain = extractEmailDomain(normalizedEmail);

      newUser = {
        _id: Date.now().toString(),
        name: email.split("@")[0],
        email: normalizedEmail,
        beltRank: "white",
        subscriptionStatus: "pending",
        isStudent: isStudent,
        emailVerified: true,
        verifiedDomain: domain || undefined
      };
      newRole = "member";
    }

    setUser(newUser);
    setRole(newRole as UserRole);

    // Persist session
    localStorage.setItem("judo_auth_email", normalizedEmail);
    localStorage.setItem("judo_auth_user", JSON.stringify(newUser));
    localStorage.setItem("judo_auth_role", newRole);
    setPendingEmail(null);
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
    setPendingEmail(null);
    localStorage.removeItem("judo_auth_email");
    localStorage.removeItem("judo_auth_user");
    localStorage.removeItem("judo_auth_role");
  };

  // Expose confirmSignIn through window for demo purposes
  useEffect(() => {
    (window as unknown as { confirmJudoSignIn: (email: string) => void }).confirmJudoSignIn = confirmSignIn;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isLoading,
      isAuthenticated,
      signIn,
      signOut,
      pendingEmail,
      hasPermission,
      isAdmin,
      isSuperAdmin,
      isTreasurer,
      isContentManager,
      isCoach
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
