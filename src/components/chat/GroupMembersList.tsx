import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { useConfirm } from "@/hooks/useConfirm";
import {
  UserPlus,
  Crown,
  Shield,
  User,
  MoreVertical,
  UserMinus,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Id } from "../../../convex/_generated/dataModel";
import { motion } from "framer-motion";

interface GroupMember {
  _id: Id<"members">;
  name: string;
  email: string;
  beltRank: string;
  groupRole: "owner" | "admin" | "member";
}

interface GroupMembersListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: GroupMember[];
  currentMemberRole?: "owner" | "admin" | "member";
  currentMemberId: Id<"members">;
  onAddMembers?: () => void;
  onRemoveMember?: (memberId: Id<"members">) => void;
  onPromoteToAdmin?: (memberId: Id<"members">) => void;
  onDemoteToMember?: (memberId: Id<"members">) => void;
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: User,
};

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

export function GroupMembersList({
  open,
  onOpenChange,
  members,
  currentMemberRole,
  currentMemberId,
  onAddMembers,
  onRemoveMember,
  onPromoteToAdmin,
  onDemoteToMember,
}: GroupMembersListProps) {
  const confirm = useConfirm();
  const canManageMembers = ["owner", "admin"].includes(currentMemberRole || "");
  const isOwner = currentMemberRole === "owner";

  const handleRemoveMember = async (member: GroupMember) => {
    if (!onRemoveMember) return;

    const confirmed = await confirm({
      title: "Remove Member?",
      description: `Are you sure you want to remove ${member.name} from this group? They will lose access to all group messages.`,
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      onRemoveMember(member._id);
    }
  };

  const handlePromoteToAdmin = async (member: GroupMember) => {
    if (!onPromoteToAdmin) return;

    const confirmed = await confirm({
      title: "Make Admin?",
      description: `Give ${member.name} admin privileges? They will be able to manage members and group settings.`,
      confirmLabel: "Make Admin",
      cancelLabel: "Cancel",
      variant: "default",
    });

    if (confirmed) {
      onPromoteToAdmin(member._id);
    }
  };

  const handleDemoteToMember = async (member: GroupMember) => {
    if (!onDemoteToMember) return;

    const confirmed = await confirm({
      title: "Remove Admin Role?",
      description: `Remove admin privileges from ${member.name}? They will become a regular member.`,
      confirmLabel: "Remove Admin",
      cancelLabel: "Cancel",
      variant: "warning",
    });

    if (confirmed) {
      onDemoteToMember(member._id);
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

  // Sort members: owner first, then admins, then members
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, member: 2 };
    return roleOrder[a.groupRole] - roleOrder[b.groupRole];
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Group Members ({members.length})</DialogTitle>
          <DialogDescription>
            View and manage members in this group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add Members Button */}
          {canManageMembers && onAddMembers && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={onAddMembers}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Members
              </Button>
              <Separator />
            </>
          )}

          {/* Members List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {sortedMembers.map((member) => {
                const RoleIcon = roleIcons[member.groupRole];
                const canModify =
                  canManageMembers &&
                  member._id !== currentMemberId &&
                  member.groupRole !== "owner";

                return (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">
                          {member.name}
                        </p>
                        {member._id === currentMemberId && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>

                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {member.beltRank}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <SimpleTooltip content={roleLabels[member.groupRole]} side="top">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <RoleIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {roleLabels[member.groupRole]}
                          </span>
                        </div>
                      </SimpleTooltip>

                      {canModify && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <SimpleTooltip content="Member actions" side="top">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </SimpleTooltip>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-1" align="end">
                            {isOwner && (
                              <>
                                {member.groupRole === "member" &&
                                  onPromoteToAdmin && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                      onClick={() => handlePromoteToAdmin(member)}
                                    >
                                      <ShieldCheck className="w-4 h-4 mr-2" />
                                      Make Admin
                                    </Button>
                                  )}
                                {member.groupRole === "admin" &&
                                  onDemoteToMember && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                      onClick={() => handleDemoteToMember(member)}
                                    >
                                      <ShieldOff className="w-4 h-4 mr-2" />
                                      Remove Admin
                                    </Button>
                                  )}
                              </>
                            )}
                            {onRemoveMember && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-destructive hover:text-destructive"
                                onClick={() => handleRemoveMember(member)}
                              >
                                <UserMinus className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            )}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
