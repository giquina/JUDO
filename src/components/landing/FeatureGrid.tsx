import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, LayoutDashboard, CreditCard, User, Trophy, BarChart,
  MessageSquare, Calendar, Smartphone, FileText, Shield, Headphones
} from "lucide-react";
import { allFeatures } from "@/lib/landing-data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animation-variants";

const iconMap: Record<string, any> = {
  qrcode: QrCode,
  "layout-dashboard": LayoutDashboard,
  "credit-card": CreditCard,
  user: User,
  trophy: Trophy,
  "bar-chart": BarChart,
  "message-square": MessageSquare,
  calendar: Calendar,
  smartphone: Smartphone,
  "file-text": FileText,
  shield: Shield,
  headphones: Headphones
};

export default function FeatureGrid() {
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
          <Badge variant="outline" className="mb-4">Complete Feature Set</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              run your dojo
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From check-in to reporting, all the tools you need in one platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {allFeatures.map((feature) => {
            const Icon = iconMap[feature.icon];

            return (
              <motion.div key={feature.id} variants={scaleIn}>
                <Card className="h-full group hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center mb-3 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-colors"
                    >
                      {Icon && <Icon className="w-6 h-6 text-primary" />}
                    </motion.div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-500/10 text-green-700 dark:text-green-400"
                    >
                      {feature.benefit}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
