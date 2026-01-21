import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export function useMessages(groupId?: Id<"groups">, options?: { limit?: number }) {
  const messages = useQuery(
    api.functions.messages.getByGroup,
    groupId ? { groupId, limit: options?.limit } : "skip"
  );

  return {
    messages: messages || [],
    isLoading: messages === undefined,
  };
}

export function useSendMessage() {
  const sendMessage = useMutation(api.functions.messages.send);

  return async (data: {
    groupId: Id<"groups">;
    senderId: Id<"members">;
    content: string;
    type?: "text" | "image" | "file";
    replyTo?: Id<"messages">;
    attachments?: Array<{
      name: string;
      url: string;
      size: number;
      mimeType: string;
    }>;
  }) => {
    try {
      const messageId = await sendMessage(data);
      return messageId;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      throw error;
    }
  };
}

export function useEditMessage() {
  const editMessage = useMutation(api.functions.messages.edit);

  return async (
    messageId: Id<"messages">,
    memberId: Id<"members">,
    newContent: string
  ) => {
    try {
      await editMessage({ messageId, memberId, newContent });
      toast.success("Message edited");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to edit message");
      throw error;
    }
  };
}

export function useDeleteMessage() {
  const deleteMessage = useMutation(api.functions.messages.deleteMessage);

  return async (messageId: Id<"messages">, memberId: Id<"members">) => {
    try {
      await deleteMessage({ messageId, memberId });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete message");
      throw error;
    }
  };
}

export function useMarkAsRead() {
  const markAsRead = useMutation(api.functions.messages.markAsRead);

  return async (groupId: Id<"groups">, memberId: Id<"members">) => {
    try {
      await markAsRead({ groupId, memberId });
    } catch (error) {
      // Silent fail for read receipts
      console.error("Failed to mark as read:", error);
    }
  };
}

export function useAddReaction() {
  const addReaction = useMutation(api.functions.messages.addReaction);

  return async (messageId: Id<"messages">, memberId: Id<"members">, emoji: string) => {
    try {
      await addReaction({ messageId, memberId, emoji });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add reaction");
      throw error;
    }
  };
}

export function useRemoveReaction() {
  const removeReaction = useMutation(api.functions.messages.removeReaction);

  return async (messageId: Id<"messages">, memberId: Id<"members">, emoji: string) => {
    try {
      await removeReaction({ messageId, memberId, emoji });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove reaction");
      throw error;
    }
  };
}

// Hook to auto-scroll to bottom of messages
export function useAutoScroll(messages: any[], enabled = true) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (!enabled || !scrollRef.current) return;

    // Only auto-scroll if new messages were added
    if (messages.length > prevLengthRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    prevLengthRef.current = messages.length;
  }, [messages, enabled]);

  return scrollRef;
}
