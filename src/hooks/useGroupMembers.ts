import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function useGroupMembers(groupId?: Id<"groups">) {
  const members = useQuery(
    api.functions.groups.getMembers,
    groupId ? { groupId } : "skip"
  );

  return {
    members: members || [],
    isLoading: members === undefined,
  };
}

export function useAddMember() {
  const addMember = useMutation(api.functions.groups.addMember);

  return async (
    groupId: Id<"groups">,
    memberId: Id<"members">,
    addedBy: Id<"members">,
    role?: "admin" | "member"
  ) => {
    try {
      await addMember({ groupId, memberId, addedBy, role });
      toast.success("Member added successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add member");
      throw error;
    }
  };
}

export function useRemoveMember() {
  const removeMember = useMutation(api.functions.groups.removeMember);

  return async (
    groupId: Id<"groups">,
    memberId: Id<"members">,
    removedBy: Id<"members">
  ) => {
    try {
      await removeMember({ groupId, memberId, removedBy });
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member");
      throw error;
    }
  };
}

export function useUpdateMemberRole() {
  const updateRole = useMutation(api.functions.groups.updateMemberRole);

  return async (
    groupId: Id<"groups">,
    memberId: Id<"members">,
    newRole: "admin" | "member",
    updatedBy: Id<"members">
  ) => {
    try {
      await updateRole({ groupId, memberId, newRole, updatedBy });
      toast.success("Member role updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
      throw error;
    }
  };
}
