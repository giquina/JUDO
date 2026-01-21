import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  attendees?: number;
  maxAttendees?: number;
  type: "training" | "competition" | "seminar" | "social";
  isRegistered?: boolean;
}

export interface EventWidgetProps {
  event: Event;
  onClick?: () => void;
  className?: string;
}

const eventColors = {
  training: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  competition: "bg-red-500/10 text-red-500 border-red-500/20",
  seminar: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  social: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function EventWidget({ event, onClick, className }: EventWidgetProps) {
  const isUpcoming = event.date > new Date();
  const isSoon = event.date.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 cursor-pointer transition-shadow hover:shadow-lg",
        isSoon && isUpcoming && "ring-2 ring-orange-500/50",
        className
      )}
    >
      {/* Type badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full border",
            eventColors[event.type]
          )}
        >
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>

        {isSoon && isUpcoming && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/10 text-orange-500"
          >
            Soon
          </motion.span>
        )}
      </div>

      {/* Event info */}
      <h3 className="font-semibold text-base mb-2">{event.title}</h3>

      {event.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(event.date, "MMM d, yyyy • h:mm a")}</span>
        </div>

        {isUpcoming && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(event.date, { addSuffix: true })}</span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}

        {event.attendees !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.attendees}
              {event.maxAttendees && ` / ${event.maxAttendees}`} attending
            </span>
          </div>
        )}
      </div>

      {/* Registration status */}
      {event.isRegistered && (
        <div className="mt-4 pt-4 border-t">
          <span className="text-xs font-medium text-green-600">
            You're registered
          </span>
        </div>
      )}
    </motion.div>
  );
}
