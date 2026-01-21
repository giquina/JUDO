import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import { DemoBanner } from "@/components/DemoBanner";

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
        <DemoBanner />
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button>+ Add Member</Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Members
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
              <p className="text-xs text-muted-foreground">{Math.round((activeMembers / mockMembers.length) * 100)}% of members</p>
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
              <CardTitle>Members</CardTitle>
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
              {/* Empty State */}
              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="heading-5 mb-2">No members found</h3>
                  <p className="body-small text-muted-foreground mb-4">
                    {searchQuery ? "Try a different search term" : "Add your first member to get started"}
                  </p>
                  {!searchQuery && (
                    <Button>+ Add Member</Button>
                  )}
                </div>
              )}

              {/* Mobile Card Layout */}
              {filteredMembers.length > 0 && (
                <div className="md:hidden space-y-4">
                  {filteredMembers.map((member) => (
                    <Card key={member._id} className="elevation-2">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base truncate">{member.name}</h4>
                              <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                            </div>
                            <Badge className={BELT_COLORS[member.beltRank]} style={{ marginLeft: '0.5rem' }}>
                              {member.beltRank}
                            </Badge>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="caption text-muted-foreground mb-1">Subscription</p>
                              <Badge variant={member.subscriptionStatus === "active" ? "default" : "destructive"}>
                                {member.subscriptionTier}
                              </Badge>
                            </div>
                            <div>
                              <p className="caption text-muted-foreground mb-1">Sessions</p>
                              <p className="font-semibold">{member.totalSessions}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="caption text-muted-foreground mb-1">Last Attended</p>
                              <p className="text-sm">
                                {new Date(member.lastAttended).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Desktop Table Layout */}
              {filteredMembers.length > 0 && (
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Belt</th>
                        <th className="pb-3 font-medium">Subscription</th>
                        <th className="pb-3 font-medium">Sessions</th>
                        <th className="pb-3 font-medium">Last Attended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member._id} className="border-b hover:bg-muted/50 transition-colors">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
              {mockRecentPayments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="heading-5 mb-2">No payments yet</h3>
                  <p className="body-small text-muted-foreground">
                    Payment history will appear here once members start subscribing
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockRecentPayments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
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
              )}
            </CardContent>
          </Card>
        )}

        {/* Export Actions */}
        <div className="flex gap-4">
          <Button variant="outline">Export Members CSV</Button>
          <Button variant="outline">Export Payments CSV</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </main>
      </div>
    </PageTransition>
  );
}
