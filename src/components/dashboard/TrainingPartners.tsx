import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BeltBadge from "@/components/BeltBadge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  User,
  TrendingUp,
  Users,
  Calendar,
  Award,
} from "lucide-react";
import { getTrainingPartnersForMember, mockSocialMembers } from "@/lib/mockSocialData";
import { cn } from "@/lib/utils";
import { FindPartnersModal } from "./FindPartnersModal";
import { MemberProfileModal } from "./MemberProfileModal";

interface TrainingPartnersProps {
  currentUserId?: string;
  className?: string;
}

export function TrainingPartners({
  currentUserId = "mem-001",
  className,
}: TrainingPartnersProps) {
  const [findPartnersOpen, setFindPartnersOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const trainingPartners = getTrainingPartnersForMember(currentUserId);
  const topPartners = trainingPartners.slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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

  const handleViewProfile = (partnerId: string) => {
    setSelectedMemberId(partnerId);
  };

  const handleMessage = (partnerId: string) => {
    // Navigate to chat with this partner
    console.log("Opening chat with:", partnerId);
    // TODO: Integrate with chat system
  };

  return (
    <>
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Training Partners</CardTitle>
              <CardDescription>
                Your frequent training companions
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setFindPartnersOpen(true)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Find Partners
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 pt-6 pb-4 px-0">
          <ScrollArea className="h-full px-6">
            {topPartners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any training partners yet
                </p>
                <Button onClick={() => setFindPartnersOpen(true)} variant="outline">
                  Find Training Partners
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {topPartners.map((tp, index) => (
                  <motion.div
                    key={tp._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <Avatar className="h-12 w-12 border-2 border-background">
                        <AvatarImage src={tp.partner.avatar} alt={tp.partner.name} />
                        <AvatarFallback className="text-sm font-semibold">
                          {getInitials(tp.partner.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm truncate">
                              {tp.partner.name}
                            </h4>
                            <BeltBadge
                              rank={tp.partner.beltRank}
                              showTooltip={false}
                              className="mt-1 text-xs"
                            />
                          </div>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {tp.matchScore}% match
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{tp.timesTrainedTogether} sessions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{getRelativeTime(tp.lastTrainedTogether)}</span>
                          </div>
                        </div>

                        {tp.mutualTechniques.length > 0 && (
                          <div className="flex items-start gap-1 text-xs">
                            <Award className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {tp.mutualTechniques.map((tech, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs px-1.5 py-0"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 flex-1"
                            onClick={() => handleMessage(tp.partnerId)}
                          >
                            <MessageCircle className="h-3 w-3" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs gap-1 flex-1"
                            onClick={() => handleViewProfile(tp.partnerId)}
                          >
                            <User className="h-3 w-3" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {trainingPartners.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setFindPartnersOpen(true)}
                  >
                    View all {trainingPartners.length} partners
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <Separator />

        <div className="px-6 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {topPartners.length} of {mockSocialMembers.length} members
            </span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setFindPartnersOpen(true)}
            >
              Explore all members
            </Button>
          </div>
        </div>
      </Card>

      <FindPartnersModal
        open={findPartnersOpen}
        onOpenChange={setFindPartnersOpen}
        currentUserId={currentUserId}
      />

      {selectedMemberId && (
        <MemberProfileModal
          open={!!selectedMemberId}
          onOpenChange={(open) => !open && setSelectedMemberId(null)}
          memberId={selectedMemberId}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}
