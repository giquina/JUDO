import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BarChart3, BookOpen, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageTransition from "@/components/PageTransition";
import { BeltProgression } from "@/components/dashboard/BeltProgression";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { TrainingLog } from "@/components/dashboard/TrainingLog";
import { StatsOverview } from "@/components/dashboard/StatsOverview";

export default function ProgressAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("belt");
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6 pb-20">
          <Breadcrumbs />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Progress Analytics
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track your judo journey with comprehensive insights and analytics
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1">
              <TabsTrigger value="belt" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Belt Progression
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="log" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Training Log
              </TabsTrigger>
            </TabsList>

            {/* Belt Progression Tab */}
            <TabsContent value="belt">
              <BeltProgression />
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats">
              <StatsOverview />
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts">
              <ProgressCharts />
            </TabsContent>

            {/* Training Log Tab */}
            <TabsContent value="log">
              <TrainingLog />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PageTransition>
  );
}
