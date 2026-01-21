import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/lib/auth";
import { MessageSquare, Calendar, Image, AlertCircle, Plus } from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockAnnouncements = [
  { _id: "1", title: "BUCS Competition This Saturday", content: "Don't forget our BUCS competition this Saturday at 10am...", priority: "high", published: true, createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { _id: "2", title: "New Training Schedule", content: "Starting next month, we'll have an additional beginner class...", priority: "normal", published: true, createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { _id: "3", title: "Social Event - End of Term", content: "Join us for our end of term social at The Crown...", priority: "normal", published: false, createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000 },
];

const mockEvents = [
  { _id: "1", title: "BUCS Regional Competition", type: "competition", date: Date.now() + 5 * 24 * 60 * 60 * 1000, participants: 12, status: "published" },
  { _id: "2", title: "Grading Ceremony", type: "grading", date: Date.now() + 15 * 24 * 60 * 60 * 1000, participants: 8, status: "published" },
  { _id: "3", title: "End of Term Social", type: "social", date: Date.now() + 20 * 24 * 60 * 60 * 1000, participants: 0, status: "draft" },
  { _id: "4", title: "Guest Seminar - Olympic Coach", type: "seminar", date: Date.now() + 30 * 24 * 60 * 60 * 1000, participants: 5, status: "published" },
];

const mockMedia = [
  { _id: "1", title: "Competition Finals 2024", type: "image", uploadedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, views: 156 },
  { _id: "2", title: "Training Highlights", type: "video", uploadedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, views: 234 },
  { _id: "3", title: "Team Photo 2024", type: "image", uploadedAt: Date.now() - 20 * 24 * 60 * 60 * 1000, views: 412 },
];

export default function ContentManagerDashboard() {
  const { hasPermission } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"announcements" | "events" | "media">("announcements");
  const [showNewAnnouncementForm, setShowNewAnnouncementForm] = useState(false);

  // Check permissions
  if (!hasPermission("post_announcements")) {
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Content Manager Dashboard</h1>
              <p className="text-muted-foreground">Manage announcements, events, and media</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockAnnouncements.length}</p>
                <p className="text-xs text-muted-foreground">{mockAnnouncements.filter(a => a.published).length} published</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockEvents.length}</p>
                <p className="text-xs text-muted-foreground">{mockEvents.filter(e => e.status === "published").length} published</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Media Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockMedia.length}</p>
                <p className="text-xs text-muted-foreground">gallery items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Event Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockEvents.reduce((sum, e) => sum + e.participants, 0)}</p>
                <p className="text-xs text-muted-foreground">total registrations</p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <Button
              variant={selectedTab === "announcements" ? "default" : "ghost"}
              onClick={() => setSelectedTab("announcements")}
            >
              Announcements
            </Button>
            <Button
              variant={selectedTab === "events" ? "default" : "ghost"}
              onClick={() => setSelectedTab("events")}
            >
              Events
            </Button>
            <Button
              variant={selectedTab === "media" ? "default" : "ghost"}
              onClick={() => setSelectedTab("media")}
            >
              Media Gallery
            </Button>
          </div>

          {/* Announcements Tab */}
          {selectedTab === "announcements" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Club Announcements</h2>
                <Button onClick={() => setShowNewAnnouncementForm(!showNewAnnouncementForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </div>

              {showNewAnnouncementForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Announcement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input placeholder="Announcement title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content</label>
                      <Textarea placeholder="Announcement content" rows={4} />
                    </div>
                    <div className="flex gap-2">
                      <Button>Publish</Button>
                      <Button variant="outline">Save as Draft</Button>
                      <Button variant="ghost" onClick={() => setShowNewAnnouncementForm(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {mockAnnouncements.map((announcement) => (
                  <Card key={announcement._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <CardDescription>
                            {new Date(announcement.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={announcement.published ? "default" : "secondary"}>
                            {announcement.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant={announcement.priority === "high" ? "destructive" : "outline"}>
                            {announcement.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {selectedTab === "events" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Club Events</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {mockEvents.map((event) => (
                  <Card key={event._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>
                            {new Date(event.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <Badge variant={event.status === "published" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{event.participants}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Media Tab */}
          {selectedTab === "media" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Media Gallery</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Media
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {mockMedia.map((media) => (
                  <Card key={media._id}>
                    <CardHeader>
                      <CardTitle className="text-base">{media.title}</CardTitle>
                      <CardDescription>
                        {new Date(media.uploadedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="outline">{media.type}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Views:</span>
                          <span className="font-medium">{media.views}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Note about permissions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Content Manager Role:</strong> You can create/edit announcements, manage events (BUCS competitions, socials), 
                and upload to the media gallery. You cannot view payment information or access QR check-in functionality.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
}
