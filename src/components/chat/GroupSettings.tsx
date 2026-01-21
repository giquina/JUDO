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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/useConfirm";
import { Loader2, LogOut, Trash2, Users } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface GroupSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    _id: Id<"groups">;
    name: string;
    description?: string;
    type: "club-wide" | "sub-group" | "competition" | "class-based";
    isPrivate: boolean;
    memberCount: number;
    membership?: {
      role: "owner" | "admin" | "member";
      notificationsEnabled: boolean;
      isMuted: boolean;
      isPinned: boolean;
    };
    settings?: {
      allowMemberInvites: boolean;
      allowFileSharing: boolean;
      maxMembers?: number;
    };
  };
  onUpdate?: (data: {
    name?: string;
    description?: string;
    isPrivate?: boolean;
    settings?: {
      allowMemberInvites: boolean;
      allowFileSharing: boolean;
      maxMembers?: number;
    };
  }) => Promise<void>;
  onLeave?: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function GroupSettings({
  open,
  onOpenChange,
  group,
  onUpdate,
  onLeave,
  onDelete,
}: GroupSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirm = useConfirm();
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || "",
    isPrivate: group.isPrivate,
    allowMemberInvites: group.settings?.allowMemberInvites ?? true,
    allowFileSharing: group.settings?.allowFileSharing ?? true,
    maxMembers: group.settings?.maxMembers?.toString() || "",
  });

  const isOwnerOrAdmin = ["owner", "admin"].includes(
    group.membership?.role || ""
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdate || !isOwnerOrAdmin) return;

    setIsSubmitting(true);
    try {
      await onUpdate({
        name: formData.name !== group.name ? formData.name : undefined,
        description:
          formData.description !== group.description
            ? formData.description
            : undefined,
        isPrivate:
          formData.isPrivate !== group.isPrivate
            ? formData.isPrivate
            : undefined,
        settings: {
          allowMemberInvites: formData.allowMemberInvites,
          allowFileSharing: formData.allowFileSharing,
          maxMembers: formData.maxMembers
            ? parseInt(formData.maxMembers)
            : undefined,
        },
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeave = async () => {
    if (!onLeave) return;

    const confirmed = await confirm({
      title: "Leave Group?",
      description: `Are you sure you want to leave ${group.name}? You can rejoin later if it's not private.`,
      confirmLabel: "Leave Group",
      cancelLabel: "Cancel",
      variant: "warning",
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await onLeave();
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = await confirm({
      title: "Delete Group?",
      description: `Are you sure you want to permanently delete ${group.name}? This will remove all messages and cannot be undone. ${group.memberCount} member${group.memberCount !== 1 ? 's' : ''} will lose access to this group.`,
      confirmLabel: "Delete Group",
      cancelLabel: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
          <DialogDescription>
            {isOwnerOrAdmin
              ? "Manage group settings and members"
              : "View group information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 py-4">
          {/* Group Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Group Type</span>
              <Badge variant="secondary">{group.type}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Members</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-4 h-4" />
                {group.memberCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Role</span>
              <Badge>{group.membership?.role}</Badge>
            </div>
          </div>

          <Separator />

          {/* Editable Settings (Owner/Admin only) */}
          {isOwnerOrAdmin ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-sm">Privacy & Permissions</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPrivate">Private Group</Label>
                    <p className="text-xs text-muted-foreground">
                      Require invitation to join
                    </p>
                  </div>
                  <Switch
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPrivate: checked })
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowMemberInvites">Member Invites</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow members to invite others
                    </p>
                  </div>
                  <Switch
                    id="allowMemberInvites"
                    checked={formData.allowMemberInvites}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowMemberInvites: checked })
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowFileSharing">File Sharing</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow file attachments
                    </p>
                  </div>
                  <Switch
                    id="allowFileSharing"
                    checked={formData.allowFileSharing}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowFileSharing: checked })
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Max Members</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    min="2"
                    value={formData.maxMembers}
                    onChange={(e) =>
                      setFormData({ ...formData, maxMembers: e.target.value })
                    }
                    placeholder="Unlimited"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Description:</span>{" "}
                {group.description || "No description"}
              </p>
            </div>
          )}

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4 pt-4">
            <h4 className="font-semibold text-sm text-destructive">
              Danger Zone
            </h4>

            {group.membership?.role !== "owner" && onLeave && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleLeave}
                disabled={isSubmitting}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Group
              </Button>
            )}

            {group.membership?.role === "owner" && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Group
              </Button>
            )}
          </div>

          {isOwnerOrAdmin && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
