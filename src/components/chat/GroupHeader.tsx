import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Settings,
  Menu,
  Lock,
  Trophy,
  BookOpen,
  Pin,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupHeaderProps {
  group: {
    _id: string;
    name: string;
    type: "club-wide" | "sub-group" | "competition" | "class-based";
    isPrivate: boolean;
    avatar?: string;
    memberCount: number;
    membership?: {
      isPinned: boolean;
      isMuted: boolean;
    };
  };
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
  onOpenMembers?: () => void;
  onTogglePin?: () => void;
  onToggleMute?: () => void;
}

const groupTypeIcons = {
  "club-wide": Users,
  "sub-group": Users,
  "competition": Trophy,
  "class-based": BookOpen,
};

const groupTypeLabels = {
  "club-wide": "Club-wide",
  "sub-group": "Sub-group",
  "competition": "Competition",
  "class-based": "Class",
};

export function GroupHeader({
  group,
  onToggleSidebar,
  onOpenSettings,
  onOpenMembers,
  onTogglePin,
  onToggleMute,
}: GroupHeaderProps) {
  const Icon = groupTypeIcons[group.type];
  const initials = group.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-card">
      {/* Menu button for mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden h-9 w-9 p-0"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Group avatar */}
      <Avatar className="h-10 w-10 cursor-pointer" onClick={onOpenSettings}>
        {group.avatar && <AvatarImage src={group.avatar} alt={group.name} />}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Group info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenMembers}>
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base truncate">{group.name}</h2>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            {group.isPrivate && (
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {groupTypeLabels[group.type]}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Pin toggle */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0",
            group.membership?.isPinned && "text-primary"
          )}
          onClick={onTogglePin}
          aria-label={group.membership?.isPinned ? "Unpin group" : "Pin group"}
          title={group.membership?.isPinned ? "Unpin" : "Pin"}
        >
          <Pin
            className={cn(
              "w-4 h-4",
              group.membership?.isPinned && "fill-current"
            )}
          />
        </Button>

        {/* Mute toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={onToggleMute}
          aria-label={group.membership?.isMuted ? "Unmute notifications" : "Mute notifications"}
          title={group.membership?.isMuted ? "Unmute" : "Mute"}
        >
          {group.membership?.isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={onOpenSettings}
          aria-label="Open group settings"
          title="Group settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
