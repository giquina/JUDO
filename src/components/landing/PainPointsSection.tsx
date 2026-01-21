import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, CreditCard, Users, Clock, UserX, Trophy,
  CheckCircle2, X
} from "lucide-react";
import { painPoints } from "@/lib/landing-data";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";

const iconMap: Record<string, any> = {
  qrcode: QrCode,
  "credit-card": CreditCard,
  users: Users,
  clock: Clock,
  "user-x": UserX,
  trophy: Trophy
};

export default function PainPointsSection() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Problems We Solve</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Stop struggling with{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              outdated systems
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every sensei faces these challenges. We've built the solution.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {painPoints.map((painPoint, index) => {
            const Icon = iconMap[painPoint.icon];
            const isFlipped = flippedCards.has(index);

            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="perspective-1000"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="relative h-full cursor-pointer"
                  onClick={() => toggleCard(index)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front of card - Problem */}
                  <Card
                    className="absolute inset-0 h-full p-6 backface-hidden hover:shadow-lg transition-shadow"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          <X className="w-6 h-6 text-destructive" />
                        </div>
                        {Icon && (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-3">
                        {painPoint.problem}
                      </h3>

                      <div className="mt-auto pt-4 border-t">
                        <p className="text-sm text-primary font-medium">
                          Tap to see solution →
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Back of card - Solution */}
                  <Card
                    className="absolute inset-0 h-full p-6 backface-hidden bg-gradient-to-br from-primary/5 to-blue-600/5 hover:shadow-lg transition-shadow"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        {Icon && (
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-3 text-primary">
                        The Solution
                      </h3>

                      <p className="text-muted-foreground mb-4 flex-grow">
                        {painPoint.solution}
                      </p>

                      {painPoint.stat && (
                        <div className="mt-auto pt-4 border-t">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                            {painPoint.stat}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Click any card to see how we solve each problem
          </p>
        </motion.div>
      </div>
    </section>
  );
}
