import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QrCode, Users, CreditCard, MessageSquare, CheckCircle2
} from "lucide-react";
import { featureShowcases } from "@/lib/landing-data";
import { fadeInUp, slideInRight } from "@/lib/animation-variants";

const iconMap: Record<string, any> = {
  qrcode: QrCode,
  users: Users,
  "credit-card": CreditCard,
  "message-square": MessageSquare
};

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const activeFeature = featureShowcases[activeTab];
  const Icon = iconMap[activeFeature.icon];

  return (
    <section id="demo" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Feature Showcase</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need in{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              one platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the features that make Judo Club Manager the #1 choice for senseis.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {featureShowcases.map((feature, index) => {
            const TabIcon = iconMap[feature.icon];
            return (
              <Button
                key={feature.id}
                variant={activeTab === index ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveTab(index)}
                className={`transition-all ${
                  activeTab === index
                    ? "bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/25"
                    : ""
                }`}
              >
                {TabIcon && <TabIcon className="w-4 h-4 mr-2" />}
                {feature.title}
              </Button>
            );
          })}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Left column - Feature info */}
                <div className="space-y-6">
                  <div>
                    {Icon && (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <h3 className="text-3xl font-bold mb-3">{activeFeature.title}</h3>
                    <p className="text-lg text-muted-foreground">
                      {activeFeature.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {activeFeature.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right column - Visual demo */}
                <div className="relative">
                  {activeTab === 0 && (
                    // QR Check-in demo
                    <motion.div
                      variants={slideInRight}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <div className="w-48 h-48 mx-auto bg-white rounded-lg shadow-inner flex items-center justify-center mb-4">
                          <div className="w-40 h-40 bg-gradient-to-br from-primary to-blue-600 rounded-lg opacity-20" />
                        </div>
                        <p className="text-sm text-muted-foreground">Member's unique QR code</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-700 dark:text-green-400">
                              Check-in successful!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              John Smith - Blue Belt
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    // Member management demo
                    <motion.div
                      variants={slideInRight}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {[
                        { name: "Sarah Mitchell", belt: "Black Belt", status: "active" },
                        { name: "James Chen", belt: "Brown Belt", status: "active" },
                        { name: "Alex Thompson", belt: "Blue Belt", status: "payment-due" }
                      ].map((member, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-muted/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600" />
                              <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.belt}</p>
                              </div>
                            </div>
                            <Badge
                              variant={member.status === "active" ? "secondary" : "outline"}
                              className={
                                member.status === "active"
                                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                  : ""
                              }
                            >
                              {member.status === "active" ? "Active" : "Payment Due"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    // Payments demo
                    <motion.div
                      variants={slideInRight}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <div className="bg-gradient-to-br from-primary/5 to-blue-600/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-muted-foreground">Monthly Revenue</p>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                            +40% ↑
                          </Badge>
                        </div>
                        <p className="text-4xl font-bold mb-6">£2,450</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Collected</span>
                            <span className="font-semibold text-green-500">£2,200</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-semibold">£250</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-semibold mb-2">Recent Transactions</p>
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Member #{i}</span>
                              <span className="font-semibold text-green-500">£40</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 3 && (
                    // Communication demo
                    <motion.div
                      variants={slideInRight}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <p className="font-semibold">New Announcement</p>
                        </div>
                        <div className="bg-background rounded-lg p-4 mb-3">
                          <p className="text-sm mb-2">Class Cancelled Tomorrow</p>
                          <p className="text-xs text-muted-foreground">
                            Due to facility maintenance...
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>Sent to 48 members</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {["Email sent", "Push notification", "In-app alert"].map((method, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">{method}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
