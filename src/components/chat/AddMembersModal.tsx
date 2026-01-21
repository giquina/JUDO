import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, UserPlus } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { motion } from "framer-motion";

interface Member {
  _id: Id<"members">;
  name: string;
  email: string;
  beltRank: string;
}

interface AddMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableMembers: Member[];
  existingMemberIds: Id<"members">[];
  onAddMember: (memberId: Id<"members">) => Promise<void>;
}

export function AddMembersModal({
  open,
  onOpenChange,
  availableMembers,
  existingMemberIds,
  onAddMember,
}: AddMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addingMemberId, setAddingMemberId] = useState<Id<"members"> | null>(
    null
  );

  const filteredMembers = availableMembers
    .filter((member) => !existingMemberIds.includes(member._id))
    .filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddMember = async (memberId: Id<"members">) => {
    setAddingMemberId(memberId);
    try {
      await onAddMember(memberId);
    } catch (error) {
      // Error handled in hook
    } finally {
      setAddingMemberId(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Search and add active members to this group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Members List */}
          <ScrollArea className="h-[400px] border rounded-lg">
            {filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No members found"
                    : "All active members are already in this group"}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredMembers.map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      {member.beltRank}
                    </Badge>

                    <Button
                      size="sm"
                      onClick={() => handleAddMember(member._id)}
                      disabled={addingMemberId === member._id}
                    >
                      {addingMemberId === member._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
