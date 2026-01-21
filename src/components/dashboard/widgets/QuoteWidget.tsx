import * as React from "react";
import { Quote, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category?: string;
}

export interface QuoteWidgetProps {
  quote: MotivationalQuote;
  onRefresh?: () => void;
  className?: string;
}

export function QuoteWidget({ quote, onRefresh, className }: QuoteWidgetProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-5">
        <Quote className="h-32 w-32 -rotate-12" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Quote icon */}
        <Quote className="h-6 w-6 text-indigo-500 mb-4" />

        {/* Quote text */}
        <motion.blockquote
          key={quote.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-medium leading-relaxed mb-4"
        >
          "{quote.text}"
        </motion.blockquote>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              — {quote.author}
            </p>
            {quote.category && (
              <span className="text-xs text-muted-foreground mt-1">
                {quote.category}
              </span>
            )}
          </div>

          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRefresh}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              disabled={isRefreshing}
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
