import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, UserPlus } from "lucide-react";
import BeltBadge from "@/components/BeltBadge";
import type { BeltRank } from "@/components/BeltBadge";

interface TrainingPartner {
  id: string;
  name: string;
  avatar?: string;
  beltRank: BeltRank;
  status: "online" | "offline" | "training";
  lastSeen?: string;
  mutualSessions?: number;
}

interface TrainingPartnersListProps {
  partners: TrainingPartner[];
  onViewProfile?: (partnerId: string) => void;
  onMessage?: (partnerId: string) => void;
}

const STATUS_COLORS = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  training: "bg-blue-500",
};

const STATUS_LABELS = {
  online: "Online",
  offline: "Offline",
  training: "Training",
};

export default function TrainingPartnersList({
  partners,
  onViewProfile,
  onMessage,
}: TrainingPartnersListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Training Partners
        </CardTitle>
        <CardDescription>Your regular training buddies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {partners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                No training partners yet
              </p>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Find Partners
              </Button>
            </div>
          ) : (
            partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => onViewProfile?.(partner.id)}
              >
                {/* Avatar with Status */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-muted">
                    <AvatarImage src={partner.avatar} />
                    <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                      STATUS_COLORS[partner.status]
                    }`}
                    title={STATUS_LABELS[partner.status]}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{partner.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <BeltBadge rank={partner.beltRank} showTooltip={false} className="text-xs py-0 px-2" />
                    {partner.mutualSessions && (
                      <span className="text-xs text-muted-foreground">
                        {partner.mutualSessions} sessions together
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Action */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessage?.(partner.id);
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>

        {partners.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className="w-full" size="sm">
              View All Partners
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
