import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyGroupStateProps {
  onCreateGroup?: () => void;
}

export function EmptyGroupState({ onCreateGroup }: EmptyGroupStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <MessageSquare className="w-12 h-12 text-primary" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Welcome to Group Chat</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Connect with your club members, share updates, and stay informed.
        Create or join a group to get started.
      </p>

      {onCreateGroup && (
        <Button onClick={onCreateGroup} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Group
        </Button>
      )}
    </motion.div>
  );
}

interface EmptyMessagesStateProps {
  groupName?: string;
}

export function EmptyMessagesState({ groupName }: EmptyMessagesStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <MessageSquare className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {groupName ? `Start the conversation in ${groupName}` : "No messages yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Be the first to send a message and get the discussion going!
      </p>
    </motion.div>
  );
}
