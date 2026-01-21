import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  className?: string;
  title: string;
  instructor: string;
  time: string;
  day?: string;
  capacity: number;
  enrolled: number;
  level?: string;
  onBookClick?: () => void;
  isBooked?: boolean;
}

export default function ClassCard({
  className,
  title,
  instructor,
  time,
  day,
  capacity,
  enrolled,
  level = "All Levels",
  onBookClick,
  isBooked = false,
}: ClassCardProps) {
  const spotsLeft = capacity - enrolled;
  const percentFull = (enrolled / capacity) * 100;

  const getStatusColor = () => {
    if (percentFull >= 90) return "text-destructive";
    if (percentFull >= 70) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <Card className={cn("elevation-2 hover:elevation-3 card-enhanced", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="heading-5 mb-2">{title}</CardTitle>
            <CardDescription className="body-small space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              {day && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{day}</span>
                </div>
              )}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capacity Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between body-small">
            <span className="text-muted-foreground">Capacity</span>
            <span className={cn("font-semibold", getStatusColor())}>
              {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                percentFull >= 90
                  ? "bg-destructive"
                  : percentFull >= 70
                  ? "bg-orange-500"
                  : "bg-green-600"
              )}
              style={{ width: `${Math.min(percentFull, 100)}%` }}
            />
          </div>
          <p className="caption text-muted-foreground">
            {enrolled} / {capacity} enrolled
          </p>
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          onClick={onBookClick}
          variant={isBooked ? "outline" : "default"}
          disabled={spotsLeft === 0 && !isBooked}
        >
          {isBooked ? "Cancel Booking" : spotsLeft === 0 ? "Class Full" : "Book Class"}
        </Button>
      </CardContent>
    </Card>
  );
}
