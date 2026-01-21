import { motion } from "framer-motion";
import { CalendarDays, Plus, Trophy, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyEventsProps {
  onCreateEvent?: () => void;
  filterApplied?: boolean;
}

export function EmptyEvents({ onCreateEvent, filterApplied }: EmptyEventsProps) {
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-8 rounded-full border border-violet-500/20">
          <CalendarDays className="w-16 h-16 text-violet-500" />

          {/* Floating Trophy */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-500 to-amber-500 p-2.5 rounded-full shadow-lg"
          >
            <Trophy className="w-6 h-6 text-white" />
          </motion.div>

          {/* Floating Users */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 -left-2 bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-full shadow-lg"
          >
            <Users className="w-5 h-5 text-white" />
          </motion.div>

          {/* Orbiting Particles */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-violet-500 rounded-full" />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {filterApplied ? "No Events Found" : "No Events Scheduled"}
        </h3>
        <p className="text-muted-foreground">
          {filterApplied
            ? "No events match your current filters. Try adjusting your search or date range."
            : "Organize competitions, seminars, gradings, and social events. Keep your community engaged and motivated."}
        </p>
      </motion.div>

      {/* Actions */}
      {!filterApplied && onCreateEvent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onCreateEvent} size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create First Event
          </Button>
        </motion.div>
      )}

      {/* Event Type Examples */}
      {!filterApplied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-left cursor-pointer transition-shadow hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mb-4 shadow-md">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Competitions</h4>
            <p className="text-xs text-muted-foreground">
              Belt gradings, tournaments, and inter-club matches
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-left cursor-pointer transition-shadow hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Seminars</h4>
            <p className="text-xs text-muted-foreground">
              Guest instructors, workshops, and training camps
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-left cursor-pointer transition-shadow hover:shadow-lg"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Social Events</h4>
            <p className="text-xs text-muted-foreground">
              Club socials, fundraisers, and community gatherings
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
