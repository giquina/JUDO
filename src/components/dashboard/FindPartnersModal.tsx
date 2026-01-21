import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BeltBadge from "@/components/BeltBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserPlus,
  Calendar,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockSocialMembers, type SocialMember } from "@/lib/mockSocialData";
import type { BeltRank } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FindPartnersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export function FindPartnersModal({
  open,
  onOpenChange,
  currentUserId,
}: FindPartnersModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [beltFilter, setBeltFilter] = useState<BeltRank | "all">("all");
  const [focusFilters, setFocusFilters] = useState<Set<string>>(new Set());

  const currentUser = mockSocialMembers.find((m) => m._id === currentUserId);
  const otherMembers = mockSocialMembers.filter((m) => m._id !== currentUserId);

  const toggleFocusFilter = (focus: string) => {
    setFocusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(focus)) {
        next.delete(focus);
      } else {
        next.add(focus);
      }
      return next;
    });
  };

  const calculateMatchScore = (member: SocialMember): number => {
    if (!currentUser) return 50;

    let score = 50; // Base score

    // Belt rank similarity (closer belts = higher score)
    const beltRanks: BeltRank[] = ["white", "yellow", "orange", "green", "blue", "brown", "black"];
    const currentBeltIndex = beltRanks.indexOf(currentUser.beltRank);
    const memberBeltIndex = beltRanks.indexOf(member.beltRank);
    const beltDiff = Math.abs(currentBeltIndex - memberBeltIndex);
    score += Math.max(0, 20 - beltDiff * 5);

    // Training focus overlap
    const focusOverlap = member.trainingFocus.filter((f) =>
      currentUser.trainingFocus.includes(f)
    ).length;
    score += focusOverlap * 10;

    // Schedule overlap
    const scheduleOverlap = member.availability.days.filter((d) =>
      currentUser.availability.days.includes(d)
    ).length;
    score += scheduleOverlap * 3;

    // Similar session frequency
    const sessionDiff = Math.abs(
      member.stats.thisMonthSessions - currentUser.stats.thisMonthSessions
    );
    score += Math.max(0, 10 - sessionDiff);

    return Math.min(100, Math.max(0, score));
  };

  const filteredMembers = otherMembers
    .filter((member) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !member.name.toLowerCase().includes(query) &&
          !member.bio?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Belt filter
      if (beltFilter !== "all" && member.beltRank !== beltFilter) {
        return false;
      }

      // Focus filters
      if (focusFilters.size > 0) {
        const hasFocus = Array.from(focusFilters).some((focus) =>
          member.trainingFocus.includes(focus as any)
        );
        if (!hasFocus) return false;
      }

      return true;
    })
    .map((member) => ({
      ...member,
      matchScore: calculateMatchScore(member),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSendRequest = (_memberId: string, memberName: string) => {
    toast.success(`Training partner request sent to ${memberName}!`);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-950";
    if (score >= 60) return "text-blue-600 bg-blue-100 dark:bg-blue-950";
    if (score >= 40) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950";
    return "text-slate-600 bg-slate-100 dark:bg-slate-900";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Find Training Partners</DialogTitle>
          <DialogDescription>
            Search for members with similar goals and availability
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={beltFilter}
              onValueChange={(value) => setBeltFilter(value as BeltRank | "all")}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Belts</SelectItem>
                <SelectItem value="white">White Belt</SelectItem>
                <SelectItem value="yellow">Yellow Belt</SelectItem>
                <SelectItem value="orange">Orange Belt</SelectItem>
                <SelectItem value="green">Green Belt</SelectItem>
                <SelectItem value="blue">Blue Belt</SelectItem>
                <SelectItem value="brown">Brown Belt</SelectItem>
                <SelectItem value="black">Black Belt</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 flex-wrap">
              <Label className="text-xs text-muted-foreground">Focus:</Label>
              {["randori", "kata", "competition"].map((focus) => (
                <div key={focus} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`focus-${focus}`}
                    checked={focusFilters.has(focus)}
                    onCheckedChange={() => toggleFocusFilter(focus)}
                  />
                  <Label
                    htmlFor={`focus-${focus}`}
                    className="text-xs font-normal capitalize cursor-pointer"
                  >
                    {focus}
                  </Label>
                </div>
              ))}
            </div>

            {(searchQuery || beltFilter !== "all" || focusFilters.size > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setBeltFilter("all");
                  setFocusFilters(new Set());
                }}
                className="gap-2 h-9"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-6 py-4 max-h-[50vh]">
          <div className="space-y-3">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-12 w-12 border-2 border-background shrink-0">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-sm font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <BeltBadge
                          rank={member.beltRank}
                          showTooltip={false}
                          className="text-xs"
                        />
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs font-semibold",
                            getMatchScoreColor(member.matchScore)
                          )}
                        >
                          {member.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendRequest(member._id, member.name)}
                      className="gap-2 shrink-0"
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {member.availability.days.length} days/week
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>{member.totalSessions} sessions</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>{member.currentStreak} day streak</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {member.trainingFocus.map((focus) => (
                      <Badge
                        key={focus}
                        variant="outline"
                        className="text-xs px-2 py-0 capitalize"
                      >
                        {focus}
                      </Badge>
                    ))}
                  </div>

                  {member.favoriteTechniques.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.favoriteTechniques.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No members found matching your filters</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setBeltFilter("all");
                    setFocusFilters(new Set());
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filteredMembers.length} of {otherMembers.length} members
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
