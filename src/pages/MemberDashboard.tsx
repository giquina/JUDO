import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CheckInQR from "@/components/CheckInQR";

// Mock data - will be replaced with Convex queries
const mockMember = {
  name: "Alice Chen",
  email: "a.chen@bbk.ac.uk",
  beltRank: "blue",
  totalSessions: 47,
  subscriptionStatus: "active",
  subscriptionTier: "standard",
  joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
};

const mockUpcomingClasses = [
  { _id: "1", name: "Monday Evening Fundamentals", day: "Monday", time: "19:00", level: "beginner" },
  { _id: "2", name: "Wednesday Intermediate", day: "Wednesday", time: "19:00", level: "intermediate" },
  { _id: "3", name: "Friday Advanced", day: "Friday", time: "20:00", level: "advanced" },
];

const mockRecentAttendance = [
  { date: "2026-01-17", className: "Friday Advanced", status: "attended" },
  { date: "2026-01-15", className: "Wednesday Intermediate", status: "attended" },
  { date: "2026-01-13", className: "Monday Fundamentals", status: "attended" },
  { date: "2026-01-10", className: "Friday Advanced", status: "absent" },
  { date: "2026-01-08", className: "Wednesday Intermediate", status: "attended" },
];

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800 border-gray-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  orange: "bg-orange-100 text-orange-800 border-orange-300",
  green: "bg-green-100 text-green-800 border-green-300",
  blue: "bg-blue-600 text-white border-blue-700",
  brown: "bg-amber-800 text-white border-amber-900",
  black: "bg-gray-900 text-white border-gray-950",
};

export default function MemberDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckIn = async (classId: string) => {
    setIsCheckingIn(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Checking in to class:", classId);
    setCheckInStatus("success");
    setIsCheckingIn(false);
    setShowScanner(false);

    // Reset status after 3 seconds
    setTimeout(() => setCheckInStatus("idle"), 3000);
  };

  const sessionsThisMonth = 8;
  const maxSessions = mockMember.subscriptionTier === "student" ? 8 : 12;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {mockMember.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Ready for training?</p>
          </div>
          <Badge className={`${BELT_COLORS[mockMember.beltRank]} text-lg px-4 py-2`}>
            {mockMember.beltRank.charAt(0).toUpperCase() + mockMember.beltRank.slice(1)} Belt
          </Badge>
        </div>

        {/* Check-in Success Message */}
        {checkInStatus === "success" && (
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="py-4">
              <p className="text-green-800 dark:text-green-200 font-medium text-center text-lg">
                ✅ Successfully checked in! Enjoy your training!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Monday 7pm</p>
              <p className="text-sm text-muted-foreground">Fundamentals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sessions This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sessionsThisMonth}</p>
              <p className="text-sm text-muted-foreground">of {maxSessions} included</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(sessionsThisMonth / maxSessions) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockMember.totalSessions}</p>
              <p className="text-sm text-muted-foreground">lifetime</p>
            </CardContent>
          </Card>
        </div>

        {/* Check-in Section */}
        {showScanner ? (
          <CheckInQR onCheckIn={handleCheckIn} isLoading={isCheckingIn} />
        ) : (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="py-6">
              <Button
                onClick={() => setShowScanner(true)}
                size="lg"
                className="w-full text-lg py-6"
              >
                📱 Scan QR to Check In
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your weekly schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUpcomingClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.day} at {cls.time}
                    </p>
                  </div>
                  <Badge variant="secondary">{cls.level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your last 5 sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockRecentAttendance.map((record, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{record.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Badge variant={record.status === "attended" ? "default" : "destructive"}>
                    {record.status === "attended" ? "✓ Attended" : "✗ Missed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2">{mockMember.subscriptionTier.toUpperCase()}</Badge>
                <p className="text-sm text-muted-foreground">
                  Status: <span className="text-green-600 font-medium">Active</span>
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
