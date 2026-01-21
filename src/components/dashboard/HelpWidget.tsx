import * as React from "react";
import {
  HelpCircle,
  FileQuestion,
  MessageCircle,
  Keyboard,
  Sparkles,
  Search,
  ExternalLink,
  Mail,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
}

export interface HelpWidgetProps {
  onOpenShortcuts?: () => void;
  onStartTour?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started with JUDO App",
    description: "Learn the basics of using the app",
    category: "Basics",
  },
  {
    id: "check-in",
    title: "How to Check In",
    description: "QR code check-in process explained",
    category: "Training",
  },
  {
    id: "book-class",
    title: "Booking Classes",
    description: "Reserve your spot in training sessions",
    category: "Training",
  },
  {
    id: "goals",
    title: "Setting Goals",
    description: "Track your progress with personal goals",
    category: "Progress",
  },
  {
    id: "payments",
    title: "Managing Payments",
    description: "Payment methods and subscription info",
    category: "Billing",
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "Customize your notification preferences",
    category: "Settings",
  },
];

export function HelpWidget({
  onOpenShortcuts,
  onStartTour,
  onContactSupport,
  className,
}: HelpWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter help articles
  const filteredArticles = React.useMemo(() => {
    if (!searchQuery) return helpArticles;
    const query = searchQuery.toLowerCase();
    return helpArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Quick actions
  const quickActions = [
    {
      icon: <FileQuestion className="h-4 w-4" />,
      label: "FAQs",
      description: "Common questions answered",
      onClick: () => console.log("Open FAQs"),
    },
    {
      icon: <Keyboard className="h-4 w-4" />,
      label: "Keyboard Shortcuts",
      description: "View all shortcuts",
      onClick: () => {
        onOpenShortcuts?.();
        setIsOpen(false);
      },
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      label: "Take Tour",
      description: "Interactive walkthrough",
      onClick: () => {
        onStartTour?.();
        setIsOpen(false);
      },
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      label: "Contact Support",
      description: "Get help from our team",
      onClick: () => {
        onContactSupport?.();
        setIsOpen(false);
      },
    },
  ];

  return (
    <>
      {/* Floating help button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow",
          className
        )}
        aria-label="Help & Support"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <HelpCircle className="h-6 w-6" />
          )}
        </motion.div>

        {/* Notification dot */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
        />
      </motion.button>

      {/* Help panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 100, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 z-40 w-full max-w-md bg-background rounded-xl shadow-2xl border overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b bg-muted/30">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Help & Support
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Find answers and get assistance
                </p>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Quick Actions */}
                <div className="p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.onClick}
                        className="flex flex-col items-start gap-2 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {action.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {action.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Help Articles */}
                <div className="p-4 border-t">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Help Articles
                  </h3>

                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No articles found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredArticles.map((article) => (
                        <motion.button
                          key={article.id}
                          whileHover={{ x: 4 }}
                          onClick={() => console.log("Open article:", article.id)}
                          className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {article.title}
                              </span>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {article.description}
                            </p>
                            <span className="text-xs text-muted-foreground/60 mt-1">
                              {article.category}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Support */}
                <div className="p-4 border-t bg-muted/30">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Can't find what you're looking for?
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        onContactSupport?.();
                        setIsOpen(false);
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
