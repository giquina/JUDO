import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PartyPopper, ArrowRight, Calendar, QrCode, Trophy } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Confetti particle type
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  duration: number;
  borderRadius: string;
}

// Confetti colors
const confettiColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#DDA0DD", // Plum
  "#98D8C8", // Seafoam
  "#F7DC6F", // Gold
  "#BB8FCE", // Purple
  "#85C1E9", // Blue
  "#F8B500", // Orange
];

// Confetti component
function Confetti() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  const createParticles = useCallback(() => {
    const newParticles: ConfettiParticle[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        scale: 0.5 + Math.random() * 0.5,
        velocityX: (Math.random() - 0.5) * 3,
        velocityY: 2 + Math.random() * 3,
        rotationSpeed: (Math.random() - 0.5) * 10,
        duration: 3 + Math.random() * 2,
        borderRadius: Math.random() > 0.5 ? "50%" : "0%",
      });
    }

    setParticles(newParticles);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      createParticles();
    });

    // Clear particles after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [createParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            rotate: particle.rotation,
            scale: particle.scale,
          }}
          animate={{
            x: `${particle.x + particle.velocityX * 30}vw`,
            y: "110vh",
            rotate: particle.rotation + particle.rotationSpeed * 100,
          }}
          transition={{
            duration: particle.duration,
            ease: "linear" as const,
          }}
          style={{
            backgroundColor: particle.color,
            borderRadius: particle.borderRadius,
          }}
        />
      ))}
    </div>
  );
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

// Next steps data
const nextSteps = [
  {
    icon: QrCode,
    title: "Get Your QR Code",
    description: "Your unique check-in QR code is ready in your member dashboard."
  },
  {
    icon: Calendar,
    title: "Book Your First Class",
    description: "Browse the schedule and reserve your spot in upcoming sessions."
  },
  {
    icon: Trophy,
    title: "Start Tracking Progress",
    description: "Your journey to the next belt starts now. Every session counts!"
  }
];

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const sessionId = searchParams.get("session_id");
  const prefersReducedMotion = useReducedMotion();

  // Get plan name from URL or default
  const planParam = searchParams.get("plan");
  const planName = planParam || "Standard";

  useEffect(() => {
    // Stop confetti after initial burst
    const timeout = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Confetti animation - disabled for users who prefer reduced motion */}
      {showConfetti && !prefersReducedMotion && <Confetti />}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Success icon */}
            <motion.div variants={scaleIn} className="mb-6">
              <div className="relative inline-block">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: 3,
                    duration: 0.5,
                  }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-yellow-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Welcome message */}
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-4 px-4 py-1">
                Subscription Active
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {planName}!
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your subscription is now active. You're all set to start your judo journey with full access to all {planName} features.
              </p>
            </motion.div>

            {/* Animated judo gi */}
            <motion.div
              variants={scaleIn}
              className="mb-8"
            >
              <motion.span
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut" as const
                }}
                className="text-6xl inline-block"
              >
                🥋
              </motion.span>
            </motion.div>

            {/* Next steps card */}
            <motion.div variants={fadeInUp}>
              <Card className="mb-8 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-6">What's next?</h2>
                  <div className="grid gap-6">
                    {nextSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.15 }}
                        className="flex items-start gap-4 text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/member">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-600/90 hover:to-blue-600/90 shadow-lg shadow-violet-600/25"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </motion.div>

            {/* Session ID for reference */}
            {sessionId && (
              <motion.p
                variants={fadeInUp}
                className="text-xs text-muted-foreground mt-8"
              >
                Transaction ID: {sessionId.slice(0, 20)}...
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{" "}
            <a href="mailto:support@judoclub.com" className="text-primary hover:underline">
              support@judoclub.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
