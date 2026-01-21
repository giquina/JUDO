import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { senseiFAQs } from "@/lib/landing-data";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Questions{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              senseis ask
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know before starting your free trial.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          transition={{ staggerChildren: 0.1 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {senseiFAQs.map((faq, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? "border-primary shadow-md" : "hover:border-border/80"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors group"
                >
                  <span className="font-semibold pr-4 group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    className="flex-shrink-0"
                  >
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@judoclubmanager.com"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Contact our support team →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
