import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  User,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle2,
  Calendar,
  UserPlus,
  X,
  Download,
  Repeat,
  AlertCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCalendarData, type JudoClass } from "@/lib/mockCalendarData";

interface ClassBookingModalProps {
  classInfo: JudoClass & { date?: Date };
  onClose: () => void;
}

export default function ClassBookingModal({ classInfo, onClose }: ClassBookingModalProps) {
  const [isBooked, setIsBooked] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [recurringBooking, setRecurringBooking] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  const { trainingPartners } = mockCalendarData;

  // Check if class is full
  const isFull = classInfo.currentBookings >= classInfo.capacity;
  const capacityPercentage = (classInfo.currentBookings / classInfo.capacity) * 100;

  // Mock attendees (in real app, would come from API)
  const attendees = trainingPartners.slice(0, Math.min(classInfo.currentBookings, 8));
  const remainingAttendees = classInfo.currentBookings - attendees.length;

  // Handle booking
  const handleBook = () => {
    if (isFull) {
      // Add to waitlist
      setIsOnWaitlist(true);
      toast.success("Added to waitlist", {
        description: "We'll notify you if a spot opens up!",
      });
    } else {
      // Book the class
      setIsBooked(true);
      toast.success(
        recurringBooking
          ? "Recurring booking confirmed!"
          : "Class booked successfully!",
        {
          description: recurringBooking
            ? `You're booked for ${classInfo.name} every ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][classInfo.dayOfWeek]}`
            : `See you at ${classInfo.startTime} on ${classInfo.date?.toLocaleDateString()}`,
        }
      );
    }
  };

  // Handle cancel booking
  const handleCancelBooking = () => {
    setIsBooked(false);
    setIsOnWaitlist(false);
    toast.info("Booking cancelled", {
      description: "Your spot has been released.",
    });
  };

  // Add to calendar
  const handleAddToCalendar = () => {
    toast.success("Added to calendar", {
      description: "Class has been added to your device calendar.",
    });
  };

  // Difficulty stars
  const renderDifficultyStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={cn(
              "w-2 h-2 rounded-full",
              star <= classInfo.difficulty ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl pr-8">{classInfo.name}</DialogTitle>
          <DialogDescription>
            {classInfo.date?.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                style={{ borderColor: classInfo.color }}
                className="font-medium"
              >
                {classInfo.level}
              </Badge>
              <Badge variant="secondary">{classInfo.type}</Badge>
              {isBooked && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Booked
                </Badge>
              )}
              {isOnWaitlist && (
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Waitlist
                </Badge>
              )}
              {isFull && !isBooked && (
                <Badge variant="destructive">
                  Full
                </Badge>
              )}
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Time & Duration</div>
                  <div className="text-sm text-muted-foreground">
                    {classInfo.startTime} ({classInfo.duration} minutes)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Coach</div>
                  <div className="text-sm text-muted-foreground">
                    {classInfo.coach}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {classInfo.location}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Difficulty</div>
                  <div className="flex items-center gap-2">
                    {renderDifficultyStars()}
                    <span className="text-xs text-muted-foreground">
                      {classInfo.difficulty}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Capacity</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {classInfo.currentBookings}/{classInfo.capacity} spots filled
                </span>
              </div>
              <Progress value={capacityPercentage} className="h-2" />
              {capacityPercentage >= 80 && capacityPercentage < 100 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Almost full - book soon!</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                About This Class
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {classInfo.description}
              </p>
            </div>

            {/* Required Equipment */}
            {classInfo.requiredEquipment.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Required Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {classInfo.requiredEquipment.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Who else is going */}
            {attendees.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Who's Going ({classInfo.currentBookings})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAttendees(!showAttendees)}
                  >
                    {showAttendees ? "Hide" : "Show all"}
                  </Button>
                </div>

                <AnimatePresence>
                  {showAttendees ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {attendees.map((partner, index) => (
                        <motion.div
                          key={partner.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {partner.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{partner.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {partner.beltRank} belt
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {partner.attendanceMatch}% match
                          </Badge>
                        </motion.div>
                      ))}
                      {remainingAttendees > 0 && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          + {remainingAttendees} more
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {attendees.slice(0, 5).map((partner) => (
                        <div
                          key={partner.id}
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium border-2 border-background"
                          style={{ marginLeft: "-8px" }}
                        >
                          {partner.avatar}
                        </div>
                      ))}
                      {classInfo.currentBookings > 5 && (
                        <div className="ml-2 text-sm text-muted-foreground">
                          +{classInfo.currentBookings - 5} more
                        </div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Recurring booking option (only for future bookings) */}
            {!isBooked && classInfo.recurring && (
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                <Checkbox
                  id="recurring"
                  checked={recurringBooking}
                  onCheckedChange={(checked) => setRecurringBooking(checked as boolean)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor="recurring"
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    <Repeat className="w-4 h-4" />
                    Book recurring weekly
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically book this class every{" "}
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][classInfo.dayOfWeek]}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          {/* Cancel button */}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {/* Action buttons */}
          {isBooked || isOnWaitlist ? (
            <>
              <Button
                variant="outline"
                onClick={handleAddToCalendar}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Add to Calendar
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel {isOnWaitlist ? "Waitlist" : "Booking"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleAddToCalendar}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </Button>
              <Button
                onClick={handleBook}
                className="gap-2"
                variant={isFull ? "outline" : "default"}
              >
                {isFull ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Join Waitlist
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Book Class
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
