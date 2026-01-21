import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BeltBadge from "@/components/BeltBadge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MessageCircle,
  UserPlus,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  Award,
  Clock,
  Flame,
} from "lucide-react";
import {
  getMemberById,
  getTrainingPartnersForMember,
  mockCommunityPosts,
} from "@/lib/mockSocialData";
import { toast } from "sonner";

interface MemberProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  currentUserId: string;
}

export function MemberProfileModal({
  open,
  onOpenChange,
  memberId,
  currentUserId,
}: MemberProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const member = getMemberById(memberId);
  const currentUserPartners = getTrainingPartnersForMember(currentUserId);
  const isPartner = currentUserPartners.some((tp) => tp.partnerId === memberId);
  const memberPosts = mockCommunityPosts.filter((p) => p.authorId === memberId);

  if (!member) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleMessage = () => {
    toast.success(`Opening chat with ${member.name}...`);
    // TODO: Navigate to chat
  };

  const handleAddPartner = () => {
    toast.success(`Training partner request sent to ${member.name}!`);
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const joinDateStr = new Date(member.joinDate).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        {/* Header Section */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5" />
          <div className="absolute -bottom-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-2xl font-bold">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <DialogHeader className="px-6 pt-14 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{member.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <BeltBadge rank={member.beltRank} />
                {member.publicProfile && (
                  <Badge variant="secondary" className="text-xs">
                    Public Profile
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleMessage} className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              {!isPartner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddPartner}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Partner
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 max-h-[50vh]">
            <div className="px-6 py-4">
              <TabsContent value="overview" className="mt-0 space-y-4">
                {member.bio && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm mb-3">Training Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.trainingFocus.map((focus) => (
                      <Badge key={focus} variant="secondary" className="capitalize">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>

                {member.favoriteTechniques.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3">
                      Favorite Techniques
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.favoriteTechniques.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm mb-3">Availability</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {member.availability.days.join(", ")} •{" "}
                      {member.availability.preferredTime}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-semibold">{joinDateStr}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                    <p className="text-sm font-semibold">{member.totalSessions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {member.currentStreak} days
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Longest Streak</p>
                    <p className="text-sm font-semibold">{member.longestStreak} days</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span className="text-xs">This Month</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {member.stats.thisMonthSessions}
                    </p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Last Month</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {member.stats.lastMonthSessions}
                    </p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span className="text-xs">Competitions</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {member.stats.totalCompetitions}
                    </p>
                    <p className="text-xs text-muted-foreground">Entered</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span className="text-xs">Wins</span>
                    </div>
                    <p className="text-2xl font-bold">{member.stats.totalWins}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.stats.totalCompetitions > 0
                        ? `${Math.round(
                            (member.stats.totalWins / member.stats.totalCompetitions) *
                              100
                          )}% win rate`
                        : "No competitions yet"}
                    </p>
                  </motion.div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3">Progress</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">
                          Monthly Sessions
                        </span>
                        <span className="font-semibold">
                          {member.stats.thisMonthSessions} / 20
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (member.stats.thisMonthSessions / 20) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">
                          Current Streak
                        </span>
                        <span className="font-semibold">
                          {member.currentStreak} / {member.longestStreak} days
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all"
                          style={{
                            width: `${
                              (member.currentStreak / member.longestStreak) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0 space-y-4">
                {memberPosts.length > 0 ? (
                  <div className="space-y-3">
                    {memberPosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border bg-card space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs capitalize">
                            {post.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(post.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        {post.imageUrl && (
                          <div className="rounded-md overflow-hidden border">
                            <img
                              src={post.imageUrl}
                              alt="Post"
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.likes.length} likes</span>
                          <span>{post.comments.length} comments</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <Separator />

        <div className="px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
