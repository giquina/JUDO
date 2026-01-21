// Dashboard Components Export
export { default as ActivityFeed } from './ActivityFeed';
export { default as AnnouncementsCard } from './AnnouncementsCard';
export { default as UpcomingEventsCard } from './UpcomingEventsCard';

// Payment & Profile Components
export { PaymentHistoryCard } from "./PaymentHistoryCard"
export { PaymentHistoryModal } from "./PaymentHistoryModal"
export { SubscriptionManagement } from "./SubscriptionManagement"
export { ProfileQuickEdit } from "./ProfileQuickEdit"
export { ProfileCard } from "./ProfileCard"

// Quick Actions & Interactive Elements
export { QuickActionsBar } from "./QuickActionsBar";
export type { QuickActionsBarProps, QuickAction } from "./QuickActionsBar";

export { CustomizeDashboard, useDashboardPreferences } from "./CustomizeDashboard";
export type {
  CustomizeDashboardProps,
  DashboardPreferences,
  DashboardSection,
} from "./CustomizeDashboard";

export { DashboardTour, useDashboardTour } from "./DashboardTour";
export type { DashboardTourProps, TourStep } from "./DashboardTour";

export { HelpWidget } from "./HelpWidget";
export type { HelpWidgetProps, HelpArticle } from "./HelpWidget";

export {
  SuccessAnimation,
  CheckmarkAnimation,
  TrophyAnimation,
  FlameAnimation,
  BeltUpgradeAnimation,
} from "./SuccessAnimation";
export type { SuccessAnimationProps, AnimationType } from "./SuccessAnimation";

export { DashboardSkeleton, WidgetSkeleton } from "./DashboardSkeleton";

// Gamification System
export { default as AchievementsCard } from './AchievementsCard';
export { default as AchievementsGallery } from './AchievementsGallery';
export { default as TrainingStreak } from './TrainingStreak';
export { default as GoalsTracker } from './GoalsTracker';
export { default as GamificationDemo } from './GamificationDemo';

// Widgets
export * from "./widgets";

// Calendar & Class Management System
export { default as CalendarView } from "./CalendarView";
export { default as ClassBookingModal } from "./ClassBookingModal";
export { default as WeeklySchedule } from "./WeeklySchedule";
export { default as Recommendations } from "./Recommendations";
export { default as SmartInsights } from "./SmartInsights";
export { default as ClassSearch } from "./ClassSearch";

// Social Features
export { TrainingPartners } from "./TrainingPartners";
export { Leaderboard } from "./Leaderboard";
export { CommunityFeed } from "./CommunityFeed";
export { SocialNotifications } from "./SocialNotifications";
export { FindPartnersModal } from "./FindPartnersModal";
