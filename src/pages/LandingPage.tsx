import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, Calendar, Trophy, Users, Shield, Zap,
  ChevronDown, ChevronUp, Check, Star, Menu, X,
  Sun, Moon, Play, ArrowRight, Award, Target, Heart
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import OptimizedImage from "@/components/OptimizedImage";
import ImageGallery from "@/components/ImageGallery";
import PhoneMockup from "@/components/PhoneMockup";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Features data
const features = [
  {
    icon: QrCode,
    title: "QR Check-in",
    description: "Scan & Go attendance tracking. Members check in instantly with their unique QR code."
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Belt progression and session history. Track your journey from white to black belt."
  },
  {
    icon: Calendar,
    title: "Class Schedule",
    description: "Never miss a training session. View upcoming classes and book your spot."
  },
  {
    icon: Users,
    title: "Coach Dashboard",
    description: "Real-time attendance management. Coaches see who's training at a glance."
  },
  {
    icon: Shield,
    title: "Payment Integration",
    description: "Seamless Stripe subscriptions. Secure, automated membership payments."
  },
  {
    icon: Zap,
    title: "Mobile First",
    description: "Works on any device. Train anywhere, track everywhere."
  }
];

// Pricing data
const pricingPlans = [
  {
    name: "Student",
    price: "25",
    period: "month",
    description: "For university students",
    badge: "University Email Required",
    features: [
      "8 sessions per month",
      "QR check-in access",
      "Progress tracking",
      "Class schedule access",
      "Email support",
      "Valid .ac.uk email required"
    ],
    cta: "Start Training",
    popular: false,
    studentOnly: true
  },
  {
    name: "Standard",
    price: "40",
    period: "month",
    description: "Most popular choice",
    features: [
      "12 sessions per month",
      "QR check-in access",
      "Progress tracking",
      "Priority class booking",
      "Belt grading access",
      "Coach feedback",
      "Competition entry"
    ],
    cta: "Get Started",
    popular: true,
    studentOnly: false
  },
  {
    name: "Premium",
    price: "60",
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
    popular: false,
    studentOnly: false
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
    quote: "As a coach, having real-time attendance data has transformed how I manage classes. I can see patterns and adjust training intensity based on who's present.",
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
    answer: "Each member receives a unique QR code in their profile. When you arrive at the dojo, simply show your QR code to the scanner at reception. Your attendance is instantly recorded, and coaches can see you've arrived. It takes less than 2 seconds!"
  },
  {
    question: "Can I freeze my membership?",
    answer: "Yes! Life happens, and we understand. You can freeze your membership for up to 30 days per year through your member dashboard. Simply go to Settings > Membership > Freeze. Your sessions will be preserved for when you return."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards through our secure Stripe integration. This includes Visa, Mastercard, American Express, and Apple Pay. All payments are processed securely with bank-level encryption."
  },
  {
    question: "Is there a free trial?",
    answer: "Absolutely! New members get a 7-day free trial with full access to all features. No credit card required to start. Come try a class and experience the app before committing to a membership."
  }
];

// Hero carousel images
const heroImages = [
  { id: "1", category: "judo,throw,action", alt: "Judo throw in action" },
  { id: "2", category: "martial-arts,training,dojo", alt: "Training session with coach" },
  { id: "3", category: "judo,competition,sports", alt: "Competition moment" },
  { id: "4", category: "martial-arts,ceremony,achievement", alt: "Belt ceremony celebration" }
];

// Gallery images
const galleryImages = [
  { id: "g1", category: "training", alt: "Group training session", width: 800, height: 600 },
  { id: "g2", category: "training", alt: "Partner drills practice", width: 800, height: 600 },
  { id: "g3", category: "training", alt: "Warmup exercises", width: 800, height: 600 },
  { id: "g4", category: "competitions", alt: "Tournament action", width: 800, height: 600 },
  { id: "g5", category: "competitions", alt: "Victory celebration", width: 800, height: 600 },
  { id: "g6", category: "competitions", alt: "Award ceremony", width: 800, height: 600 },
  { id: "g7", category: "gradings", alt: "Belt grading test", width: 800, height: 600 },
  { id: "g8", category: "gradings", alt: "New belt presentation", width: 800, height: 600 },
  { id: "g9", category: "socials", alt: "Team dinner event", width: 800, height: 600 },
  { id: "g10", category: "socials", alt: "Club social gathering", width: 800, height: 600 }
];

// App screenshots for phone mockup
const appScreenshots = [
  {
    id: "s1",
    title: "Dashboard",
    description: "Track your progress and upcoming classes",
    category: "app,dashboard,ui"
  },
  {
    id: "s2",
    title: "QR Check-in",
    description: "Instant attendance with your personal QR code",
    category: "app,qr-code,mobile"
  },
  {
    id: "s3",
    title: "Class Schedule",
    description: "View and book upcoming training sessions",
    category: "app,calendar,schedule"
  },
  {
    id: "s4",
    title: "Group Chat",
    description: "Connect with teammates and coaches",
    category: "app,chat,communication"
  }
];

// Member profiles
const memberProfiles = [
  {
    id: "m1",
    name: "Alex Thompson",
    belt: "Blue Belt",
    beltColor: "blue",
    quote: "From zero to hero in 18 months. Best decision ever!",
    category: "portrait,athlete,sports"
  },
  {
    id: "m2",
    name: "Sarah Mitchell",
    belt: "Black Belt 2nd Dan",
    beltColor: "black",
    quote: "Teaching here has been the highlight of my judo career.",
    category: "portrait,instructor,martial-arts"
  },
  {
    id: "m3",
    name: "James Chen",
    belt: "Orange Belt",
    beltColor: "orange",
    quote: "The community here is incredibly supportive and motivating.",
    category: "portrait,athlete,training"
  },
  {
    id: "m4",
    name: "Emma Rodriguez",
    belt: "Green Belt",
    beltColor: "green",
    quote: "Finally found a club that takes skill development seriously.",
    category: "portrait,athlete,fitness"
  }
];

// Coach profiles
const coaches = [
  {
    id: "c1",
    name: "Sensei Tanaka",
    title: "Head Coach",
    credentials: "5th Dan Black Belt",
    experience: "25 years of teaching experience",
    specialties: ["Competition Training", "Technical Excellence", "Youth Development"],
    category: "portrait,instructor,martial-arts"
  },
  {
    id: "c2",
    name: "Coach Martinez",
    title: "Assistant Coach",
    credentials: "3rd Dan Black Belt",
    experience: "15 years competitive experience",
    specialties: ["Beginners", "Fitness Training", "Kata Instruction"],
    category: "portrait,instructor,training"
  }
];

// Success stories
const successStories = [
  {
    id: "ss1",
    name: "Tom Wilson",
    achievement: "White to Black Belt Journey",
    timeframe: "6 years",
    highlight: "Won regional championship",
    category: "martial-arts,achievement,success"
  },
  {
    id: "ss2",
    name: "Lisa Park",
    achievement: "From Beginner to Instructor",
    timeframe: "4 years",
    highlight: "Now teaching youth classes",
    category: "martial-arts,instructor,success"
  }
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [clubCount, setClubCount] = useState(0);
  const [checkInCount, setCheckInCount] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const memberTarget = 500;
    const clubTarget = 10;
    const checkInTarget = 2500;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setMemberCount(Math.floor(memberTarget * progress));
      setClubCount(Math.floor(clubTarget * progress));
      setCheckInCount(Math.floor(checkInTarget * progress));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 transform-origin-left z-50"
        style={{
          scaleX: 0
        }}
        whileInView={{
          scaleX: 1
        }}
        viewport={{ once: false, amount: 0 }}
      />

      {/* Floating Try Demo Button - Mobile Only */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="md:hidden fixed bottom-20 right-4 z-30"
      >
        <Link to="/login">
          <Button
            size="lg"
            className="rounded-full shadow-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 py-6"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Demo
          </Button>
        </Link>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🥋</span>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Judo Club
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <Link to="/for-senseis" className="text-muted-foreground hover:text-foreground transition-colors">
                For Instructors
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              className="md:hidden border-t bg-background"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <Link
                  to="/for-senseis"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Instructors
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-blue-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Mobile First with Image Carousel */}
      <section className="relative overflow-hidden min-h-[90vh] md:min-h-screen flex items-center">
        {/* Hero Image Carousel Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <OptimizedImage
                category={heroImages[currentHeroImage].category}
                alt={heroImages[currentHeroImage].alt}
                width={1600}
                height={900}
                className="w-full h-full"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 md:from-black/70 md:via-black/50 md:to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Carousel indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentHeroImage
                    ? "bg-white w-8"
                    : "bg-white/50 w-1.5"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white"
            >
              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-6"
              >
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                  <Users className="w-3 h-3 mr-1" /> {memberCount}+ Members
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                  <Trophy className="w-3 h-3 mr-1" /> {clubCount}+ Clubs
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" /> 5-Star Rated
                </Badge>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
              >
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  Judo Journey
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed"
              >
                The all-in-one platform for martial arts clubs. QR check-ins, progress tracking,
                and seamless management - all in your pocket.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-xl shadow-blue-500/30 text-white border-0"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Trust Statement */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-gray-300"
              >
                No credit card required • 7-day free trial • Cancel anytime
              </motion.p>
            </motion.div>

            {/* Right: Stats Cards (Desktop only) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:grid grid-cols-2 gap-4"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <Award className="w-10 h-10 mb-4 text-yellow-400" />
                  <h3 className="text-3xl font-bold mb-2">{checkInCount}+</h3>
                  <p className="text-gray-200">Monthly Check-ins</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <Target className="w-10 h-10 mb-4 text-blue-400" />
                  <h3 className="text-3xl font-bold mb-2">95%</h3>
                  <p className="text-gray-200">Member Retention</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <Trophy className="w-10 h-10 mb-4 text-purple-400" />
                  <h3 className="text-3xl font-bold mb-2">50+</h3>
                  <p className="text-gray-200">Belt Graduations</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <Heart className="w-10 h-10 mb-4 text-red-400" />
                  <h3 className="text-3xl font-bold mb-2">4.9/5</h3>
                  <p className="text-gray-200">Average Rating</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Mobile CTA Bar - Sticky Bottom */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 shadow-lg"
        >
          <Link to="/login" className="block">
            <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold">
              Try Free Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Gallery</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Experience the{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Action
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From training sessions to competitions, see what makes our dojo special.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <ImageGallery images={galleryImages} />
          </motion.div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-blue-600/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <PhoneMockup screenshots={appScreenshots} />
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="outline" className="mb-4">Mobile App</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your dojo,{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  in your pocket
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Access everything you need right from your phone. Check in with QR codes,
                track your progress, view schedules, and stay connected with your team.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instant Check-in</h3>
                    <p className="text-muted-foreground">
                      Scan your QR code and you're on the mat in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Track Progress</h3>
                    <p className="text-muted-foreground">
                      Monitor your journey from white to black belt
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Stay Connected</h3>
                    <p className="text-muted-foreground">
                      Chat with teammates and get updates from coaches
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2">
                  Available on iOS & Android
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                run your club
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From check-in to championship, we've got every aspect of your martial arts journey covered.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center mb-4"
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple,{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                transparent
              </span>{" "}
              pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your training goals. All plans include a 7-day free trial.
            </p>
            <div className="mt-6 max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Student Discount:</strong> Sign up with a valid UK university email (.ac.uk) to access the £25/month student tier. Non-students are welcome at our Standard and Premium tiers.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card
                  className={`h-full relative ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/10 scale-105"
                      : plan.studentOnly
                      ? "border-blue-500/50"
                      : "hover:border-primary/50"
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.studentOnly && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4">
                        Students Only
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">£{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/login" className="block">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                            : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
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

      {/* Meet Our Members Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Community</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Meet our{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                judoka
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real members making progress every day.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {memberProfiles.map((member) => (
              <motion.div key={member.id} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      category={member.category}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge
                        className={`backdrop-blur-sm border-2`}
                        style={{
                          borderColor: member.beltColor,
                          backgroundColor: `${member.beltColor}20`
                        }}
                      >
                        {member.belt}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                    <p className="text-muted-foreground italic">"{member.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coach/Sensei Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-blue-600/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Instructors</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Learn from the{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                best
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our experienced instructors bring decades of expertise to guide your journey.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {coaches.map((coach) => (
              <motion.div key={coach.id} variants={scaleIn}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <OptimizedImage
                      category={coach.category}
                      alt={coach.name}
                      width={600}
                      height={600}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{coach.name}</h3>
                      <p className="text-blue-300 font-semibold">{coach.title}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-2">{coach.credentials}</Badge>
                      <p className="text-muted-foreground">{coach.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {coach.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              From white belt to{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                champion
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See the incredible transformations of our dedicated members.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {successStories.map((story) => (
              <motion.div key={story.id} variants={scaleIn}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card overflow-hidden">
                  <div className="relative h-64">
                    <OptimizedImage
                      category={story.category}
                      alt={story.name}
                      width={800}
                      height={600}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white border-0">
                        Success Story
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{story.name}</h3>
                    <h4 className="text-lg text-primary font-semibold mb-3">{story.achievement}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{story.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>{story.highlight}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      A testament to dedication, hard work, and the supportive community at our dojo.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced with Photos */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                judoka everywhere
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our members and coaches have to say about their experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-48">
                    <OptimizedImage
                      category="portrait,athlete,martial-arts"
                      alt={testimonial.name}
                      width={400}
                      height={300}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.belt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently asked{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Judo Club Manager.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "border-primary" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      )}
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
                        <div className="px-6 pb-6 text-muted-foreground">
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

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

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
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-6xl mb-8"
            >
              🥋
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to transform{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                your club?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join hundreds of martial arts clubs already using Judo Club Manager to streamline their operations.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25"
              >
                Get Started Free
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required. Start your 7-day free trial today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and tagline */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🥋</span>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Judo Club
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                The modern membership management platform for martial arts clubs.
                Train smarter, track progress, level up.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <p className="text-sm text-muted-foreground">
                © 2026 Judo Club Manager. All rights reserved.
              </p>
              <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            </div>
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>
                Placeholder images provided by{" "}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline"
                >
                  Unsplash
                </a>
                . Replace with your club's photos for best results.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
