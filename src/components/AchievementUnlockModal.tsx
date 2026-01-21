import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Trophy } from "lucide-react";
import { toast } from "sonner";
import type { Achievement } from "@/data/gamificationMockData";

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
}

export default function AchievementUnlockModal({
  achievement,
  isOpen,
  onClose,
  onViewAll,
}: AchievementUnlockModalProps) {
  useEffect(() => {
    if (isOpen && achievement) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Burst from left
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });

        // Burst from right
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      // Cleanup on unmount or close
      return () => clearInterval(interval);
    }
  }, [isOpen, achievement]);

  const handleShare = (platform: "twitter" | "instagram") => {
    if (!achievement) return;

    if (platform === "twitter") {
      const text = encodeURIComponent(
        `🎉 Just unlocked the "${achievement.title}" achievement in JUDO Club! ${achievement.icon}\n\n${achievement.description}\n\n#JudoClub #Achievement`
      );
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    } else {
      // For Instagram, we'll just copy to clipboard since Instagram doesn't have a web share URL
      const text = `🎉 Just unlocked the "${achievement.title}" achievement in JUDO Club! ${achievement.icon}\n\n${achievement.description}`;
      navigator.clipboard.writeText(text);
      toast.success("Achievement copied to clipboard! Share it on Instagram Stories.");
    }
  };

  if (!achievement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <DialogHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-7xl">{achievement.icon}</span>
                  </div>
                </motion.div>

                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  Achievement Unlocked!
                </DialogTitle>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 pt-4"
                >
                  <h3 className="text-2xl font-bold text-foreground">{achievement.title}</h3>
                  <DialogDescription className="text-base">
                    {achievement.description}
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              <DialogFooter className="flex-col sm:flex-col space-y-2 pt-6">
                {/* Share Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-2 w-full"
                >
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleShare("twitter")}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleShare("instagram")}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Instagram Story
                  </Button>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-2 w-full"
                >
                  {onViewAll && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        onViewAll();
                        onClose();
                      }}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View All Badges
                    </Button>
                  )}
                  <Button
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
                    onClick={onClose}
                  >
                    Awesome!
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
