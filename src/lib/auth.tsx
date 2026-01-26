import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  User,
  UserRole,
  AuthContextType,
  MockUserData,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// DEV MODE: Set to true to auto-login as admin (skip login during development)
const DEV_MODE = false;
const DEV_USER_ROLE: UserRole = "admin"; // Change this to test different roles

// Mock users for demo - will be replaced with Convex queries
const MOCK_USERS: Record<string, MockUserData> = {
  "a.chen@bbk.ac.uk": {
    user: { _id: "1", name: "Alice Chen", email: "a.chen@bbk.ac.uk", beltRank: "blue", subscriptionStatus: "active" },
    role: "member"
  },
  "coach@bbk.ac.uk": {
    user: { _id: "2", name: "Sensei Tanaka", email: "coach@bbk.ac.uk", beltRank: "black", subscriptionStatus: "active" },
    role: "coach"
  },
  "admin@bbk.ac.uk": {
    user: { _id: "3", name: "Admin User", email: "admin@bbk.ac.uk", beltRank: "black", subscriptionStatus: "active" },
    role: "admin"
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    // DEV MODE: Auto-login for development/testing
    if (DEV_MODE) {
      const devEmails: Record<string, string> = {
        member: "a.chen@bbk.ac.uk",
        coach: "coach@bbk.ac.uk",
        admin: "admin@bbk.ac.uk"
      };
      const devEmail = devEmails[DEV_USER_ROLE];
      if (MOCK_USERS[devEmail]) {
        queueMicrotask(() => {
          setUser(MOCK_USERS[devEmail].user);
          setRole(MOCK_USERS[devEmail].role);
          setIsLoading(false);
        });
      } else {
        queueMicrotask(() => setIsLoading(false));
      }
      return;
    }

    const savedEmail = localStorage.getItem("judo_auth_email");
    if (savedEmail) {
      const normalizedEmail = savedEmail.toLowerCase();
      if (MOCK_USERS[normalizedEmail]) {
        queueMicrotask(() => {
          setUser(MOCK_USERS[normalizedEmail].user);
          setRole(MOCK_USERS[normalizedEmail].role);
        });
      } else {
        // Restore session for any previously logged-in user
        const savedUser = localStorage.getItem("judo_auth_user");
        const savedRole = localStorage.getItem("judo_auth_role") as UserRole | null;
        if (savedUser && savedRole) {
          queueMicrotask(() => {
            setUser(JSON.parse(savedUser));
            setRole(savedRole);
          });
        }
      }
    }
    queueMicrotask(() => setIsLoading(false));
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
      newUser = {
        _id: Date.now().toString(),
        name: email.split("@")[0],
        email: normalizedEmail,
        beltRank: "white",
        subscriptionStatus: "pending"
      };
      newRole = "member";
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
