import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageTransition from "@/components/PageTransition";
import {
  Calendar,
  LayoutGrid,
  Search,
  Lightbulb,
  Brain,
} from "lucide-react";

// Import new dashboard components
import CalendarView from "@/components/dashboard/CalendarView";
import WeeklySchedule from "@/components/dashboard/WeeklySchedule";
import ClassSearch from "@/components/dashboard/ClassSearch";
import Recommendations from "@/components/dashboard/Recommendations";
import SmartInsights from "@/components/dashboard/SmartInsights";

export default function CalendarDemo() {
  const [activeTab, setActiveTab] = useState("calendar");

  const breadcrumbItems = [
    { label: "Dashboard", path: "/member" },
    { label: "Calendar & Classes", path: "/calendar" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-6 space-y-6">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Calendar & Classes</h1>
              <p className="text-muted-foreground">
                Manage your schedule, book classes, and get personalized recommendations
              </p>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="gap-2">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">For You</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* Calendar View */}
            <TabsContent value="calendar" className="space-y-6">
              <CalendarView />
            </TabsContent>

            {/* Weekly Schedule */}
            <TabsContent value="schedule" className="space-y-6">
              <WeeklySchedule />
            </TabsContent>

            {/* Class Search */}
            <TabsContent value="search" className="space-y-6">
              <ClassSearch />
            </TabsContent>

            {/* Recommendations */}
            <TabsContent value="recommendations" className="space-y-6">
              <Recommendations />
            </TabsContent>

            {/* Smart Insights */}
            <TabsContent value="insights" className="space-y-6">
              <SmartInsights />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
