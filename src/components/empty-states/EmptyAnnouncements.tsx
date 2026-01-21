import { motion } from "framer-motion";
import { Megaphone, Plus, Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAnnouncementsProps {
  onCreateAnnouncement?: () => void;
}

export function EmptyAnnouncements({ onCreateAnnouncement }: EmptyAnnouncementsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="relative mb-8"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-8 rounded-full border border-rose-500/20">
          <Megaphone className="w-16 h-16 text-rose-500" />

          {/* Floating Bell */}
          <motion.div
            animate={{
              rotate: [-15, 15, -15],
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-2 bg-gradient-to-br from-rose-500 to-pink-500 p-2 rounded-full shadow-lg"
          >
            <Bell className="w-5 h-5 text-white" />
          </motion.div>

          {/* Send Indicator */}
          <motion.div
            animate={{
              x: [-20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 1,
            }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          >
            <Send className="w-4 h-4 text-rose-500" />
          </motion.div>

          {/* Pulse Rings */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-rose-500"
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          No Announcements Yet
        </h3>
        <p className="text-muted-foreground">
          Keep your members informed about schedule changes, upcoming events, and important updates. Send announcements instantly to everyone.
        </p>
      </motion.div>

      {/* Actions */}
      {onCreateAnnouncement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onCreateAnnouncement} size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create First Announcement
          </Button>
        </motion.div>
      )}

      {/* Example Announcements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 space-y-3 max-w-lg"
      >
        <p className="text-xs text-muted-foreground font-medium">
          ANNOUNCEMENT IDEAS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-lg bg-gradient-to-br from-rose-500/5 to-pink-500/5 border border-rose-500/10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-medium">Schedule Changes</span>
            </div>
            <span className="text-muted-foreground">
              "Training cancelled Tuesday due to holiday"
            </span>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/5 to-fuchsia-500/5 border border-pink-500/10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="font-medium">Upcoming Events</span>
            </div>
            <span className="text-muted-foreground">
              "Belt grading on Saturday at 10am"
            </span>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 border border-fuchsia-500/10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
              <span className="font-medium">General Updates</span>
            </div>
            <span className="text-muted-foreground">
              "New equipment arrived and ready to use"
            </span>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-500/10 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="font-medium">Reminders</span>
            </div>
            <span className="text-muted-foreground">
              "Membership renewal due this month"
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
