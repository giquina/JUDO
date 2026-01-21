import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useUnreadCounts(memberId?: Id<"members">) {
  const unreadCount = useQuery(
    api.functions.messages.getUnreadCount,
    memberId ? { memberId } : "skip"
  );

  return {
    totalUnread: unreadCount || 0,
    isLoading: unreadCount === undefined,
  };
}
