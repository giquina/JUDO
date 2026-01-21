import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Download,
  Trophy,
  GraduationCap,
  PartyPopper,
  Tent,
  Clock,
  Star,
} from "lucide-react";
import { mockUpcomingEvents, getDaysUntil, type Event, type EventType, type RSVPStatus } from "@/lib/mockActivityData";
import { staggerContainer } from "@/lib/animation-variants";

// Event type configuration
const EVENT_TYPE_CONFIG: Record<
  EventType,
  { icon: React.FC<{ className?: string }>; color: string; bgColor: string; gradientFrom: string; gradientTo: string; label: string }
> = {
  competition: {
    icon: Trophy,
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    gradientFrom: "from-yellow-500/10",
    gradientTo: "to-yellow-600/5",
    label: "Competition",
  },
  grading: {
    icon: GraduationCap,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-500/10",
    gradientTo: "to-blue-600/5",
    label: "Grading",
  },
  social: {
    icon: PartyPopper,
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    gradientFrom: "from-purple-500/10",
    gradientTo: "to-purple-600/5",
    label: "Social",
  },
  "training-camp": {
    icon: Tent,
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    gradientFrom: "from-green-500/10",
    gradientTo: "to-green-600/5",
    label: "Training Camp",
  },
};

// RSVP Status configuration
const RSVP_CONFIG: Record<
  NonNullable<RSVPStatus>,
  { icon: React.FC<{ className?: string }>; color: string; label: string }
> = {
  going: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    label: "Going",
  },
  maybe: {
    icon: HelpCircle,
    color: "text-orange-600 dark:text-orange-400",
    label: "Maybe",
  },
  "not-going": {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    label: "Can't Go",
  },
};

// Single Event Item Component
function EventItem({ event, index }: { event: Event; index: number }) {
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(event.rsvpStatus);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [localAttendees, setLocalAttendees] = useState(event.attendees);

  const eventConfig = EVENT_TYPE_CONFIG[event.type];
  const EventIcon = eventConfig.icon;
  const capacityPercentage = (localAttendees / event.capacity) * 100;
  const spotsLeft = event.capacity - localAttendees;
  const timeUntil = getDaysUntil(event.date);

  const handleRSVP = async (newStatus: RSVPStatus) => {
    if (isRSVPing) return;

    setIsRSVPing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));

    const oldStatus = rsvpStatus;
    setRsvpStatus(newStatus);

    // Update attendee count
    if (oldStatus === "going" && newStatus !== "going") {
      setLocalAttendees(prev => Math.max(0, prev - 1));
    } else if (oldStatus !== "going" && newStatus === "going") {
      setLocalAttendees(prev => Math.min(event.capacity, prev + 1));
    }

    // Show toast
    if (newStatus === "going") {
      toast.success("RSVP Confirmed!", {
        description: `You're going to ${event.title}`,
      });
    } else if (newStatus === "maybe") {
      toast.info("Marked as Maybe", {
        description: `${event.title} - Let us know when you're sure!`,
      });
    } else {
      toast("RSVP Updated", {
        description: "Maybe next time!",
      });
    }

    setIsRSVPing(false);
  };

  const handleAddToCalendar = () => {
    toast.success("Added to Calendar", {
      description: "Event has been added to your calendar",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card
        className={`overflow-hidden bg-gradient-to-br ${eventConfig.gradientFrom} ${eventConfig.gradientTo} border-${eventConfig.color.split('-')[1]}-200 dark:border-${eventConfig.color.split('-')[1]}-800 hover:shadow-lg transition-all duration-300 ${
          event.isFeatured ? "ring-2 ring-primary/50" : ""
        }`}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            {/* Event Type Icon/Thumbnail */}
            <div className="relative flex-shrink-0">
              <div className={`h-12 w-12 rounded-lg ${eventConfig.bgColor} flex items-center justify-center text-2xl`}>
                {event.thumbnail || <EventIcon className={`h-6 w-6 ${eventConfig.color}`} />}
              </div>
              {event.isFeatured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight mb-1">{event.title}</h3>
              <Badge
                variant="secondary"
                className={`${eventConfig.bgColor} ${eventConfig.color} text-xs`}
              >
                {eventConfig.label}
              </Badge>
            </div>

            {/* Time until */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <Clock className="h-3 w-3" />
                {timeUntil}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {event.description}
          </p>

          {/* Details */}
          <div className="space-y-2 mb-3">
            {/* Date */}
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{event.location}</span>
            </div>

            {/* Capacity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {localAttendees} / {event.capacity} attending
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    spotsLeft <= 5
                      ? "text-red-600"
                      : spotsLeft <= 15
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}
                </span>
              </div>
              <Progress
                value={capacityPercentage}
                className={`h-1.5 ${
                  capacityPercentage >= 90
                    ? "[&>div]:bg-red-500"
                    : capacityPercentage >= 70
                    ? "[&>div]:bg-orange-500"
                    : "[&>div]:bg-green-500"
                }`}
              />
            </div>

            {/* Organizer */}
            <div className="text-xs text-muted-foreground">
              Organized by <span className="font-medium text-foreground">{event.organizer}</span>
            </div>
          </div>

          {/* RSVP Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(RSVP_CONFIG) as [NonNullable<RSVPStatus>, typeof RSVP_CONFIG[NonNullable<RSVPStatus>]][]).map(
                ([status, config]) => {
                  const Icon = config.icon;
                  const isSelected = rsvpStatus === status;

                  return (
                    <Button
                      key={status}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRSVP(status)}
                      disabled={isRSVPing || spotsLeft === 0}
                      className={`text-xs h-8 ${
                        isSelected
                          ? "bg-primary"
                          : `hover:${config.color.replace("text-", "bg-").replace("dark:", "dark:hover:")}/10`
                      }`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Button>
                  );
                }
              )}
            </div>

            {/* Current RSVP Status */}
            {rsvpStatus && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="h-3 w-3" />
                You're marked as "{RSVP_CONFIG[rsvpStatus].label}"
              </motion.div>
            )}
          </div>

          {/* Add to Calendar Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToCalendar}
            className="w-full mt-2 text-xs h-8"
          >
            <Download className="h-3 w-3 mr-2" />
            Add to Calendar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No upcoming events</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Check back soon for competitions, gradings, and social events!
      </p>
    </motion.div>
  );
}

// Main Upcoming Events Card Component
export default function UpcomingEventsCard() {
  const [showAll, setShowAll] = useState(false);

  // Sort by date (soonest first) and featured status
  const sortedEvents = [...mockUpcomingEvents].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.date - b.date;
  });

  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 5);
  const hasMore = sortedEvents.length > 5;
  const featuredCount = mockUpcomingEvents.filter(e => e.isFeatured).length;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
              {featuredCount > 0 && (
                <Badge variant="default" className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Star className="h-3 w-3 mr-1" />
                  {featuredCount} featured
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Competitions, gradings, and socials</CardDescription>
          </div>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1"
            >
              {showAll ? "Show Less" : "View All"}
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {mockUpcomingEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <ScrollArea className={showAll ? "h-[700px]" : ""}>
              <div className="space-y-3 pr-4">
                {displayedEvents.map((event, index) => (
                  <EventItem key={event._id} event={event} index={index} />
                ))}
              </div>
            </ScrollArea>

            {/* Summary Stats */}
            {mockUpcomingEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t grid grid-cols-4 gap-2"
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-600">
                    {mockUpcomingEvents.filter(e => e.type === "competition").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Comps</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">
                    {mockUpcomingEvents.filter(e => e.type === "grading").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Gradings</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">
                    {mockUpcomingEvents.filter(e => e.type === "social").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Social</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {mockUpcomingEvents.filter(e => e.type === "training-camp").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Camps</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
