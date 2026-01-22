import { motion } from "framer-motion";
import { Clock, Users, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  title: string;
  instructor: string;
  time: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  spotsLeft?: number;
  maxSpots?: number;
  location?: string;
  date?: string;
  onClick?: () => void;
  className?: string;
}

const levelColors = {
  Beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Advanced: "bg-red-500/10 text-red-600 border-red-500/20",
  "All Levels": "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export default function ClassCard({
  title,
  instructor,
  time,
  duration,
  level,
  spotsLeft,
  maxSpots,
  location,
  date,
  onClick,
  className,
}: ClassCardProps) {
  const isFull = spotsLeft !== undefined && spotsLeft <= 0;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-4 cursor-pointer",
        isFull && "opacity-60",
        className
      )}
      onClick={onClick}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.12)",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {/* Level Badge */}
      <motion.span
        className={cn(
          "absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full border",
          levelColors[level]
        )}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.15 }
        }}
      >
        {level}
      </motion.span>

      {/* Title & Instructor */}
      <div className="mb-3">
        <h3 className="font-semibold text-lg leading-tight pr-20">{title}</h3>
        <p className="text-sm text-muted-foreground">with {instructor}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <motion.div
          className="flex items-center gap-2 text-muted-foreground"
          whileHover={{ x: 2, color: "var(--foreground)" }}
          transition={{ duration: 0.15 }}
        >
          <Clock className="w-4 h-4" />
          <span>{time} ({duration})</span>
        </motion.div>

        {location && (
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            whileHover={{ x: 2, color: "var(--foreground)" }}
            transition={{ duration: 0.15 }}
          >
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </motion.div>
        )}

        {date && (
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            whileHover={{ x: 2, color: "var(--foreground)" }}
            transition={{ duration: 0.15 }}
          >
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </motion.div>
        )}

        {spotsLeft !== undefined && maxSpots !== undefined && (
          <motion.div
            className={cn(
              "flex items-center gap-2",
              isFull ? "text-destructive" : spotsLeft <= 3 ? "text-yellow-600" : "text-muted-foreground"
            )}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <Users className="w-4 h-4" />
            <span>{isFull ? "Class Full" : `${spotsLeft}/${maxSpots} spots`}</span>
          </motion.div>
        )}
      </div>

      {/* Hover Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
