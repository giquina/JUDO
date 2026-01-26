import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import {
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollTicking = useRef(false);
  // Optimized scroll handler with RAF throttling
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        scrollTicking.current = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          scrollTicking.current = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    queueMicrotask(() => {
      setMobileMenuOpen(false);
    });
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Memoized callbacks to prevent child re-renders
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const handleLogout = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-background/80 backdrop-blur-md border-b border-transparent"
        }`}
        style={{ willChange: 'background-color, box-shadow' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - CSS transitions for better INP */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <span className="text-xl font-bold text-primary-foreground">J</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight group-hover:text-primary transition-colors duration-150">
                  Judo Dojo
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                  Management
                </span>
              </div>
            </Link>

            {/* Right Side Actions - CSS transitions for better INP */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted transition-transform duration-150 hover:scale-105 active:scale-95"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </Button>

              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <div
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/50 cursor-pointer hover:bg-muted transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-sm font-medium leading-tight">User</span>
                    <span className="text-[10px] text-muted-foreground">Member</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-transform duration-150 hover:scale-105 active:scale-95"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted transition-transform duration-150 hover:scale-105 active:scale-95"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Simplified for better INP */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel - Reduced animation complexity */}
            <motion.div
              className="fixed top-16 left-0 right-0 z-40 md:hidden bg-background border-b shadow-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="container mx-auto px-4 py-4">
                {/* User Info - Mobile */}
                <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">User</p>
                    <p className="text-sm text-muted-foreground">Member Account</p>
                  </div>
                </div>

                {/* Logout - Mobile */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-150 hover:translate-x-1 active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Logout</p>
                    <p className="text-xs text-muted-foreground">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
