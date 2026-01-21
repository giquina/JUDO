import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "./OptimizedImage";

interface Screenshot {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface PhoneMockupProps {
  screenshots: Screenshot[];
  autoplay?: boolean;
  interval?: number;
}

/**
 * PhoneMockup Component
 *
 * Features:
 * - iPhone frame SVG
 * - Screenshot slider inside
 * - Animated hand pointing/swiping
 * - Responsive sizing
 * - Auto-play carousel
 */
export default function PhoneMockup({
  screenshots,
  autoplay = true,
  interval = 3000
}: PhoneMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, screenshots.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Phone Frame */}
      <div className="relative w-[300px] md:w-[350px] h-[600px] md:h-[700px]">
        {/* iPhone Frame SVG */}
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-2xl"
          viewBox="0 0 300 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Phone body */}
          <rect
            x="10"
            y="10"
            width="280"
            height="580"
            rx="40"
            fill="currentColor"
            className="text-foreground"
          />
          {/* Screen */}
          <rect
            x="20"
            y="20"
            width="260"
            height="560"
            rx="30"
            fill="currentColor"
            className="text-background"
          />
          {/* Notch */}
          <rect
            x="100"
            y="20"
            width="100"
            height="25"
            rx="12"
            fill="currentColor"
            className="text-foreground"
          />
        </svg>

        {/* Screenshot Container */}
        <div className="absolute top-[50px] left-[30px] right-[30px] bottom-[30px] overflow-hidden rounded-[25px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              <OptimizedImage
                category={screenshots[currentIndex].category}
                alt={screenshots[currentIndex].title}
                width={240}
                height={520}
                className="w-full h-full"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
        aria-label="Previous screenshot"
      >
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
        aria-label="Next screenshot"
      >
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Animated Hand Gesture (decorative) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: [0, 1, 1, 0], x: [-20, 20, 20, -20] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="absolute bottom-1/3 right-1/4 pointer-events-none"
      >
        <span className="text-4xl">👆</span>
      </motion.div>

      {/* Screenshot Info */}
      <div className="absolute -bottom-24 left-0 right-0 text-center">
        <motion.h3
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-lg"
        >
          {screenshots[currentIndex].title}
        </motion.h3>
        <motion.p
          key={`desc-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground"
        >
          {screenshots[currentIndex].description}
        </motion.p>
      </div>
    </div>
  );
}
