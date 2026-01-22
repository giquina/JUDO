import { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, Calendar, Trophy, Users, Shield, Zap,
  ChevronDown, Check, Star, Menu, X,
  Sun, Moon,
  Award,
  Sparkles, Activity, Target
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import JudoGlossary from "@/components/JudoGlossary";

// Animation variants - optimized for mobile (reduced motion)
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } }
};

// Floating Particle Component
const FloatingParticle = ({ delay = 0, size = 8, x = 0, y = 0 }: { delay?: number; size?: number; x?: number; y?: number }) => (
  <motion.div
    className="particle absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
    }}
  />
);

// Generate particles for bokeh effect
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    size: 4 + Math.random() * 12,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
};

// Belt rank badge component
const BeltBadge = ({ belt }: { belt: string }) => {
  const getBeltColor = (belt: string) => {
    const beltLower = belt.toLowerCase();
    if (beltLower.includes("white")) return "bg-gray-100 text-gray-800 dark:bg-gray-200";
    if (beltLower.includes("yellow")) return "bg-yellow-400 text-yellow-900";
    if (beltLower.includes("orange")) return "bg-orange-500 text-white";
    if (beltLower.includes("green")) return "bg-green-600 text-white";
    if (beltLower.includes("blue")) return "bg-blue-600 text-white";
    if (beltLower.includes("brown")) return "bg-amber-800 text-white";
    if (beltLower.includes("black")) return "bg-black text-white dark:bg-gray-900 dark:border dark:border-gray-700";
    return "bg-gray-500 text-white";
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getBeltColor(belt)}`}>
      <Award className="w-3 h-3" />
      {belt}
    </span>
  );
};

// Features data
const features = [
  {
    icon: QrCode,
    title: "QR Check-in",
    description: "Scan & Go attendance tracking. Judoka check in instantly with their unique QR code.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Belt progression and session history. Track your journey from white to black belt.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Calendar,
    title: "Keiko Schedule",
    description: "Never miss a keiko session. View upcoming sessions and book your spot.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    title: "Sensei Dashboard",
    description: "Real-time attendance management. Sensei see who's training at a glance.",
    gradient: "from-purple-500 to-violet-500"
  },
  {
    icon: Shield,
    title: "Payment Integration",
    description: "Seamless Stripe subscriptions. Secure, automated membership payments.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Zap,
    title: "Mobile First",
    description: "Works on any device. Train anywhere, track everywhere.",
    gradient: "from-indigo-500 to-blue-500"
  }
];

// Pricing data
const pricingPlans = [
  {
    name: "Student",
    price: "15",
    period: "month",
    description: "Perfect for beginners",
    features: [
      "8 sessions per month",
      "QR check-in access",
      "Progress tracking",
      "Class schedule access",
      "Email support"
    ],
    cta: "Start Training",
    popular: false
  },
  {
    name: "Standard",
    price: "25",
    period: "month",
    description: "Most popular choice",
    features: [
      "12 sessions per month",
      "All Student features",
      "Priority keiko booking",
      "Belt grading access",
      "Sensei feedback",
      "Competition entry"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Premium",
    price: "40",
    period: "month",
    description: "For dedicated judoka",
    features: [
      "Unlimited sessions",
      "All Standard features",
      "Priority booking",
      "1-on-1 coaching sessions",
      "Video analysis",
      "Exclusive workshops",
      "Competition coaching"
    ],
    cta: "Go Premium",
    popular: false
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "The QR check-in system is brilliant. I just scan my code and I'm on the mat in seconds. Tracking my sessions has kept me motivated to train consistently.",
    name: "Alex Thompson",
    belt: "Blue Belt",
    rating: 5
  },
  {
    quote: "As a sensei, having real-time attendance data has transformed how I manage keiko sessions. I can see patterns and adjust training intensity based on who's present.",
    name: "Sarah Mitchell",
    belt: "Black Belt 2nd Dan",
    rating: 5
  },
  {
    quote: "Being able to see my progress towards each belt grade keeps me focused. The app reminded me I was close to my next grading and I passed with flying colours!",
    name: "James Chen",
    belt: "Orange Belt",
    rating: 5
  }
];

// FAQ data
const faqs = [
  {
    question: "How does QR check-in work?",
    answer: "Each judoka receives a unique QR code in their profile. When you arrive at the dojo, simply show your QR code to the scanner at reception. Your attendance is instantly recorded, and your sensei can see you've arrived. It takes less than 2 seconds!"
  },
  {
    question: "Can I freeze my membership?",
    answer: "Yes! Life happens, and we understand. You can freeze your membership for up to 30 days per year through your judoka dashboard. Simply go to Settings > Membership > Freeze. Your sessions will be preserved for when you return."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards through our secure Stripe integration. This includes Visa, Mastercard, American Express, and Apple Pay. All payments are processed securely with bank-level encryption."
  },
  {
    question: "Is there a free trial?",
    answer: "Absolutely! New judoka get a 7-day free trial with full access to all features. No credit card required to start. Come try a keiko session and experience the app before committing to a membership."
  }
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Generate particles once
  const particles = useMemo(() => generateParticles(15), []);

  // Parallax scroll effect for hero
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Subtle noise texture overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.span
                className="text-2xl"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                🥋
              </motion.span>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Judo Dojo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 transition-all group-hover:w-full" />
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 transition-all group-hover:w-full" />
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors relative group">
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 transition-all group-hover:w-full" />
              </a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full relative overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-primary/10">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button className="btn-premium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full min-w-[44px] min-h-[44px] w-11 h-11"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-w-[44px] min-h-[44px] w-11 h-11"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1 pb-safe">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors py-3 min-h-[44px] flex items-center text-base active:bg-muted rounded-lg px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors py-3 min-h-[44px] flex items-center text-base active:bg-muted rounded-lg px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors py-3 min-h-[44px] flex items-center text-base active:bg-muted rounded-lg px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <div className="flex flex-col gap-3 pt-4 mt-2 border-t">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full min-h-[44px] text-base">Sign In</Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full min-h-[44px] text-base bg-gradient-to-r from-primary to-blue-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Gradient Mesh Background */}
        <div className="gradient-mesh absolute inset-0" />

        {/* Gradient Orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />

        {/* Floating Particles / Bokeh Effect */}
        <div className="particles">
          {particles.map((particle) => (
            <FloatingParticle
              key={particle.id}
              delay={particle.delay}
              size={particle.size}
              x={particle.x}
              y={particle.y}
            />
          ))}
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 py-20 md:py-32 relative"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating badges with shimmer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" as const }}
              >
                <Badge variant="secondary" className="badge-shimmer px-4 py-1.5 text-sm backdrop-blur-md bg-secondary/60 border border-border/50">
                  <QrCode className="w-3.5 h-3.5 mr-1.5" /> QR Check-in
                </Badge>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" as const }}
              >
                <Badge variant="secondary" className="badge-shimmer px-4 py-1.5 text-sm backdrop-blur-md bg-secondary/60 border border-border/50">
                  <Trophy className="w-3.5 h-3.5 mr-1.5" /> Belt Tracking
                </Badge>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeInOut" as const }}
              >
                <Badge variant="secondary" className="badge-shimmer px-4 py-1.5 text-sm backdrop-blur-md bg-secondary/60 border border-border/50">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> Smart Scheduling
                </Badge>
              </motion.div>
            </motion.div>

            {/* Main headline with animated underline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 px-2"
            >
              Train Smarter.{" "}
              <span className="animated-underline">
                <span className="gradient-text-animate">
                  Track Progress.
                </span>
              </span>{" "}
              <br className="hidden sm:block" />
              Level Up.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto px-4 leading-relaxed"
            >
              The modern membership management platform for martial arts clubs.
              Streamline attendance, track belt progression, and grow your dojo.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
            >
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="btn-premium w-full sm:w-auto text-lg px-8 py-6 min-h-[56px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 min-h-[56px] backdrop-blur-sm border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Animated Judo Gi with glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" as const }}
              className="mb-16"
            >
              <motion.span
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.05, 1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" as const }}
                className="gi-glow text-8xl sm:text-9xl md:text-[12rem] inline-block"
              >
                🥋
              </motion.span>
            </motion.div>

            {/* Stats bar with icons and glass cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4"
            >
              {[
                { value: "100+", label: "Active Judoka", icon: Users },
                { value: "3", label: "Expert Sensei", icon: Award },
                { value: "500+", label: "Monthly Check-ins", icon: Activity },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="stat-card text-center group cursor-default"
                >
                  <div className="stat-card-icon opacity-50 group-hover:opacity-100 transition-opacity">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1">
              <Sparkles className="w-3 h-3 mr-1" /> Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Everything you need to{" "}
              <span className="animated-underline">
                <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  run your club
                </span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              From check-in to championship, we've got every aspect of your martial arts journey covered.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="feature-card h-full group">
                  <CardHeader className="pb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring" as const, stiffness: 400 }}
                      className={`feature-icon-bg w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 flex items-center justify-center mb-4`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1">
              <Target className="w-3 h-3 mr-1" /> Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Simple,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                transparent
              </span>{" "}
              pricing
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your training goals. All plans include a 7-day free trial.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className={plan.popular ? "md:-mt-4 md:mb-4" : ""}
              >
                <Card
                  className={`pricing-card h-full relative overflow-hidden ${
                    plan.popular
                      ? "pricing-card-popular border-2 border-primary shadow-2xl shadow-primary/20"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <>
                      {/* Shine effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5" />
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="popular-badge-glow bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-1.5 text-sm font-semibold">
                          <Star className="w-3.5 h-3.5 mr-1.5 fill-current" /> Most Popular
                        </Badge>
                      </div>
                    </>
                  )}
                  <CardHeader className="text-center pt-10 pb-6">
                    <CardTitle className="text-2xl md:text-3xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                        £{plan.price}
                      </span>
                      <span className="text-muted-foreground text-lg">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: featureIndex * 0.05 }}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular
                              ? "bg-gradient-to-r from-primary to-blue-600"
                              : "bg-green-500"
                          }`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm md:text-base">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Link to="/login" className="block">
                      <Button
                        className={`w-full text-base py-6 ${
                          plan.popular
                            ? "btn-premium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25"
                            : "hover:bg-primary hover:text-primary-foreground"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1">
              <Star className="w-3 h-3 mr-1 fill-current" /> Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                judoka everywhere
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our judoka and sensei have to say about their experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="testimonial-card h-full glass-card relative overflow-hidden">
                  {/* Gradient quote mark */}
                  <span className="quote-mark">"</span>

                  <CardContent className="pt-10 pb-8 px-6 relative">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-8 italic leading-relaxed min-h-[120px]">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      {/* Avatar with gradient border */}
                      <div className="avatar-gradient">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <BeltBadge belt={testimonial.belt} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Judo Dojo Manager.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    openFaq === index
                      ? "border-primary shadow-lg shadow-primary/10"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3, type: "spring" as const }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        openFaq === index ? "bg-primary text-white" : "bg-muted"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Learn Judo Terms Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1">
              <Sparkles className="w-3 h-3 mr-1" /> Education
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Learn the{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Language of Judo
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Master authentic Japanese terminology used in dojos worldwide
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={scaleIn}
            className="max-w-5xl mx-auto"
          >
            <JudoGlossary maxHeight="500px" />
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        {/* Floating particles */}
        <div className="particles">
          {particles.slice(0, 8).map((particle) => (
            <FloatingParticle
              key={particle.id}
              delay={particle.delay}
              size={particle.size * 0.8}
              x={particle.x}
              y={particle.y}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" as const }}
              className="gi-glow text-7xl md:text-8xl mb-8 inline-block"
            >
              🥋
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to transform{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                your club?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Join hundreds of martial arts clubs already using Judo Dojo Manager to streamline their operations.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login">
                <Button
                  size="lg"
                  className="btn-premium text-lg px-10 py-7 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-2xl shadow-primary/30 hover:shadow-primary/50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required. Start your 7-day free trial today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {/* Logo and tagline */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <motion.span
                  className="text-3xl"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  🥋
                </motion.span>
                <span className="font-bold text-2xl bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Judo Dojo
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed mb-6">
                The modern membership management platform for martial arts clubs.
                Train smarter, track progress, level up.
              </p>
              {/* Social links */}
              <div className="flex gap-4">
                {[
                  { icon: "twitter", path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                  { icon: "github", path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
                  { icon: "instagram", path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                {["About", "Contact", "Careers", "Blog"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                {["Privacy", "Terms", "Cookies", "Security"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Judo Dojo Manager. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <span className="text-red-500">♥</span> for martial artists
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
