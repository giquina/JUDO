import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ClassBookingModalProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_CLASSES = [
  {
    id: "1",
    name: "Monday Evening Fundamentals",
    day: "Monday",
    time: "19:00 - 20:30",
    coach: "Sensei Yamamoto",
    level: "beginner",
    capacity: 20,
    booked: 12,
    location: "Main Dojo",
    description: "Perfect for beginners learning the basics",
    isBooked: false,
  },
  {
    id: "2",
    name: "Wednesday Intermediate",
    day: "Wednesday",
    time: "19:00 - 21:00",
    coach: "Sensei Chen",
    level: "intermediate",
    capacity: 16,
    booked: 15,
    location: "Main Dojo",
    description: "Advanced techniques and sparring",
    isBooked: true,
  },
  {
    id: "3",
    name: "Friday Advanced Training",
    day: "Friday",
    time: "20:00 - 22:00",
    coach: "Sensei Takahashi",
    level: "advanced",
    capacity: 12,
    booked: 10,
    location: "Competition Area",
    description: "High-intensity training for competitive judoka",
    isBooked: false,
  },
  {
    id: "4",
    name: "Saturday Morning All Levels",
    day: "Saturday",
    time: "10:00 - 12:00",
    coach: "Sensei Yamamoto",
    level: "mixed",
    capacity: 25,
    booked: 18,
    location: "Main Dojo",
    description: "Open session for all belt levels",
    isBooked: false,
  },
  {
    id: "5",
    name: "Tuesday Competition Prep",
    day: "Tuesday",
    time: "18:30 - 20:00",
    coach: "Sensei Chen",
    level: "advanced",
    capacity: 10,
    booked: 9,
    location: "Competition Area",
    description: "Focused training for upcoming competitions",
    isBooked: false,
  },
];

const LEVEL_COLORS = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  mixed: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function ClassBookingModal({ open, onClose }: ClassBookingModalProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedClasses, setBookedClasses] = useState(
    MOCK_CLASSES.filter(c => c.isBooked).map(c => c.id)
  );

  const handleBook = async (classId: string) => {
    setIsLoading(true);
    toast.loading("Booking class...");

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.dismiss();
    toast.success("Class booked successfully!", {
      description: "You'll receive a confirmation email shortly",
      icon: <CheckCircle2 className="h-5 w-5" />,
    });

    setBookedClasses([...bookedClasses, classId]);
    setIsLoading(false);
  };

  const handleCancel = async (classId: string) => {
    setIsLoading(true);
    toast.loading("Cancelling booking...");

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.dismiss();
    toast.success("Booking cancelled", {
      description: "Your spot has been released",
    });

    setBookedClasses(bookedClasses.filter(id => id !== classId));
    setIsLoading(false);
  };

  const getAvailability = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return { text: "Almost Full", color: "text-red-600" };
    if (percentage >= 70) return { text: "Filling Up", color: "text-orange-600" };
    return { text: "Available", color: "text-green-600" };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Book a Class
          </DialogTitle>
          <DialogDescription>
            Choose from available classes this week
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {MOCK_CLASSES.map((cls, index) => {
              const isBooked = bookedClasses.includes(cls.id);
              const availability = getAvailability(cls.booked, cls.capacity);
              const spotsLeft = cls.capacity - cls.booked;

              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedClass === cls.id
                        ? "ring-2 ring-primary"
                        : ""
                    } ${isBooked ? "bg-primary/5 border-primary" : ""}`}
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            {cls.name}
                            {isBooked && (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Booked
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {cls.day}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {cls.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {cls.location}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={`${LEVEL_COLORS[cls.level as keyof typeof LEVEL_COLORS]} capitalize`}
                        >
                          {cls.level}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {cls.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{cls.coach}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {cls.booked}/{cls.capacity}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${availability.color}`}
                            >
                              {spotsLeft} spots left
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {isBooked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancel(cls.id);
                              }}
                              disabled={isLoading}
                            >
                              Cancel Booking
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBook(cls.id);
                              }}
                              disabled={isLoading || spotsLeft === 0}
                              className="bg-gradient-to-r from-primary to-blue-600"
                            >
                              {spotsLeft === 0 ? "Full" : "Book Now"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Booking Policy</p>
            <p className="text-xs mt-1">
              Please cancel at least 2 hours before class time. Late cancellations
              may affect your booking privileges.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
