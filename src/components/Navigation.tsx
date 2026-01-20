import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard,
  Users,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";

const navItems = [
  {
    path: "/member",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "View your training progress"
  },
  {
    path: "/coach",
    label: "Coach",
    icon: Users,
    description: "Manage students and classes"
  },
  {
    path: "/admin",
    label: "Admin",
    icon: Settings,
    description: "System administration"
  },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-background/80 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25"
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-xl font-bold text-primary-foreground">J</span>
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/20"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight group-hover:text-primary transition-colors">
                  Judo Club
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                  Management
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-full p-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`relative px-4 py-2 h-9 rounded-full transition-all duration-200 ${
                          isActive
                            ? "text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNavBg"
                            className="absolute inset-0 bg-primary rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{item.label}</span>
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-slate-700" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <motion.div
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-sm font-medium leading-tight">User</span>
                    <span className="text-[10px] text-muted-foreground">Member</span>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <motion.div
                className="md:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mobileMenuOpen ? "close" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mobileMenuOpen ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <Menu className="w-5 h-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 z-40 md:hidden bg-background border-b shadow-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
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

                {/* Navigation Links - Mobile */}
                <nav className="space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link to={item.path}>
                          <div
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isActive
                                  ? "bg-primary-foreground/20"
                                  : "bg-muted"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.label}</p>
                              <p
                                className={`text-xs ${
                                  isActive
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Divider */}
                <div className="my-4 border-t" />

                {/* Logout - Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
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
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
