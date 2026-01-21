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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    type: "club-wide" | "sub-group" | "competition" | "class-based";
    isPrivate: boolean;
    autoJoin?: boolean;
    settings?: {
      allowMemberInvites: boolean;
      allowFileSharing: boolean;
      maxMembers?: number;
    };
  }) => Promise<void>;
}

export function CreateGroupModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateGroupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: "club-wide" | "sub-group" | "competition" | "class-based";
    isPrivate: boolean;
    autoJoin: boolean;
    allowMemberInvites: boolean;
    allowFileSharing: boolean;
    maxMembers: string;
  }>({
    name: "",
    description: "",
    type: "sub-group",
    isPrivate: false,
    autoJoin: false,
    allowMemberInvites: true,
    allowFileSharing: true,
    maxMembers: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        isPrivate: formData.isPrivate,
        autoJoin: formData.autoJoin,
        settings: {
          allowMemberInvites: formData.allowMemberInvites,
          allowFileSharing: formData.allowFileSharing,
          maxMembers: formData.maxMembers
            ? parseInt(formData.maxMembers)
            : undefined,
        },
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "sub-group",
        isPrivate: false,
        autoJoin: false,
        allowMemberInvites: true,
        allowFileSharing: true,
        maxMembers: "",
      });

      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a group to chat with club members. Choose the type and privacy
            settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter group name"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What's this group about?"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Group Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Group Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) =>
                setFormData({ ...formData, type: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub-group">
                  Sub-group - For specific interests or activities
                </SelectItem>
                <SelectItem value="club-wide">
                  Club-wide - For all active members (Admin only)
                </SelectItem>
                <SelectItem value="competition">
                  Competition - For competition teams (Admin only)
                </SelectItem>
                <SelectItem value="class-based">
                  Class-based - Linked to a specific class (Admin only)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm">Privacy & Settings</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPrivate">Private Group</Label>
                <p className="text-xs text-muted-foreground">
                  Members need an invitation to join
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

            {formData.type === "club-wide" && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoJoin">Auto-join</Label>
                  <p className="text-xs text-muted-foreground">
                    All active members automatically join
                  </p>
                </div>
                <Switch
                  id="autoJoin"
                  checked={formData.autoJoin}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoJoin: checked })
                  }
                  disabled={isSubmitting}
                />
              </div>
            )}

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
                  Allow members to share files
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
              <Label htmlFor="maxMembers">Max Members (Optional)</Label>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
