import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyingTo {
  messageId: string;
  content: string;
  senderName: string;
}

interface MessageInputProps {
  onSend: (content: string, replyTo?: string) => void;
  replyingTo?: ReplyingTo | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  replyingTo,
  onCancelReply,
  disabled,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed, replyingTo?.messageId);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  return (
    <div className="border-t bg-background">
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-primary">
                  Replying to {replyingTo.senderName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {replyingTo.content}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={onCancelReply}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 p-4">
        {/* Future: Emoji picker button */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 flex-shrink-0"
          disabled={disabled}
        >
          <Smile className="w-5 h-5" />
        </Button> */}

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[44px] max-h-[200px] resize-none",
              "pr-10"
            )}
            rows={1}
          />
        </div>

        {/* Future: Attachment button */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button> */}

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="sm"
          className="h-9 w-9 p-0 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Hint text */}
      <div className="px-4 pb-2 text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
