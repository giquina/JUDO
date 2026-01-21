import { motion } from "framer-motion";
import { Calendar, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyClassesProps {
  onCreateClass?: () => void;
  filterApplied?: boolean;
}

export function EmptyClasses({ onCreateClass, filterApplied }: EmptyClassesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Calendar Icon */}
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 rounded-full border border-emerald-500/20">
          <Calendar className="w-16 h-16 text-emerald-500" />

          {/* Floating Clock */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1 -right-1 bg-gradient-to-br from-cyan-500 to-teal-500 p-2 rounded-full"
          >
            <Clock className="w-5 h-5 text-white" />
          </motion.div>

          {/* Floating Particles */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 -left-2 w-3 h-3 bg-emerald-500 rounded-full"
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
        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {filterApplied ? "No Classes Found" : "No Classes Scheduled"}
        </h3>
        <p className="text-muted-foreground">
          {filterApplied
            ? "No classes match your current filters. Try adjusting your search criteria."
            : "Get started by creating your first class. Set schedules, assign instructors, and manage student attendance with ease."}
        </p>
      </motion.div>

      {/* Actions */}
      {!filterApplied && onCreateClass && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button onClick={onCreateClass} size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create First Class
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Calendar className="w-4 h-4" />
            Import Schedule
          </Button>
        </motion.div>
      )}

      {/* Feature List */}
      {!filterApplied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Weekly Schedules</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
            <Clock className="w-4 h-4 text-teal-500" />
            <span>Time Management</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
            <Users className="w-4 h-4 text-cyan-500" />
            <span>Attendance Tracking</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
