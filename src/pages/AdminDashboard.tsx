import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";

// Mock data - will be replaced with Convex queries
const mockMembers = [
  { _id: "1", name: "Alice Chen", email: "a.chen@bbk.ac.uk", beltRank: "blue", subscriptionStatus: "active", subscriptionTier: "standard", totalSessions: 47, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { _id: "2", name: "Raj Patel", email: "r.patel@bbk.ac.uk", beltRank: "white", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 8, lastAttended: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { _id: "3", name: "Emma Williams", email: "e.williams@bbk.ac.uk", beltRank: "yellow", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 15, lastAttended: Date.now() - 7 * 24 * 60 * 60 * 1000 },
  { _id: "4", name: "James O'Brien", email: "j.obrien@bbk.ac.uk", beltRank: "orange", subscriptionStatus: "active", subscriptionTier: "standard", totalSessions: 32, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000 },
  { _id: "5", name: "Sofia Rodriguez", email: "s.rodriguez@bbk.ac.uk", beltRank: "green", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 89, lastAttended: Date.now() - 3 * 24 * 60 * 60 * 1000 },
  { _id: "6", name: "Mohammed Hassan", email: "m.hassan@bbk.ac.uk", beltRank: "brown", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 156, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { _id: "7", name: "Lucy Taylor", email: "l.taylor@bbk.ac.uk", beltRank: "white", subscriptionStatus: "inactive", subscriptionTier: "student", totalSessions: 3, lastAttended: Date.now() - 30 * 24 * 60 * 60 * 1000 },
  { _id: "8", name: "Yuki Tanaka", email: "y.tanaka@bbk.ac.uk", beltRank: "black", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 312, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000 },
];

const mockRecentPayments = [
  { _id: "1", memberName: "Alice Chen", amount: 4000, date: Date.now() - 2 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "2", memberName: "Raj Patel", amount: 2500, date: Date.now() - 5 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "3", memberName: "Sofia Rodriguez", amount: 6000, date: Date.now() - 7 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "4", memberName: "George Thompson", amount: 1000, date: Date.now() - 8 * 24 * 60 * 60 * 1000, status: "completed", type: "session" },
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

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"members" | "payments">("members");

  const filteredMembers = mockMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = mockMembers
    .filter((m) => m.subscriptionStatus === "active")
    .reduce((sum, m) => {
      const prices: Record<string, number> = { student: 2500, standard: 4000, premium: 6000 };
      return sum + (prices[m.subscriptionTier] || 0);
    }, 0);

  const activeMembers = mockMembers.filter((m) => m.subscriptionStatus === "active").length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button>+ Add Judoka</Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Judoka
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockMembers.length}</p>
              <p className="text-xs text-green-600">+3 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeMembers}</p>
              <p className="text-xs text-muted-foreground">{Math.round((activeMembers / mockMembers.length) * 100)}% of Judoka</p>
            </CardContent>

          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">£{(totalRevenue / 100).toFixed(0)}</p>
              <p className="text-xs text-green-600">+12% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18/class</p>
              <p className="text-xs text-muted-foreground">72% capacity</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          <Button
            variant={selectedTab === "members" ? "default" : "ghost"}
            onClick={() => setSelectedTab("members")}
          >
            Members
          </Button>
          <Button
            variant={selectedTab === "payments" ? "default" : "ghost"}
            onClick={() => setSelectedTab("payments")}
          >
            Payments
          </Button>
        </div>

        {selectedTab === "members" && (
          <Card>
            <CardHeader>
              <CardTitle>Judoka</CardTitle>
              <CardDescription>
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm mt-2"
                />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Belt</th>
                      <th className="pb-3 font-medium">Subscription</th>
                      <th className="pb-3 font-medium">Sessions</th>
                      <th className="pb-3 font-medium">Last Attended</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member._id} className="border-b">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className={BELT_COLORS[member.beltRank]}>
                            {member.beltRank}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge variant={member.subscriptionStatus === "active" ? "default" : "destructive"}>
                            {member.subscriptionTier}
                          </Badge>
                        </td>
                        <td className="py-3">{member.totalSessions}</td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {new Date(member.lastAttended).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{payment.memberName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">£{(payment.amount / 100).toFixed(2)}</p>
                      <Badge variant="secondary">{payment.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Actions */}
        <div className="flex gap-4">
          <Button variant="outline">Export Judoka CSV</Button>
          <Button variant="outline">Export Payments CSV</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </main>
      </div>
    </PageTransition>
  );
}
