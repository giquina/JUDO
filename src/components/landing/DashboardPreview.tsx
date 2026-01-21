import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, X } from "lucide-react";
import { fadeInUp, scaleIn } from "@/lib/animation-variants";

interface Hotspot {
  id: number;
  x: string;
  y: string;
  title: string;
  description: string;
}

const hotspots: Hotspot[] = [
  {
    id: 1,
    x: "15%",
    y: "20%",
    title: "Real-time Check-ins",
    description: "See who's on the mat right now. Members appear instantly when they scan their QR code."
  },
  {
    id: 2,
    x: "50%",
    y: "25%",
    title: "Quick Stats",
    description: "Key metrics at a glance: active members, today's attendance, revenue, and engagement."
  },
  {
    id: 3,
    x: "80%",
    y: "30%",
    title: "Attendance Trends",
    description: "Visual charts show attendance patterns, helping you optimize class schedules."
  },
  {
    id: 4,
    x: "25%",
    y: "60%",
    title: "Member List",
    description: "Complete member directory with belt ranks, payment status, and attendance history."
  },
  {
    id: 5,
    x: "70%",
    y: "70%",
    title: "Quick Actions",
    description: "Send announcements, mark attendance, or process payments with one click."
  }
];

export default function DashboardPreview() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-600/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Interactive Demo</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your new{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              command center
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click the hotspots to explore what makes our sensei dashboard so powerful.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Dashboard mockup */}
            <Card className="overflow-hidden shadow-2xl">
              <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 aspect-video">
                {/* Mock dashboard UI */}
                <div className="absolute inset-0 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-8 w-32 bg-primary/20 rounded" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="h-8 w-8 bg-muted rounded-full" />
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                        <div className="h-8 w-16 bg-primary/30 rounded mb-2" />
                        <div className="h-3 w-20 bg-muted/50 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Content area */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <div className="h-3 w-24 bg-muted/50 rounded" />
                            <div className="h-2 w-16 bg-muted/30 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                      <div className="h-full w-full bg-gradient-to-br from-primary/10 to-blue-600/10 rounded" />
                    </div>
                  </div>
                </div>

                {/* Hotspots */}
                {hotspots.map((hotspot) => (
                  <motion.button
                    key={hotspot.id}
                    className="absolute group"
                    style={{
                      left: hotspot.x,
                      top: hotspot.y,
                      transform: "translate(-50%, -50%)"
                    }}
                    onClick={() =>
                      setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={
                        activeHotspot === hotspot.id
                          ? { scale: [1, 1.2, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        activeHotspot === hotspot.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      } transition-colors`}
                    >
                      <Info className="w-5 h-5" />
                    </motion.div>

                    {/* Pulse animation */}
                    {activeHotspot !== hotspot.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{
                          scale: [1, 1.5, 2],
                          opacity: [1, 0.5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* Info popup */}
            <AnimatePresence>
              {activeHotspot !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full mt-4 w-full max-w-md z-50"
                >
                  <Card className="shadow-xl border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">
                          {hotspots.find((h) => h.id === activeHotspot)?.title}
                        </h3>
                        <button
                          onClick={() => setActiveHotspot(null)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-muted-foreground">
                        {hotspots.find((h) => h.id === activeHotspot)?.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Click the {" "}
            <span className="inline-flex items-center gap-1">
              <Info className="w-4 h-4 inline" /> icons
            </span>
            {" "} to explore features
          </p>
        </motion.div>
      </div>
    </section>
  );
}
