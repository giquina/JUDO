/**
 * Authentication Types
 *
 * Strict TypeScript types for user roles and authentication state.
 */

/**
 * User roles in the application.
 * - member: Regular club member with basic access
 * - coach: Coach with access to coaching tools and member management
 * - admin: Club administrator with full management access
 * - treasurer: Financial role with access to payments and financial reports
 * - super_admin: System administrator with all permissions
 */
export type UserRole = 'member' | 'coach' | 'admin' | 'treasurer' | 'super_admin';

/**
 * Belt ranks in judo, from beginner to expert.
 */
export type BeltRank =
  | 'white'
  | 'yellow'
  | 'orange'
  | 'green'
  | 'blue'
  | 'brown'
  | 'black';

/**
 * Subscription status for club membership.
 */
export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'cancelled';

/**
 * Authenticated user information.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  beltRank: BeltRank | string; // Allow string for flexibility with backend data
  subscriptionStatus: SubscriptionStatus | string;
}

/**
 * Authentication state interface.
 */
export interface AuthState {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingEmail: string | null;
}

/**
 * Authentication context type with state and actions.
 */
export interface AuthContextType extends AuthState {
  signIn: (email: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

/**
 * Result of a sign-in attempt.
 */
export interface SignInResult {
  success: boolean;
  error?: string;
}

/**
 * Mock user data structure for development.
 */
export interface MockUserData {
  user: User;
  role: UserRole;
}

/**
 * Role hierarchy for permission checks.
 * Higher index = more permissions.
 */
export const ROLE_HIERARCHY: readonly UserRole[] = [
  'member',
  'coach',
  'treasurer',
  'admin',
  'super_admin',
] as const;

/**
 * Check if a role has at least the required permission level.
 */
export function hasMinimumRole(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}

/**
 * Type guard to check if a string is a valid UserRole.
 */
export function isValidRole(role: string | null): role is UserRole {
  if (!role) return false;
  return ['member', 'coach', 'admin', 'treasurer', 'super_admin'].includes(role);
}
