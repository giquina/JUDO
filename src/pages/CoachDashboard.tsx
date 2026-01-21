import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PageTransition from "@/components/PageTransition";
import { DemoBanner } from "@/components/DemoBanner";

// Mock data - will be replaced with Convex queries
const mockClasses = [
  {
    _id: "class-1",
    name: "Monday Evening Fundamentals",
    dayOfWeek: "Monday",
    startTime: "19:00",
    endTime: "20:30",
    level: "beginner",
    maxCapacity: 25,
    location: "Central YMCA, Studio A",
  },
  {
    _id: "class-2",
    name: "Wednesday Intermediate",
    dayOfWeek: "Wednesday",
    startTime: "19:00",
    endTime: "20:30",
    level: "intermediate",
    maxCapacity: 20,
    location: "Central YMCA, Studio A",
  },
  {
    _id: "class-3",
    name: "Friday Advanced",
    dayOfWeek: "Friday",
    startTime: "20:00",
    endTime: "21:30",
    level: "advanced",
    maxCapacity: 15,
    location: "Central YMCA, Studio B",
  },
];

const mockAttendance = [
  { memberId: "1", name: "Alice Chen", beltRank: "blue", status: "attended", checkInTime: Date.now() - 3600000 },
  { memberId: "2", name: "Raj Patel", beltRank: "white", status: "attended", checkInTime: Date.now() - 3500000 },
  { memberId: "3", name: "Emma Williams", beltRank: "yellow", status: "absent", checkInTime: null },
  { memberId: "4", name: "James O'Brien", beltRank: "orange", status: "attended", checkInTime: Date.now() - 3400000 },
  { memberId: "5", name: "Sofia Rodriguez", beltRank: "green", status: "absent", checkInTime: null },
];

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white",
};

export default function CoachDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [attendance, setAttendance] = useState(mockAttendance);

  const todayClass = mockClasses[0]; // For demo, show first class
  const currentClass = mockClasses.find(c => c._id === selectedClass);

  const toggleAttendance = (memberId: string) => {
    setAttendance(prev => prev.map(a => {
      if (a.memberId === memberId) {
        const newStatus = a.status === "attended" ? "absent" : "attended";
        return {
          ...a,
          status: newStatus,
          checkInTime: newStatus === "attended" ? Date.now() : null,
        };
      }
      return a;
    }));
  };

  const attendedCount = attendance.filter(a => a.status === "attended").length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <DemoBanner />
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Coach Dashboard</h1>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Monday Evening</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{attendedCount}/{attendance.length}</p>
              <p className="text-sm text-muted-foreground">members present</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Class Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{attendedCount}/{todayClass.maxCapacity}</p>
              <p className="text-sm text-muted-foreground">spots filled</p>
            </CardContent>
          </Card>
        </div>

        {/* Class Selection & QR Code */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Class</CardTitle>
              <CardDescription>Select a class to manage attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockClasses.map((cls) => (
                <div
                  key={cls._id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedClass === cls._id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedClass(cls._id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cls.dayOfWeek} • {cls.startTime} - {cls.endTime}
                      </p>
                    </div>
                    <Badge variant="secondary">{cls.level}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedClass && currentClass && (
            <div className="space-y-4">
              <QRCodeGenerator
                classId={selectedClass}
                className={currentClass.name}
              />
              <Button
                onClick={() => setShowQR(!showQR)}
                className="w-full"
                size="lg"
              >
                {showQR ? "Hide QR Code" : "Display QR for Class"}
              </Button>
            </div>
          )}
        </div>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Attendance</span>
              <Badge>{attendedCount} present</Badge>
            </CardTitle>
            <CardDescription>
              Tap a member to toggle their attendance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attendance.map((member) => (
                <div
                  key={member.memberId}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    member.status === "attended"
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                  }`}
                  onClick={() => toggleAttendance(member.memberId)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === "attended" ? "bg-green-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <Badge className={BELT_COLORS[member.beltRank]} variant="secondary">
                        {member.beltRank} belt
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={member.status === "attended" ? "default" : "destructive"}>
                      {member.status === "attended" ? "✓ Present" : "✗ Absent"}
                    </Badge>
                    {member.checkInTime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(member.checkInTime).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            Export Attendance
          </Button>
          <Button className="flex-1">
            Save & Close Class
          </Button>
        </div>
      </main>
      </div>
    </PageTransition>
  );
}
