import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { EmptyMessagesState } from "./EmptyGroupState";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  createdAt: number;
  edited?: boolean;
  editedAt?: number;
  deleted?: boolean;
  reactions?: Array<{
    emoji: string;
    memberId: string;
    memberName: string;
  }>;
  replyToMessage?: {
    _id: string;
    content: string;
    senderName: string;
    createdAt: number;
  } | null;
}

interface MessageThreadProps {
  messages: Message[];
  currentMemberId: string;
  groupName?: string;
  isLoading?: boolean;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageThread({
  messages,
  currentMemberId,
  groupName,
  isLoading,
  onEdit,
  onDelete,
  onReply,
  onReact,
}: MessageThreadProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [messages.length > 0]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </motion.div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1">
        <EmptyMessagesState groupName={groupName} />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="py-4 space-y-1">
        {messages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            isOwnMessage={message.senderId === currentMemberId}
            currentMemberId={currentMemberId}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            onReact={onReact}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
