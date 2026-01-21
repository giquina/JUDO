import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function useGroups(memberId?: Id<"members">) {
  const groups = useQuery(
    api.functions.groups.getUserGroups,
    memberId ? { memberId } : "skip"
  );

  return {
    groups: groups || [],
    isLoading: groups === undefined,
  };
}

export function useGroup(groupId?: Id<"groups">) {
  const group = useQuery(
    api.functions.groups.getById,
    groupId ? { groupId } : "skip"
  );

  return {
    group,
    isLoading: group === undefined,
  };
}

export function useCreateGroup() {
  const createGroup = useMutation(api.functions.groups.create);

  return async (data: {
    memberId: Id<"members">;
    name: string;
    description?: string;
    type: "club-wide" | "sub-group" | "competition" | "class-based";
    isPrivate: boolean;
    autoJoin?: boolean;
    classId?: Id<"classes">;
    settings?: {
      allowMemberInvites: boolean;
      allowFileSharing: boolean;
      maxMembers?: number;
    };
  }) => {
    try {
      const groupId = await createGroup(data);
      toast.success("Group created successfully");
      return groupId;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create group");
      throw error;
    }
  };
}

export function useUpdateGroup() {
  const updateGroup = useMutation(api.functions.groups.update);

  return async (data: {
    groupId: Id<"groups">;
    memberId: Id<"members">;
    name?: string;
    description?: string;
    isPrivate?: boolean;
    settings?: {
      allowMemberInvites: boolean;
      allowFileSharing: boolean;
      maxMembers?: number;
    };
  }) => {
    try {
      await updateGroup(data);
      toast.success("Group updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update group");
      throw error;
    }
  };
}

export function useDeleteGroup() {
  const deleteGroup = useMutation(api.functions.groups.deleteGroup);

  return async (groupId: Id<"groups">, memberId: Id<"members">) => {
    try {
      await deleteGroup({ groupId, memberId });
      toast.success("Group deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete group");
      throw error;
    }
  };
}

export function useLeaveGroup() {
  const leaveGroup = useMutation(api.functions.groups.leaveGroup);

  return async (groupId: Id<"groups">, memberId: Id<"members">) => {
    try {
      await leaveGroup({ groupId, memberId });
      toast.success("Left group successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to leave group");
      throw error;
    }
  };
}

export function useUpdateMembershipSettings() {
  const updateSettings = useMutation(api.functions.groups.updateMembershipSettings);

  return async (data: {
    groupId: Id<"groups">;
    memberId: Id<"members">;
    notificationsEnabled?: boolean;
    isMuted?: boolean;
    isPinned?: boolean;
  }) => {
    try {
      await updateSettings(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
      throw error;
    }
  };
}
