import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { stats } from "@/lib/landing-data";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";

function StatItem({
  value,
  suffix,
  label,
  duration
}: {
  value: number;
  suffix: string;
  label: string;
  duration: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const count = useCountUp({
    end: value,
    duration,
    suffix,
    isInView
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="text-center"
    >
      <motion.p
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2"
      >
        {count}
      </motion.p>
      <p className="text-sm md:text-base text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-600/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
