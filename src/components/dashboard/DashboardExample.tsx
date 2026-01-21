/**
 * DashboardExample.tsx
 *
 * Comprehensive example demonstrating all Quick Actions, Interactive Elements,
 * and Polish features for the JUDO app dashboard.
 *
 * This is a reference implementation showing how to integrate:
 * - Quick Actions Bar
 * - Dashboard Widgets
 * - Success Animations
 * - Confetti Celebrations
 * - Dashboard Customization
 * - Dashboard Tour
 * - Help Widget
 * - Keyboard Shortcuts
 * - Loading States
 */

import * as React from "react";
import { Settings, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Dashboard components
import { QuickActionsBar } from "./QuickActionsBar";
import {
  StreakWidget,
  GoalWidget,
  EventWidget,
  PartnerWidget,
  AchievementWidget,
  TipWidget,
  QuoteWidget,
  WeatherWidget,
} from "./widgets";
import { SuccessAnimation } from "./SuccessAnimation";
import { CustomizeDashboard, useDashboardPreferences } from "./CustomizeDashboard";
import { DashboardTour, useDashboardTour } from "./DashboardTour";
import { HelpWidget } from "./HelpWidget";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { useKeyboardShortcuts } from "@/components/KeyboardShortcuts";

// Confetti
import {
  celebrate,
  achievementConfetti,
  streakConfetti,
  goalConfetti,
  beltPromotionConfetti,
} from "@/lib/confetti";

export function DashboardExample() {
  // State
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = React.useState(false);
  const [animationType, setAnimationType] = React.useState<"checkmark" | "trophy" | "flame" | "belt">("checkmark");

  // Hooks
  const { preferences, updatePreferences } = useDashboardPreferences();
  const { showTour, completeTour, skipTour, startTour } = useDashboardTour();

  // Keyboard shortcuts
  useKeyboardShortcuts(undefined, {
    c: () => handleCheckIn(),
    b: () => handleBookClass(),
    s: () => handleViewSchedule(),
    g: () => handleGoals(),
    p: () => handleProfile(),
  });

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Action handlers
  const handleCheckIn = () => {
    toast.success("Checked in successfully!");
    celebrate();
    setAnimationType("checkmark");
    setShowSuccessAnimation(true);
  };

  const handleBookClass = () => {
    toast.success("Class booked!");
  };

  const handleViewSchedule = () => {
    toast.info("Opening schedule...");
  };

  const handleGoals = () => {
    toast.info("Opening goals...");
  };

  const handleProfile = () => {
    toast.info("Opening profile...");
  };

  const handleStreakClick = () => {
    streakConfetti(7);
    toast.success("7 day streak!");
  };

  const handleGoalClick = () => {
    goalConfetti();
    toast.success("Goal completed!");
  };

  const handleAchievementClick = () => {
    achievementConfetti();
    setAnimationType("trophy");
    setShowSuccessAnimation(true);
  };

  const handleBeltPromotion = () => {
    beltPromotionConfetti("yellow");
    toast.success("Belt promotion!");
  };

  // Quick actions configuration
  const quickActions = [
    {
      id: "check-in",
      label: "Check In",
      icon: <span>📱</span>,
      onClick: handleCheckIn,
      shortcut: "C",
      color: "text-blue-500",
    },
    {
      id: "book-class",
      label: "Book Class",
      icon: <span>📅</span>,
      onClick: handleBookClass,
      shortcut: "B",
      color: "text-green-500",
      active: false,
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <span>📋</span>,
      onClick: handleViewSchedule,
      shortcut: "S",
      color: "text-purple-500",
    },
    {
      id: "messages",
      label: "Messages",
      icon: <span>💬</span>,
      onClick: () => toast.info("Opening messages..."),
      badge: 3,
      color: "text-orange-500",
    },
    {
      id: "goals",
      label: "Goals",
      icon: <span>🎯</span>,
      onClick: handleGoals,
      shortcut: "G",
      color: "text-red-500",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <span>👤</span>,
      onClick: handleProfile,
      shortcut: "P",
      color: "text-indigo-500",
    },
  ];

  // Mock data
  const mockStreak = { currentStreak: 7, longestStreak: 14 };

  const mockGoal = {
    id: "1",
    title: "Train 3 times this week",
    description: "Build consistency",
    progress: 2,
    target: 3,
    unit: "sessions",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    color: "bg-blue-500/10 text-blue-500",
  };

  const mockEvent = {
    id: "1",
    title: "Advanced Techniques Seminar",
    description: "Learn advanced throwing techniques with Sensei Mike",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    location: "Main Dojo",
    attendees: 15,
    maxAttendees: 20,
    type: "seminar" as const,
    isRegistered: true,
  };

  const mockPartner = {
    id: "1",
    name: "Sarah Johnson",
    belt: "Blue Belt",
    beltColor: "blue",
    sessionsWithYou: 12,
    lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    specialty: "Ne-waza",
  };

  const mockAchievement = {
    id: "1",
    title: "First Month Complete",
    description: "Completed your first month of training",
    rarity: "rare" as const,
    unlockedAt: new Date(),
    points: 100,
  };

  const mockTip = {
    id: "1",
    title: "Perfect Your Breakfall",
    content:
      "Focus on keeping your chin tucked and slapping the mat with your entire arm, not just your hand. This distributes the impact and prevents injury.",
    category: "technique" as const,
    difficulty: "beginner" as const,
  };

  const mockQuote = {
    id: "1",
    text: "The ultimate aim of karate lies not in victory nor defeat, but in the perfection of the character of its participants.",
    author: "Gichin Funakoshi",
    category: "Philosophy",
  };

  const mockWeather = {
    temperature: 22,
    condition: "sunny" as const,
    humidity: 45,
    windSpeed: 12,
    location: "London",
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const visibleSections = preferences.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Actions Bar */}
      <QuickActionsBar actions={quickActions} sticky />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your training overview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoading(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomize(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
        </div>

        {/* Widgets Grid */}
        <div
          className={cn(
            "grid gap-6",
            preferences.layout === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1",
            preferences.density === "compact" && "gap-4",
            preferences.density === "spacious" && "gap-8"
          )}
        >
          {visibleSections.map((section) => {
            switch (section.id) {
              case "streak":
                return (
                  <StreakWidget
                    key={section.id}
                    {...mockStreak}
                    onClick={handleStreakClick}
                    data-tour="streak"
                  />
                );
              case "goals":
                return (
                  <GoalWidget
                    key={section.id}
                    goal={mockGoal}
                    onClick={handleGoalClick}
                    data-tour="goals"
                  />
                );
              case "events":
                return (
                  <EventWidget key={section.id} event={mockEvent} />
                );
              case "partners":
                return (
                  <PartnerWidget key={section.id} partner={mockPartner} />
                );
              case "achievements":
                return (
                  <AchievementWidget
                    key={section.id}
                    achievement={mockAchievement}
                    onClick={handleAchievementClick}
                  />
                );
              case "tips":
                return <TipWidget key={section.id} tip={mockTip} />;
              case "quotes":
                return <QuoteWidget key={section.id} quote={mockQuote} />;
              case "weather":
                return <WeatherWidget key={section.id} weather={mockWeather} />;
              default:
                return null;
            }
          })}
        </div>

        {/* Demo Actions */}
        <div className="mt-8 p-6 border rounded-xl bg-muted/30">
          <h3 className="text-lg font-semibold mb-4">Demo Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleBeltPromotion} variant="outline" size="sm">
              🥋 Belt Promotion Confetti
            </Button>
            <Button onClick={() => celebrate()} variant="outline" size="sm">
              🎉 Basic Confetti
            </Button>
            <Button onClick={startTour} variant="outline" size="sm">
              🎯 Restart Tour
            </Button>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <CustomizeDashboard
        open={showCustomize}
        onOpenChange={setShowCustomize}
        preferences={preferences}
        onSave={updatePreferences}
      />

      <DashboardTour
        steps={[]}
        open={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      <SuccessAnimation
        type={animationType}
        show={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
        message="Success!"
      />

      <HelpWidget
        onStartTour={startTour}
        onContactSupport={() => toast.info("Opening support chat...")}
      />
    </div>
  );
}

export default DashboardExample;
