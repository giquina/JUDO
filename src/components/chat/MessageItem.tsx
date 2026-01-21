import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Reply,
  Pencil,
  Trash2,
  Smile,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  currentMemberId: string;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const emojiOptions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function MessageItem({
  message,
  isOwnMessage,
  currentMemberId,
  onEdit,
  onDelete,
  onReply,
  onReact,
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);

  if (message.type === "system") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-4"
      >
        <div className="bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground">
          {message.content}
        </div>
      </motion.div>
    );
  }

  const initials = message.senderName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, typeof message.reactions>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 px-4 py-2 group",
        isOwnMessage && "flex-row-reverse"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[70%]", isOwnMessage && "items-end")}>
        {/* Sender name and timestamp */}
        <div
          className={cn(
            "flex items-baseline gap-2 mb-1",
            isOwnMessage && "flex-row-reverse"
          )}
        >
          {!isOwnMessage && (
            <span className="text-xs font-semibold">{message.senderName}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {format(message.createdAt, "HH:mm")}
            {message.edited && " (edited)"}
          </span>
        </div>

        {/* Reply preview */}
        {message.replyToMessage && (
          <div
            className={cn(
              "mb-2 p-2 rounded-lg bg-muted/50 border-l-2 border-primary text-xs",
              isOwnMessage && "self-end"
            )}
          >
            <div className="font-semibold text-primary">
              {message.replyToMessage.senderName}
            </div>
            <div className="text-muted-foreground truncate">
              {message.replyToMessage.content}
            </div>
          </div>
        )}

        {/* Message bubble */}
        <div className="relative">
          <div
            className={cn(
              "rounded-lg px-4 py-2 break-words",
              isOwnMessage
                ? "bg-primary text-primary-foreground"
                : "bg-muted",
              message.deleted && "italic text-muted-foreground"
            )}
          >
            {message.content}
          </div>

          {/* Reactions */}
          {groupedReactions && Object.keys(groupedReactions).length > 0 && (
            <div
              className={cn(
                "flex flex-wrap gap-1 mt-1",
                isOwnMessage && "justify-end"
              )}
            >
              {Object.entries(groupedReactions).map(([emoji, reactions]) => {
                const hasReacted = reactions.some(
                  (r) => r.memberId === currentMemberId
                );
                return (
                  <button
                    key={emoji}
                    onClick={() => onReact?.(message._id, emoji)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                      "hover:bg-accent transition-colors",
                      hasReacted
                        ? "bg-primary/20 border border-primary"
                        : "bg-muted border border-transparent"
                    )}
                  >
                    <span>{emoji}</span>
                    <span className="text-xs">{reactions.length}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actions menu */}
      {showActions && !message.deleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "flex items-center gap-1 self-start mt-1",
            isOwnMessage && "flex-row-reverse"
          )}
        >
          {/* React */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-accent"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="flex gap-1">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReact?.(message._id, emoji)}
                    className="hover:bg-accent p-2 rounded transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Reply */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-accent"
            onClick={() => onReply?.(message._id)}
          >
            <Reply className="w-4 h-4" />
          </Button>

          {/* More options */}
          {isOwnMessage && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-accent"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1" align="end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onEdit?.(message._id, message.content)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => onDelete?.(message._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
