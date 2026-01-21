import { TrendingUp, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface TrainingPartner {
  id: string;
  name: string;
  avatar?: string;
  belt: string;
  beltColor: string;
  sessionsWithYou: number;
  lastTrained?: Date;
  specialty?: string;
}

export interface PartnerWidgetProps {
  partner: TrainingPartner;
  onClick?: () => void;
  className?: string;
}

const beltColors: Record<string, string> = {
  white: "bg-gray-100 text-gray-900",
  yellow: "bg-yellow-400 text-yellow-900",
  orange: "bg-orange-500 text-white",
  green: "bg-green-500 text-white",
  blue: "bg-blue-500 text-white",
  brown: "bg-amber-700 text-white",
  black: "bg-black text-white",
};

export function PartnerWidget({ partner, onClick, className }: PartnerWidgetProps) {
  const initials = partner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 cursor-pointer transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Header with avatar */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={partner.avatar} alt={partner.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{partner.name}</h3>
          <span
            className={cn(
              "inline-block text-xs font-medium px-2 py-0.5 rounded mt-1",
              beltColors[partner.beltColor.toLowerCase()] || beltColors.white
            )}
          >
            {partner.belt}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Sessions</span>
          </div>
          <p className="text-2xl font-bold">{partner.sessionsWithYou}</p>
        </div>

        {partner.lastTrained && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">Last trained</span>
            </div>
            <p className="text-sm font-medium">
              {Math.floor(
                (Date.now() - partner.lastTrained.getTime()) / (1000 * 60 * 60 * 24)
              )}{" "}
              days ago
            </p>
          </div>
        )}
      </div>

      {/* Specialty */}
      {partner.specialty && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Specialty: {partner.specialty}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
