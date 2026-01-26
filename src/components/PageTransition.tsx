import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

// Reduced motion variants - only fade, no movement
const reducedMotionVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.3,
};

// Faster transition for reduced motion
const reducedMotionTransition = {
  type: "tween" as const,
  ease: "linear" as const,
  duration: 0.1,
};

export default function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, use minimal or no animation
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={reducedMotionVariants}
        transition={reducedMotionTransition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
