import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

export default function MemberDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Welcome back!</h1>

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
                Belt Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-blue-600 text-white">Blue Belt</Badge>
              <p className="text-sm text-muted-foreground mt-1">2nd Kyu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sessions This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">of 12 available</p>
            </CardContent>
          </Card>
        </div>

        {/* Check-in Button */}
        <Card>
          <CardContent className="pt-6">
            <Button size="lg" className="w-full text-lg py-6">
              Check In to Class
            </Button>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Loading attendance history...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
