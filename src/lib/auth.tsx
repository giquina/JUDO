import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Multi-Tenant User Interface (Judoka)
interface User {
  _id: string;
  userId: string; // Auth user ID
  name: string;
  email: string;
  currentBelt: string; // Using Kyu/Dan system
  membershipStatus: string;
  role: string; // Club role: judoka, sensei, head_sensei, club_owner, etc.
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  pendingEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// DEV MODE: Set to true to auto-login (skip login during development)
const DEV_MODE = true;
const DEV_USER_ROLE: "judoka" | "sensei" | "club_owner" = "club_owner"; // Change this to test different roles

// Mock users for demo - will be replaced with Convex queries
// Using proper judo terminology and Kyu/Dan system
const MOCK_USERS: Record<string, { user: User; role: string }> = {
  "a.chen@bbk.ac.uk": {
    user: {
      _id: "1",
      userId: "user_1",
      name: "Alice Chen",
      email: "a.chen@bbk.ac.uk",
      currentBelt: "2nd_kyu", // Blue belt (2nd Kyu)
      membershipStatus: "active",
      role: "judoka" // Regular member
    },
    role: "judoka"
  },
  "sensei@bbk.ac.uk": {
    user: {
      _id: "2",
      userId: "user_2",
      name: "Sensei Tanaka",
      email: "sensei@bbk.ac.uk",
      currentBelt: "3rd_dan", // Black belt 3rd Dan
      membershipStatus: "active",
      role: "sensei" // Instructor
    },
    role: "sensei"
  },
  "owner@bbk.ac.uk": {
    user: {
      _id: "3",
      userId: "user_3",
      name: "Shihan Yamamoto",
      email: "owner@bbk.ac.uk",
      currentBelt: "5th_dan", // Black belt 5th Dan
      membershipStatus: "active",
      role: "club_owner" // Club owner/head sensei
    },
    role: "club_owner"
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    // DEV MODE: Auto-login for development/testing
    if (DEV_MODE) {
      const devEmails: Record<string, string> = {
        judoka: "a.chen@bbk.ac.uk",
        sensei: "sensei@bbk.ac.uk",
        club_owner: "owner@bbk.ac.uk"
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
          setRole(savedRole);
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
    let newRole: string;

    if (MOCK_USERS[normalizedEmail]) {
      newUser = MOCK_USERS[normalizedEmail].user;
      newRole = MOCK_USERS[normalizedEmail].role;
    } else {
      // Create new judoka (member) for any email
      newUser = {
        _id: Date.now().toString(),
        userId: `user_${Date.now()}`,
        name: email.split("@")[0],
        email: normalizedEmail,
        currentBelt: "6th_kyu", // White belt (6th Kyu) for new members
        membershipStatus: "trial",
        role: "judoka" // New members start as judoka
      };
      newRole = "judoka";
    }

    setUser(newUser);
    setRole(newRole);

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
    <AuthContext.Provider value={{ user, role, isLoading, isAuthenticated, signIn, signOut, pendingEmail }}>
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
