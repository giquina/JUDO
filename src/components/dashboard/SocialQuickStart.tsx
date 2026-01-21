/**
 * Social Features Quick Start Examples
 *
 * Copy and paste these examples to quickly integrate social features
 * into your JUDO app.
 */

// ============================================================================
// EXAMPLE 1: Full Social Dashboard Page
// ============================================================================

import { SocialFeaturesDemo } from "@/components/dashboard/SocialFeaturesDemo";

export function SocialDashboardPage() {
  // Get current user from your auth system
  const currentUserId = "mem-001"; // Replace with: useAuth().userId

  return (
    <div className="min-h-screen bg-background">
      <SocialFeaturesDemo currentUserId={currentUserId} layout="tabbed" />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Embed Social Widgets in Main Dashboard
// ============================================================================

import { Bell, Users, Trophy, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  TrainingPartners,
  Leaderboard,
  CommunityFeed,
  SocialNotifications,
  FindPartnersModal,
} from "@/components/dashboard";

export function MainDashboardWithSocial() {
  const currentUserId = "mem-001";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Your existing dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... your stats cards ... */}
      </div>

      {/* Social Features Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Community</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-[500px]">
            <TrainingPartners currentUserId={currentUserId} />
          </div>
          <div className="h-[500px]">
            <Leaderboard currentUserId={currentUserId} />
          </div>
          <div className="lg:col-span-1 h-[500px]">
            <CommunityFeed currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Social Sidebar/Widget
// ============================================================================

// TODO: Sheet component not yet implemented
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Bell } from "lucide-react";
//
// export function SocialSidebar() {
//   const currentUserId = "mem-001";
//
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
//             3
//           </span>
//         </Button>
//       </SheetTrigger>
//       <SheetContent className="w-[400px] sm:w-[540px] p-0">
//         <div className="h-full">
//           <SocialNotifications currentUserId={currentUserId} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

// ============================================================================
// EXAMPLE 4: Training Partners Page
// ============================================================================

import { useState } from "react";

export function TrainingPartnersPage() {
  const currentUserId = "mem-001";
  const [findPartnersOpen, setFindPartnersOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Partners</h1>
          <p className="text-muted-foreground mt-1">
            Connect with compatible training partners
          </p>
        </div>
        <Button onClick={() => setFindPartnersOpen(true)}>
          Find New Partners
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-h-[600px]">
          <TrainingPartners currentUserId={currentUserId} />
        </div>
        <div className="min-h-[600px]">
          {/* You could add another component here, like recent training sessions */}
          <CommunityFeed currentUserId={currentUserId} />
        </div>
      </div>

      <FindPartnersModal
        open={findPartnersOpen}
        onOpenChange={setFindPartnersOpen}
        currentUserId={currentUserId}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Leaderboard Page
// ============================================================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaderboardPage() {
  const currentUserId = "mem-001";

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Leaderboards</h1>
        <p className="text-muted-foreground mt-1">
          See how you rank among your fellow judokas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[700px]">
          <Leaderboard currentUserId={currentUserId} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Rankings</CardTitle>
              <CardDescription>How the leaderboards work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Sessions</h4>
                <p className="text-muted-foreground">
                  Based on total sessions attended this month
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Streak</h4>
                <p className="text-muted-foreground">
                  Consecutive days with at least one training session
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Improved</h4>
                <p className="text-muted-foreground">
                  Increase in sessions compared to last month
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Wins</h4>
                <p className="text-muted-foreground">
                  Total competition victories
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Community Feed Page
// ============================================================================

export function CommunityPage() {
  const currentUserId = "mem-001";

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Community Feed</h1>
        <p className="text-muted-foreground mt-1">
          Stay connected with your judo club
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[800px]">
          <CommunityFeed currentUserId={currentUserId} />
        </div>

        <div className="space-y-6">
          <div className="min-h-[400px]">
            <SocialNotifications currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Navigation Integration
// ============================================================================

import { Home } from "lucide-react";

export const socialNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Training Partners",
    href: "/social/partners",
    icon: Users,
  },
  {
    name: "Leaderboard",
    href: "/social/leaderboard",
    icon: Trophy,
  },
  {
    name: "Community",
    href: "/social/community",
    icon: MessageCircle,
  },
];

// Use in your Navigation component:
// {socialNavigation.map((item) => (
//   <Link key={item.name} href={item.href}>
//     <item.icon className="h-5 w-5" />
//     {item.name}
//   </Link>
// ))}

// ============================================================================
// EXAMPLE 8: Mobile Bottom Navigation
// ============================================================================

export function MobileSocialNav() {
  const currentUserId = "mem-001";
  const [view, setView] = useState("partners");

  return (
    <div className="flex flex-col h-screen">
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {view === "partners" && <TrainingPartners currentUserId={currentUserId} />}
        {view === "leaderboard" && <Leaderboard currentUserId={currentUserId} />}
        {view === "feed" && <CommunityFeed currentUserId={currentUserId} />}
        {view === "notifications" && <SocialNotifications currentUserId={currentUserId} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t bg-background p-2 flex justify-around items-center">
        <button
          onClick={() => setView("partners")}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            view === "partners" ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">Partners</span>
        </button>
        <button
          onClick={() => setView("leaderboard")}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            view === "leaderboard" ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-xs">Ranks</span>
        </button>
        <button
          onClick={() => setView("feed")}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            view === "feed" ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Feed</span>
        </button>
        <button
          onClick={() => setView("notifications")}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative",
            view === "notifications" ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="text-xs">Alerts</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </nav>
    </div>
  );
}

// ============================================================================
// That's it! Choose the example that fits your needs and customize as needed.
// All components are fully typed and include proper error handling.
// ============================================================================
