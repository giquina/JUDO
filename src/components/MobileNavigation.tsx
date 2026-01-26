import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Home,
  Calendar,
  QrCode,
  Trophy,
  User,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  isCenter?: boolean;
}

// Navigation items for different user roles
const memberNavItems: NavItem[] = [
  { path: "/member", label: "Home", icon: Home },
  { path: "/member/classes", label: "Keiko", icon: Calendar },
  { path: "/member/checkin", label: "Check-in", icon: QrCode, isCenter: true },
  { path: "/member/progress", label: "Progress", icon: Trophy },
  { path: "/member/profile", label: "Profile", icon: User },
];

const coachNavItems: NavItem[] = [
  { path: "/coach", label: "Home", icon: Home },
  { path: "/coach/classes", label: "Keiko", icon: Calendar },
  { path: "/coach/attendance", label: "Attendance", icon: QrCode, isCenter: true },
  { path: "/coach/members", label: "Judoka", icon: Users },
  { path: "/coach/profile", label: "Profile", icon: User },
];

const adminNavItems: NavItem[] = [
  { path: "/admin", label: "Home", icon: Home },
  { path: "/admin/members", label: "Judoka", icon: Users },
  { path: "/admin/payments", label: "Payments", icon: CreditCard, isCenter: true },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

// Custom hook for scroll direction detection
function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY.current ? "down" : "up";

      // Only update if scroll difference is significant (prevents jitter)
      if (Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDirection(direction);
        lastScrollY.current = scrollY;
      }

      setIsAtTop(scrollY < 50);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrollDirection, isAtTop };
}

// Ripple effect component for tap feedback
function Ripple({ x, y }: { x: number; y: number }) {
  return (
    <motion.span
      className="absolute bg-white/30 rounded-full pointer-events-none"
      style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      initial={{ width: 0, height: 0, opacity: 0.5 }}
      animate={{ width: 100, height: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  );
}

// Individual nav item component with micro-interactions
function NavItemButton({
  item,
  isActive,
  onTap,
}: {
  item: NavItem;
  isActive: boolean;
  onTap: () => void;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Spring animation for smooth scaling
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 17 });

  // Icon y position animation
  const iconY = useTransform(springScale, [0.9, 1, 1.1], [2, 0, -2]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 500);
    }
    onTap();
  };

  const Icon = item.icon;

  // Center button (Check-in) has special styling
  if (item.isCenter) {
    return (
      <Link
        ref={buttonRef}
        to={item.path}
        className="relative -mt-6 z-10"
        onClick={handleTap}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
      >
        <motion.div
          className="relative"
          style={{ scale: springScale }}
          whileTap={{ scale: 0.9 }}
          onHoverStart={() => scale.set(1.05)}
          onHoverEnd={() => scale.set(1)}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-primary rounded-full blur-lg opacity-40"
            animate={{
              scale: isActive ? [1, 1.2, 1] : 1,
              opacity: isActive ? [0.4, 0.6, 0.4] : 0.3,
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          {/* Main button */}
          <div
            className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${
              isActive
                ? "bg-primary"
                : "bg-gradient-to-br from-primary to-primary/80"
            }`}
          >
            {/* Ripple container */}
            <AnimatePresence>
              {ripples.map((ripple) => (
                <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
              ))}
            </AnimatePresence>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />

            <motion.div style={{ y: iconY }}>
              <Icon className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Active ring indicator */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute -inset-1 border-2 border-primary/50 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Label */}
        <motion.span
          className={`block text-[10px] font-medium mt-1 text-center ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`}
          animate={{ opacity: isActive ? 1 : 0.8 }}
        >
          {item.label}
        </motion.span>
      </Link>
    );
  }

  // Regular nav items
  return (
    <Link
      ref={buttonRef}
      to={item.path}
      className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[60px] overflow-hidden"
      onClick={handleTap}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      <motion.div
        className="relative"
        style={{ scale: springScale }}
        whileTap={{ scale: 0.85 }}
        onHoverStart={() => scale.set(1.1)}
        onHoverEnd={() => scale.set(1)}
      >
        {/* Background pill for active state */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute -inset-2 bg-primary/10 rounded-xl"
              layoutId="navActiveBackground"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {/* Ripple container */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
          ))}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          style={{ y: iconY }}
          className="relative z-10"
        >
          <Icon
            className={`w-6 h-6 transition-colors duration-200 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
            strokeWidth={isActive ? 2.5 : 2}
            fill={isActive ? "currentColor" : "none"}
          />
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.span
        className={`text-[10px] font-medium mt-1 transition-colors duration-200 ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
        animate={{
          y: isActive ? 0 : 2,
          opacity: isActive ? 1 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {item.label}
      </motion.span>

      {/* Active dot indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          />
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function MobileNavigation() {
  const location = useLocation();
  const { role } = useAuth();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);

  // Select navigation items based on user role
  const navItems = useMemo(() => {
    switch (role) {
      case "admin":
        return adminNavItems;
      case "coach":
        return coachNavItems;
      default:
        return memberNavItems;
    }
  }, [role]);

  // Get the base path for the current role
  const basePath = useMemo(() => {
    switch (role) {
      case "admin":
        return "/admin";
      case "coach":
        return "/coach";
      default:
        return "/member";
    }
  }, [role]);

  // Handle visibility based on scroll
  useEffect(() => {
    queueMicrotask(() => {
      if (isAtTop) {
        setIsVisible(true);
      } else {
        setIsVisible(scrollDirection === "up");
      }
    });
  }, [scrollDirection, isAtTop]);

  // Check if current path matches nav item (handle nested routes)
  const isActivePath = (itemPath: string) => {
    // For home paths, require exact match
    if (itemPath === basePath) {
      return location.pathname === basePath;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20 md:hidden" />

      {/* Navigation bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Background with blur and gradient */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-50" />

        {/* Safe area container - handles iPhone notch/home indicator */}
        <div
          className="relative flex items-end justify-around px-2"
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
          }}
        >
          {navItems.map((item) => (
            <NavItemButton
              key={item.path}
              item={item}
              isActive={isActivePath(item.path)}
              onTap={() => {
                // Haptic feedback would go here on a real device
              }}
            />
          ))}
        </div>

        {/* Top edge highlight for visual polish */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      </motion.nav>
    </>
  );
}
