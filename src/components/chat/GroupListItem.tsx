import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users, Lock, Trophy, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupListItemProps {
  group: {
    _id: string;
    name: string;
    type: "club-wide" | "sub-group" | "competition" | "class-based";
    isPrivate: boolean;
    avatar?: string;
    memberCount: number;
    unreadCount?: number;
    latestMessage?: {
      content: string;
      senderName: string;
      createdAt: number;
    } | null;
    membership?: {
      isPinned: boolean;
      isMuted: boolean;
    };
  };
  isActive?: boolean;
  onClick?: () => void;
}

const groupTypeIcons = {
  "club-wide": Users,
  "sub-group": Users,
  "competition": Trophy,
  "class-based": BookOpen,
};

export function GroupListItem({ group, isActive, onClick }: GroupListItemProps) {
  const Icon = groupTypeIcons[group.type];
  const initials = group.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer rounded-lg transition-colors",
        "hover:bg-accent/50",
        isActive && "bg-accent",
        group.membership?.isPinned && "bg-primary/5 border-l-2 border-primary"
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          {group.avatar && <AvatarImage src={group.avatar} alt={group.name} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {group.unreadCount! > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {group.unreadCount! > 9 ? "9+" : group.unreadCount}
          </Badge>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={cn(
              "font-semibold text-sm truncate",
              group.unreadCount! > 0 && "font-bold"
            )}
          >
            {group.name}
          </h3>
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <Icon className="w-3 h-3 text-muted-foreground" />
            {group.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
          </div>
        </div>

        {group.latestMessage ? (
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={cn(
                "text-xs truncate",
                group.unreadCount! > 0
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span className="font-medium">{group.latestMessage.senderName}:</span>{" "}
              {group.latestMessage.content}
            </p>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(group.latestMessage.createdAt, {
                addSuffix: false,
              })}
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No messages yet</p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {group.memberCount}
          </span>
          {group.membership?.isMuted && (
            <Badge variant="secondary" className="text-xs">
              Muted
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
