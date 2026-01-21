import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/lib/auth";
import { DollarSign, TrendingUp, Users, FileDown, AlertCircle } from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockMembers = [
  { _id: "1", name: "Alice Chen", email: "a.chen@bbk.ac.uk", subscriptionStatus: "active", subscriptionTier: "standard", amount: 4000, nextPayment: Date.now() + 15 * 24 * 60 * 60 * 1000 },
  { _id: "2", name: "Raj Patel", email: "r.patel@bbk.ac.uk", subscriptionStatus: "active", subscriptionTier: "student", amount: 2500, nextPayment: Date.now() + 20 * 24 * 60 * 60 * 1000 },
  { _id: "3", name: "Emma Williams", email: "e.williams@bbk.ac.uk", subscriptionStatus: "active", subscriptionTier: "student", amount: 2500, nextPayment: Date.now() + 10 * 24 * 60 * 60 * 1000 },
  { _id: "4", name: "James O'Brien", email: "j.obrien@bbk.ac.uk", subscriptionStatus: "inactive", subscriptionTier: "standard", amount: 4000, nextPayment: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { _id: "5", name: "Sofia Rodriguez", email: "s.rodriguez@bbk.ac.uk", subscriptionStatus: "active", subscriptionTier: "premium", amount: 6000, nextPayment: Date.now() + 25 * 24 * 60 * 60 * 1000 },
];

const mockRecentPayments = [
  { _id: "1", memberName: "Alice Chen", amount: 4000, date: Date.now() - 2 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "2", memberName: "Raj Patel", amount: 2500, date: Date.now() - 5 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "3", memberName: "Sofia Rodriguez", amount: 6000, date: Date.now() - 7 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "4", memberName: "George Thompson", amount: 1000, date: Date.now() - 8 * 24 * 60 * 60 * 1000, status: "completed", type: "session" },
  { _id: "5", memberName: "Emma Williams", amount: 2500, date: Date.now() - 10 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
];

export default function TreasurerDashboard() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"members" | "payments" | "reports">("members");

  // Check permissions
  if (!hasPermission("view_payments")) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Access Denied
                </CardTitle>
                <CardDescription>
                  You don't have permission to access this page.
                </CardDescription>
              </CardHeader>
            </Card>
          </main>
        </div>
      </PageTransition>
    );
  }

  const filteredMembers = mockMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = mockMembers
    .filter((m) => m.subscriptionStatus === "active")
    .reduce((sum, m) => sum + m.amount, 0);

  const activeMembers = mockMembers.filter((m) => m.subscriptionStatus === "active").length;
  const overduePayers = mockMembers.filter((m) => m.nextPayment < Date.now()).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6">
          <Breadcrumbs />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Treasurer Dashboard</h1>
              <p className="text-muted-foreground">Financial management and member subscriptions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert("Export feature coming soon!")}>
                <FileDown className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
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
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
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
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Avg Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">£{((totalRevenue / activeMembers) / 100).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">per member</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Overdue Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">{overduePayers}</p>
                <p className="text-xs text-muted-foreground">require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <Button
              variant={selectedTab === "members" ? "default" : "ghost"}
              onClick={() => setSelectedTab("members")}
            >
              Members & Subscriptions
            </Button>
            <Button
              variant={selectedTab === "payments" ? "default" : "ghost"}
              onClick={() => setSelectedTab("payments")}
            >
              Payment History
            </Button>
            <Button
              variant={selectedTab === "reports" ? "default" : "ghost"}
              onClick={() => setSelectedTab("reports")}
            >
              Financial Reports
            </Button>
          </div>

          {/* Members & Subscriptions Tab */}
          {selectedTab === "members" && (
            <Card>
              <CardHeader>
                <CardTitle>Member Subscriptions</CardTitle>
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
                        <th className="pb-3 font-medium">Member</th>
                        <th className="pb-3 font-medium">Subscription</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Next Payment</th>
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
                            <Badge variant="secondary">{member.subscriptionTier}</Badge>
                          </td>
                          <td className="py-3">
                            <Badge variant={member.subscriptionStatus === "active" ? "default" : "destructive"}>
                              {member.subscriptionStatus}
                            </Badge>
                          </td>
                          <td className="py-3 font-medium">
                            £{(member.amount / 100).toFixed(2)}
                          </td>
                          <td className="py-3 text-sm">
                            <span className={member.nextPayment < Date.now() ? "text-destructive font-medium" : "text-muted-foreground"}>
                              {new Date(member.nextPayment).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">Manage</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments Tab */}
          {selectedTab === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Recent transactions and payment records</CardDescription>
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
                          })} · {payment.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">£{(payment.amount / 100).toFixed(2)}</p>
                        <Badge variant="secondary">{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Tab */}
          {selectedTab === "reports" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Download financial reports and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Member Subscriptions (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Payment History (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileDown className="w-4 h-4 mr-2" />
                    Generate Monthly Report (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Tax Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Financial overview at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Members</span>
                    <span className="font-bold">{mockMembers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Subscriptions</span>
                    <span className="font-bold text-green-600">{activeMembers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Inactive Members</span>
                    <span className="font-bold text-orange-600">{mockMembers.length - activeMembers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Overdue Payments</span>
                    <span className="font-bold text-destructive">{overduePayers}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">Total Monthly Revenue</span>
                    <span className="font-bold text-lg">£{(totalRevenue / 100).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Note about permissions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Treasurer Role:</strong> You have access to all payment information, member subscriptions, and financial reports. 
                You cannot access QR check-in functionality or post announcements.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
}
