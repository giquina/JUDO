import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Flame,
  Target,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateLeaderboard } from "@/lib/mockSocialData";
import type { BeltRank } from "@/types";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  currentUserId?: string;
  className?: string;
}

type LeaderboardType = "sessions" | "streak" | "improved" | "competitions";

export function Leaderboard({
  currentUserId = "mem-001",
  className,
}: LeaderboardProps) {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("sessions");
  const [beltFilter, setBeltFilter] = useState<BeltRank | "all">("all");
  const [optedIn, setOptedIn] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const leaderboardData = generateLeaderboard(leaderboardType);

  const filteredData = leaderboardData.filter((entry) => {
    if (beltFilter === "all") return true;
    return entry.beltRank === beltFilter;
  });

  const currentUserRank = filteredData.findIndex(
    (entry) => entry.memberId === currentUserId
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getRankChange = (current: number, previous?: number) => {
    if (!previous || previous === current) {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
    if (previous > current) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs font-medium">{previous - current}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="h-4 w-4" />
        <span className="text-xs font-medium">{current - previous}</span>
      </div>
    );
  };

  const getScoreLabel = (type: LeaderboardType) => {
    switch (type) {
      case "sessions":
        return "sessions";
      case "streak":
        return "day streak";
      case "improved":
        return "increase";
      case "competitions":
        return "wins";
    }
  };

  const getTypeIcon = (type: LeaderboardType) => {
    switch (type) {
      case "sessions":
        return <Target className="h-4 w-4" />;
      case "streak":
        return <Flame className="h-4 w-4" />;
      case "improved":
        return <TrendingUp className="h-4 w-4" />;
      case "competitions":
        return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              Compete with your club members
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide" : "Filters"}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-4">
                  <Label className="text-xs text-muted-foreground shrink-0">
                    Belt Level:
                  </Label>
                  <Select
                    value={beltFilter}
                    onValueChange={(value) => setBeltFilter(value as BeltRank | "all")}
                  >
                    <SelectTrigger className="h-8 text-xs">
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
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="opt-in" className="text-xs text-muted-foreground">
                    Show me on leaderboard
                  </Label>
                  <Switch
                    id="opt-in"
                    checked={optedIn}
                    onCheckedChange={setOptedIn}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <Separator />

      <Tabs
        value={leaderboardType}
        onValueChange={(value) => setLeaderboardType(value as LeaderboardType)}
        className="flex-1 flex flex-col"
      >
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="sessions" className="text-xs gap-1 py-2">
              <Target className="h-3 w-3" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="streak" className="text-xs gap-1 py-2">
              <Flame className="h-3 w-3" />
              Streak
            </TabsTrigger>
            <TabsTrigger value="improved" className="text-xs gap-1 py-2">
              <TrendingUp className="h-3 w-3" />
              Improved
            </TabsTrigger>
            <TabsTrigger value="competitions" className="text-xs gap-1 py-2">
              <Trophy className="h-3 w-3" />
              Wins
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="flex-1 pt-4 pb-4 px-0">
          <ScrollArea className="h-full">
            <div className="px-6 space-y-2">
              {filteredData.slice(0, 10).map((entry, index) => {
                const isCurrentUser = entry.memberId === currentUserId;
                const rank = index + 1;

                return (
                  <motion.div
                    key={entry.memberId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      isCurrentUser && optedIn
                        ? "bg-primary/10 border-2 border-primary/50"
                        : "bg-card border hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <div className="w-6 flex items-center justify-center">
                        {getRankIcon(rank) || (
                          <span className="text-sm font-bold text-muted-foreground">
                            {rank}
                          </span>
                        )}
                      </div>
                      <div className="w-5 flex items-center justify-center">
                        {getRankChange(entry.currentRank, entry.previousRank)}
                      </div>
                    </div>

                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback className="text-xs font-semibold">
                        {getInitials(entry.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate">
                          {entry.name}
                          {isCurrentUser && (
                            <span className="text-primary ml-1">(You)</span>
                          )}
                        </h4>
                      </div>
                      <BeltBadge
                        rank={entry.beltRank}
                        showTooltip={false}
                        className="mt-0.5 text-xs"
                      />
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">{entry.score}</div>
                      <div className="text-xs text-muted-foreground">
                        {getScoreLabel(leaderboardType)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No entries for this filter</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Tabs>

      {optedIn && currentUserRank >= 0 && currentUserRank < 10 && (
        <>
          <Separator />
          <div className="px-6 py-3 bg-primary/5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getTypeIcon(leaderboardType)}
                <span className="font-medium">Your Rank:</span>
              </div>
              <Badge variant="default" className="text-sm">
                #{currentUserRank + 1} of {filteredData.length}
              </Badge>
            </div>
          </div>
        </>
      )}

      {optedIn && (currentUserRank >= 10 || currentUserRank === -1) && (
        <>
          <Separator />
          <div className="px-6 py-3 bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              {currentUserRank === -1
                ? "Keep training to appear on the leaderboard!"
                : `You're ranked #${currentUserRank + 1}. Keep pushing to reach top 10!`}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
