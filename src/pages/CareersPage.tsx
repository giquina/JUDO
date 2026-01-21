import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Zap,
  Heart,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import JobBoard from "@/components/JobBoard";
import JobDetailModal from "@/components/JobDetailModal";
import { jobs, type Job } from "@/lib/jobData";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// Benefits data
const benefits = [
  {
    icon: Users,
    title: "Amazing Team",
    description:
      "Work alongside passionate martial artists and tech enthusiasts who love what they do.",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description:
      "Continuous learning, professional development budgets, and clear career progression paths.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description:
      "Flexible hours, remote options, generous holiday allowance, and a supportive environment.",
  },
  {
    icon: Zap,
    title: "Impact & Innovation",
    description:
      "Build products that transform martial arts clubs and help athletes achieve their goals.",
  },
];

export default function CareersPage() {
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle job deep linking from URL
  useEffect(() => {
    const jobId = searchParams.get("job");
    if (jobId) {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        setIsModalOpen(true);
      }
    }
  }, [searchParams]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Remove job query param from URL
    if (searchParams.get("job")) {
      window.history.replaceState({}, "", "/careers");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🥋</span>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Judo Club
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <GraduationCap className="w-4 h-4 mr-2 inline" />
                We're Hiring
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Join the{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 bg-clip-text text-transparent">
                JUDO Team
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Help us revolutionize martial arts club management. We're building
              the future of dojo operations and we want you on the mat with us.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25"
                onClick={() => {
                  document
                    .getElementById("open-positions")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Open Positions
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 backdrop-blur-sm"
                onClick={() => {
                  document
                    .getElementById("instructor-cta")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Become an Instructor
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="text-8xl md:text-9xl"
            >
              <motion.span
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                🥋
              </motion.span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Why JUDO
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why work{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                with us?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a team that's passionate about martial arts, technology, and
              making a real impact.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="pt-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center mb-4"
                    >
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Open Positions
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Find your{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                perfect role
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have {jobs.length} open positions across instruction,
              operations, and platform development.
            </p>
          </motion.div>

          <JobBoard onJobClick={handleJobClick} />
        </div>
      </section>

      {/* Become an Instructor CTA */}
      <section
        id="instructor-cta"
        className="py-20 md:py-32 relative overflow-hidden bg-muted/30"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-blue-600/5">
                  <Badge className="w-fit mb-4 bg-gradient-to-r from-primary to-blue-600 text-white">
                    Instructor Opportunities
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4">
                    Share Your Passion for Judo
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Are you a qualified sensei looking to inspire the next
                    generation? We have multiple instructor positions available
                    for all age groups and skill levels.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">
                        Head Sensei & Assistant roles
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">Competition coaching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">Kids' program instruction</span>
                    </li>
                  </ul>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                    onClick={() => {
                      const instructorJobs = jobs.filter(
                        (j) => j.category === "Instruction"
                      );
                      if (instructorJobs.length > 0) {
                        handleJobClick(instructorJobs[0]);
                      }
                    }}
                  >
                    View Instructor Roles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                    className="text-9xl"
                  >
                    🥋
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Don't see the{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                right fit?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're always looking for talented people to join our team. Send us
              your CV and tell us how you can contribute to JUDO's mission.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                window.location.href = "mailto:careers@judo-club-app.com";
              }}
            >
              Send General Application
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
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

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Judo Club Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
