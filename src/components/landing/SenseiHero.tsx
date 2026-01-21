import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp, Sparkles } from "lucide-react";
import { fadeInUp, fadeInDown, staggerContainer } from "@/lib/animation-variants";

export default function SenseiHero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Main content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            {/* Trust badge */}
            <motion.div variants={fadeInDown} className="mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-secondary/80">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Trusted by 500+ Dojos Worldwide
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Spend More Time{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Teaching
              </span>
              ,<br />
              Less Time Managing
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              The all-in-one club management platform that senseis love. Automate attendance,
              payments, and admin so you can focus on what matters: teaching great judo.
            </motion.p>

            {/* Quick benefits */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>Save 10+ hours/week</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>Boost retention 30%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Increase revenue 40%</span>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.p
              variants={fadeInUp}
              className="text-sm text-muted-foreground"
            >
              ✓ 14-day free trial &nbsp; • &nbsp; ✓ No credit card required &nbsp; • &nbsp; ✓ Cancel anytime
            </motion.p>
          </motion.div>

          {/* Right column - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 z-20"
            >
              <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Real-time Check-ins</p>
                    <p className="text-xs text-muted-foreground">+5 new today</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -right-4 z-20"
            >
              <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Revenue Up</p>
                    <p className="text-xs text-muted-foreground">+40% this month</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div
              animate={{
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Mock dashboard header */}
              <div className="bg-primary/5 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Sensei Dashboard</p>
                    <p className="text-xs text-muted-foreground">Welcome back, Sensei</p>
                  </div>
                </div>
              </div>

              {/* Mock content */}
              <div className="p-4 space-y-3">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">48</p>
                    <p className="text-xs text-muted-foreground">Active Members</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-500">15</p>
                    <p className="text-xs text-muted-foreground">Today's Check-ins</p>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg p-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20" />
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded w-24 mb-1" />
                        <div className="h-2 bg-muted/50 rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
