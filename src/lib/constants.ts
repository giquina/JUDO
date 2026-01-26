/**
 * Shared UI Constants
 * Centralized color mappings and constants used across dashboard and page components.
 */

/**
 * Belt color styling for badges and UI components.
 * Used in coach dashboards, admin pages, and attendance views.
 */
export const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800 border-gray-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  green: "bg-green-100 text-green-800 border-green-200",
  blue: "bg-blue-600 text-white border-blue-700",
  brown: "bg-amber-800 text-white border-amber-900",
  black: "bg-gray-900 text-white border-gray-950",
};

/**
 * Simplified belt colors (without border) for some UI contexts.
 * Used where only bg and text colors are needed.
 */
export const BELT_COLORS_SIMPLE: Record<string, string> = {
  white: "bg-gray-100 text-gray-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-600 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white",
};

/**
 * Class level color styling for badges.
 * Used in class cards, coach pages, and attendance views.
 */
export const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-blue-100 text-blue-800 border-blue-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
  all: "bg-orange-100 text-orange-800 border-orange-200",
  mixed: "bg-orange-100 text-orange-800 border-orange-200",
};

/**
 * Subscription/membership status colors.
 * Used in member tables and admin dashboards.
 */
export const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paused: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * Payment status colors.
 */
export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * Belt order for sorting.
 */
export const BELT_ORDER = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "brown",
  "black",
];

/**
 * Subscription tier order for sorting.
 */
export const TIER_ORDER = ["student", "standard", "premium"];
