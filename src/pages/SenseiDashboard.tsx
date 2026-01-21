import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Calendar from "@/components/Calendar";
import ClassManagementModal from "@/components/ClassManagementModal";
import PageTransition from "@/components/PageTransition";
import { Users, Calendar as CalendarIcon, TrendingUp, Award, MessageSquare, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - will be replaced with Convex queries
const mockAttendance = [
  { memberId: "1", name: "Alice Chen", beltRank: "blue", status: "attended", checkInTime: Date.now() - 3600000 },
  { memberId: "2", name: "Raj Patel", beltRank: "white", status: "attended", checkInTime: Date.now() - 3500000 },
  { memberId: "3", name: "Emma Williams", beltRank: "yellow", status: "absent", checkInTime: null },
  { memberId: "4", name: "James O'Brien", beltRank: "orange", status: "attended", checkInTime: Date.now() - 3400000 },
  { memberId: "5", name: "Sofia Rodriguez", beltRank: "green", status: "absent", checkInTime: null },
];

const mockJudoka = [
  { _id: "1", name: "Alice Chen", beltRank: "blue", kyu: 3, sessionsTotal: 47, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { _id: "2", name: "Raj Patel", beltRank: "white", kyu: 6, sessionsTotal: 8, lastAttended: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { _id: "3", name: "Emma Williams", beltRank: "yellow", kyu: 5, sessionsTotal: 15, lastAttended: Date.now() - 7 * 24 * 60 * 60 * 1000 },
  { _id: "4", name: "James O'Brien", beltRank: "orange", kyu: 4, sessionsTotal: 32, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000 },
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

export default function SenseiDashboard() {
  const [attendance, setAttendance] = useState(mockAttendance);
  const [showClassModal, setShowClassModal] = useState(false);
  const [classModalMode, setClassModalMode] = useState<"create" | "edit">("create");

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

  const handleAddClass = (_date: Date) => {
    setClassModalMode("create");
    setShowClassModal(true);
  };

  const handleEditClass = (_classId: string) => {
    setClassModalMode("edit");
    setShowClassModal(true);
  };

  const handleSaveClass = (classData: unknown) => {
    console.log("Saving class:", classData);
    // Will be replaced with Convex mutation
  };

  const handleDeleteClass = () => {
    console.log("Deleting class");
    // Will be replaced with Convex mutation
  };

  const attendedCount = attendance.filter(a => a.status === "attended").length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-3">Sensei Dashboard</h1>
              <p className="text-muted-foreground">Manage your dojo and track Judoka progress</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="elevation-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Monday Evening</p>
              </CardContent>
            </Card>

            <Card className="elevation-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Checked In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{attendedCount}/{attendance.length}</p>
                <p className="text-sm text-muted-foreground">Judoka present</p>
              </CardContent>
            </Card>

            <Card className="elevation-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Active Judoka
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockJudoka.length}</p>
                <p className="text-sm text-muted-foreground">Training regularly</p>
              </CardContent>
            </Card>

            <Card className="elevation-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Belt Gradings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Ready for testing</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="attendance">Today's Attendance</TabsTrigger>
              <TabsTrigger value="judoka">Judoka Progress</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Calendar
                onAddClass={handleAddClass}
                onEditClass={handleEditClass}
                canManage={true}
              />
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-4">
              <Card className="elevation-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Today's Attendance</span>
                    <Badge>{attendedCount} present</Badge>
                  </CardTitle>
                  <CardDescription>
                    Tap a Judoka to toggle their attendance status
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
            </TabsContent>

            {/* Judoka Progress Tab */}
            <TabsContent value="judoka" className="space-y-4">
              <Card className="elevation-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Judoka Progress</CardTitle>
                      <CardDescription>Track belt progressions and training milestones</CardDescription>
                    </div>
                    <Button variant="outline">
                      <Award className="h-4 w-4 mr-2" />
                      Grade Belt
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockJudoka.map((judoka) => (
                      <div
                        key={judoka._id}
                        className="p-4 rounded-lg border bg-card hover:elevation-2 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{judoka.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {judoka.sessionsTotal} sessions • Last trained {Math.floor((Date.now() - judoka.lastAttended) / (1000 * 60 * 60 * 24))}d ago
                            </p>
                          </div>
                          <Badge className={BELT_COLORS[judoka.beltRank]}>
                            {judoka.beltRank} belt ({judoka.kyu} Kyu)
                          </Badge>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress to next belt</span>
                            <span className="font-medium">{judoka.sessionsTotal % 20}/20 sessions</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${((judoka.sessionsTotal % 20) / 20) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="space-y-4">
              <Card className="elevation-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Communications</CardTitle>
                      <CardDescription>Send announcements and messages to your Judoka</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="body-small">No announcements yet</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Send updates about class changes, events, or important information
                    </p>
                    <Button variant="outline" className="mt-4">
                      Create Your First Announcement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Class Management Modal */}
      <ClassManagementModal
        open={showClassModal}
        onOpenChange={setShowClassModal}
        mode={classModalMode}
        onSave={handleSaveClass}
        onDelete={handleDeleteClass}
      />
    </PageTransition>
  );
}
