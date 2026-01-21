import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { senseiTestimonials } from "@/lib/landing-data";
import { fadeInUp } from "@/lib/animation-variants";

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % senseiTestimonials.length);
  };

  const previous = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + senseiTestimonials.length) % senseiTestimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentTestimonial = senseiTestimonials[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0
    })
  };

  return (
    <section className="py-20 md:py-32 bg-muted/30">
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
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              sensei worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from instructors who've transformed their clubs with Judo Club Manager.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden relative">
            <CardContent className="p-8 md:p-12">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {/* Quote icon */}
                  <div className="mb-6">
                    <Quote className="w-12 h-12 text-primary/20" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {currentTestimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{currentTestimonial.name}</p>
                      <p className="text-muted-foreground">{currentTestimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{currentTestimonial.club}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previous}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Dots */}
                <div className="flex gap-2">
                  {senseiTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-primary w-8"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
