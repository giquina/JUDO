import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GroupListItem } from "./GroupListItem";
import { motion } from "framer-motion";

interface Group {
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
}

interface GroupListProps {
  groups: Group[];
  activeGroupId?: string;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
}

export function GroupList({
  groups,
  activeGroupId,
  onGroupSelect,
  onCreateGroup,
}: GroupListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedGroups = filteredGroups.filter((g) => g.membership?.isPinned);
  const unpinnedGroups = filteredGroups.filter((g) => !g.membership?.isPinned);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Chats</h2>
          <Button size="sm" onClick={onCreateGroup}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Groups List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              {searchQuery ? (
                <>
                  <p className="text-sm">No groups found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </>
              ) : (
                <>
                  <p className="text-sm">No groups yet</p>
                  <p className="text-xs mt-1">Create one to get started</p>
                </>
              )}
            </motion.div>
          ) : (
            <>
              {/* Pinned Groups */}
              {pinnedGroups.length > 0 && (
                <>
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Pinned
                    </span>
                  </div>
                  {pinnedGroups.map((group) => (
                    <GroupListItem
                      key={group._id}
                      group={group}
                      isActive={group._id === activeGroupId}
                      onClick={() => onGroupSelect(group._id)}
                    />
                  ))}
                  <Separator className="my-2" />
                </>
              )}

              {/* All Groups */}
              {unpinnedGroups.length > 0 && (
                <>
                  {pinnedGroups.length > 0 && (
                    <div className="px-3 py-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        All Chats
                      </span>
                    </div>
                  )}
                  {unpinnedGroups.map((group) => (
                    <GroupListItem
                      key={group._id}
                      group={group}
                      isActive={group._id === activeGroupId}
                      onClick={() => onGroupSelect(group._id)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
