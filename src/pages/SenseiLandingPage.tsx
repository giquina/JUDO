import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// Landing components
import SenseiHero from "@/components/landing/SenseiHero";
import StatsCounter from "@/components/landing/StatsCounter";
import PainPointsSection from "@/components/landing/PainPointsSection";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import DashboardPreview from "@/components/landing/DashboardPreview";
import TestimonialCarousel from "@/components/landing/TestimonialCarousel";
import ROICalculator from "@/components/landing/ROICalculator";
import FeatureGrid from "@/components/landing/FeatureGrid";
import FAQSection from "@/components/landing/FAQSection";

export default function SenseiLandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🥋</span>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Judo Club Manager
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#demo"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                For Members
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
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  Start Free Trial
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
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
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
                  href="#demo"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Members
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-blue-600">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <SenseiHero />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Pain Points Section */}
      <PainPointsSection />

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-6xl mb-8"
            >
              🥋
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to transform{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                your dojo?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join 500+ senseis who've already made the switch. Start your 14-day free trial
              today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
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
                className="w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => {
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See It In Action
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              ✓ 14-day free trial &nbsp; • &nbsp; ✓ No credit card required &nbsp; • &nbsp; ✓
              Cancel anytime
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
                  Judo Club Manager
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                The modern club management platform built for senseis. Spend more time teaching,
                less time managing.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">For Clubs</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/for-senseis" className="hover:text-foreground transition-colors">
                    For Instructors
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    For Members
                  </Link>
                </li>
                <li>
                  <a href="#demo" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
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
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Judo Club Manager. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
