import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  disableHover?: boolean;
}

export default function AnimatedCard({ children, delay = 0, className, disableHover = false }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut"
      }}
      whileHover={!disableHover ? {
        scale: 1.02,
        y: -4,
        boxShadow: "0 12px 28px -8px rgba(0, 0, 0, 0.12)",
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      whileTap={!disableHover ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
