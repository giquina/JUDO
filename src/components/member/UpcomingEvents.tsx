import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: number;
  time: string;
  location: string;
  type: "competition" | "seminar" | "social" | "training";
  attendees?: number;
  maxAttendees?: number;
  isRegistered: boolean;
}

interface UpcomingEventsProps {
  events: Event[];
  onRegister?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
}

const EVENT_COLORS = {
  competition: "from-red-500/20 to-orange-500/20 border-red-500/50",
  seminar: "from-blue-500/20 to-cyan-500/20 border-blue-500/50",
  social: "from-purple-500/20 to-pink-500/20 border-purple-500/50",
  training: "from-green-500/20 to-emerald-500/20 border-green-500/50",
};

const EVENT_ICONS = {
  competition: "🏆",
  seminar: "📚",
  social: "🎉",
  training: "🥋",
};

export default function UpcomingEvents({
  events,
  onRegister,
  onViewDetails,
}: UpcomingEventsProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getDaysUntil = (timestamp: number) => {
    const days = Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date - b.date);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>Don't miss out on club activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            </div>
          ) : (
            sortedEvents.map((event, index) => {
              const spotsLeft =
                event.maxAttendees && event.attendees
                  ? event.maxAttendees - event.attendees
                  : null;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-gradient-to-r ${
                      EVENT_COLORS[event.type]
                    } border-2 cursor-pointer hover:shadow-md transition-all`}
                    onClick={() => onViewDetails?.(event.id)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-2xl">{EVENT_ICONS[event.type]}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {event.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        {event.isRegistered && (
                          <Badge variant="default" className="text-xs flex-shrink-0">
                            Registered
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium">{formatDate(event.date)}</span>
                          <Badge variant="outline" className="text-xs">
                            {getDaysUntil(event.date)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>

                        {event.attendees !== undefined && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              {event.attendees}
                              {event.maxAttendees && ` / ${event.maxAttendees}`} attending
                            </span>
                            {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
                              <Badge variant="outline" className="text-xs text-orange-600">
                                Only {spotsLeft} spots left
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      {!event.isRegistered && onRegister && (
                        <Button
                          size="sm"
                          variant="default"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRegister(event.id);
                          }}
                          disabled={spotsLeft === 0}
                        >
                          {spotsLeft === 0 ? "Event Full" : "Register Now"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            View All Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
