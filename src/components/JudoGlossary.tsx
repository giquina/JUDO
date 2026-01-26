import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  X,
  BookOpen,
  Trophy,
  Users,
  Mic2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// Category definitions with icons and colors
type CategoryKey = "etiquette" | "scoring" | "techniques" | "commands";

interface Category {
  key: CategoryKey;
  label: string;
  icon: typeof BookOpen;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CATEGORIES: Category[] = [
  {
    key: "etiquette",
    label: "Etiquette",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-700",
  },
  {
    key: "scoring",
    label: "Scoring",
    icon: Trophy,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-300 dark:border-amber-700",
  },
  {
    key: "techniques",
    label: "Techniques",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-300 dark:border-blue-700",
  },
  {
    key: "commands",
    label: "Commands",
    icon: Mic2,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-300 dark:border-emerald-700",
  },
];

// Glossary term interface
interface GlossaryTerm {
  romaji: string;
  japanese: string;
  meaning: string;
  category: CategoryKey;
  pronunciation?: string;
  additionalInfo?: string;
}

// Complete glossary data
const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Etiquette
  {
    romaji: "Dojo",
    japanese: "道場",
    meaning: "Training hall",
    category: "etiquette",
    pronunciation: "doh-joh",
    additionalInfo: "Literally means 'place of the way'. A sacred space for learning martial arts.",
  },
  {
    romaji: "Sensei",
    japanese: "先生",
    meaning: "Teacher/Coach",
    category: "etiquette",
    pronunciation: "sen-say",
    additionalInfo: "Literally 'one who was born before'. A title of respect for instructors.",
  },
  {
    romaji: "Judoka",
    japanese: "柔道家",
    meaning: "Judo practitioner",
    category: "etiquette",
    pronunciation: "joo-doh-kah",
    additionalInfo: "Someone who studies and practices the art of judo.",
  },
  {
    romaji: "Keiko",
    japanese: "稽古",
    meaning: "Practice/Training",
    category: "etiquette",
    pronunciation: "kay-koh",
    additionalInfo: "Regular training session in judo.",
  },
  {
    romaji: "Rei",
    japanese: "礼",
    meaning: "Bow/Respect",
    category: "etiquette",
    pronunciation: "ray",
    additionalInfo: "The formal bow showing respect to instructors, opponents, and the dojo.",
  },
  // Techniques
  {
    romaji: "Randori",
    japanese: "乱取り",
    meaning: "Free sparring",
    category: "techniques",
    pronunciation: "ran-doh-ree",
    additionalInfo: "Free practice where techniques are applied against a resisting partner.",
  },
  {
    romaji: "Kata",
    japanese: "形",
    meaning: "Forms/Patterns",
    category: "techniques",
    pronunciation: "kah-tah",
    additionalInfo: "Pre-arranged sequences of techniques practiced with a partner.",
  },
  {
    romaji: "Ukemi",
    japanese: "受け身",
    meaning: "Breakfall",
    category: "techniques",
    pronunciation: "oo-keh-mee",
    additionalInfo: "The art of falling safely. Essential skill for all judoka.",
  },
  {
    romaji: "Osaekomi",
    japanese: "押さえ込み",
    meaning: "Hold down",
    category: "techniques",
    pronunciation: "oh-sah-eh-koh-mee",
    additionalInfo: "Pinning techniques used to hold an opponent on their back.",
  },
  // Commands
  {
    romaji: "Hajime",
    japanese: "始め",
    meaning: "Begin",
    category: "commands",
    pronunciation: "hah-jee-meh",
    additionalInfo: "The referee's command to start a match or training exercise.",
  },
  {
    romaji: "Matte",
    japanese: "待て",
    meaning: "Wait/Stop",
    category: "commands",
    pronunciation: "mah-teh",
    additionalInfo: "Command to temporarily stop the match. Contestants must return to starting positions.",
  },
  // Scoring
  {
    romaji: "Ippon",
    japanese: "一本",
    meaning: "Full point",
    category: "scoring",
    pronunciation: "ee-ppon",
    additionalInfo: "The highest score in judo, immediately winning the match. Achieved by throwing with control, force, speed, and landing opponent on their back.",
  },
  {
    romaji: "Waza-ari",
    japanese: "技あり",
    meaning: "Near point",
    category: "scoring",
    pronunciation: "wah-zah-ah-ree",
    additionalInfo: "A partial score. Two waza-ari equal an ippon (waza-ari-awasete-ippon).",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const filterBadgeVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  tap: { scale: 0.95 },
};

// Props interface
interface JudoGlossaryProps {
  /** Display mode: modal overlay or inline section */
  mode?: "modal" | "inline";
  /** Callback when modal is closed (only for modal mode) */
  onClose?: () => void;
  /** Whether the modal is open (only for modal mode) */
  isOpen?: boolean;
  /** Custom class name */
  className?: string;
  /** Initial category filter */
  initialCategory?: CategoryKey | null;
  /** Maximum height for inline mode */
  maxHeight?: string;
}

// Glossary Card Component
interface GlossaryCardProps {
  term: GlossaryTerm;
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}

function GlossaryCard({ term, category, isExpanded, onToggle }: GlossaryCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="group"
    >
      <Card
        className={cn(
          "cursor-pointer overflow-hidden transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/10",
          "border-2",
          isExpanded ? category.borderColor : "border-transparent hover:border-border"
        )}
        onClick={onToggle}
      >
        <CardContent className="p-0">
          {/* Main content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              {/* Term info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text",
                      "group-hover:from-primary group-hover:to-primary/70",
                      "transition-all duration-300"
                    )}
                  >
                    {term.romaji}
                  </span>
                  <span className="text-xl text-muted-foreground font-japanese">
                    {term.japanese}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {term.meaning}
                </p>
              </div>

              {/* Category badge and expand indicator */}
              <div className="flex flex-col items-end gap-2">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-300",
                    category.bgColor
                  )}
                >
                  <Icon className={cn("h-4 w-4", category.color)} />
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "px-4 pb-4 pt-2 border-t",
                    "bg-gradient-to-b from-muted/30 to-transparent"
                  )}
                >
                  {term.pronunciation && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pronunciation:
                      </span>
                      <span className="text-sm font-mono text-foreground/80 italic">
                        [{term.pronunciation}]
                      </span>
                    </div>
                  )}
                  {term.additionalInfo && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {term.additionalInfo}
                    </p>
                  )}
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        category.color,
                        category.borderColor
                      )}
                    >
                      {category.label}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Glossary Component
export default function JudoGlossary({
  mode = "inline",
  onClose,
  isOpen = true,
  className,
  initialCategory = null,
  maxHeight = "600px",
}: JudoGlossaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    initialCategory
  );
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        searchQuery === "" ||
        term.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.japanese.includes(searchQuery) ||
        term.meaning.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group terms by category for display
  const groupedTerms = useMemo(() => {
    const groups: Record<CategoryKey, GlossaryTerm[]> = {
      etiquette: [],
      scoring: [],
      techniques: [],
      commands: [],
    };

    filteredTerms.forEach((term) => {
      groups[term.category].push(term);
    });

    return groups;
  }, [filteredTerms]);

  // Get category info helper
  const getCategoryInfo = (key: CategoryKey): Category => {
    return CATEGORIES.find((c) => c.key === key)!;
  };

  // Toggle category filter
  const toggleCategory = (category: CategoryKey) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== null;

  // Glossary content JSX (not a component to avoid React Compiler issues)
  const glossaryContent = (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex-shrink-0 pb-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Judo Glossary
              </h2>
              <p className="text-sm text-muted-foreground">
                Learn essential Japanese judo terminology
              </p>
            </div>
          </div>
          {mode === "modal" && onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search terms in English or Japanese..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </motion.button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.key;
            return (
              <motion.button
                key={category.key}
                variants={filterBadgeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileTap="tap"
                onClick={() => toggleCategory(category.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  "text-sm font-medium transition-all duration-200",
                  "border-2",
                  isSelected
                    ? cn(category.bgColor, category.color, category.borderColor)
                    : "bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {category.label}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    isSelected
                      ? "bg-background/50"
                      : "bg-background/80"
                  )}
                >
                  {groupedTerms[category.key].length}
                </span>
              </motion.button>
            );
          })}

          {/* Clear filters button */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                onClick={clearFilters}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full",
                  "text-sm font-medium text-destructive",
                  "bg-destructive/10 hover:bg-destructive/20",
                  "transition-colors duration-200"
                )}
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Terms list */}
      <div
        className="flex-1 overflow-y-auto py-4 pr-1"
        style={{ maxHeight: mode === "inline" ? maxHeight : undefined }}
      >
        {filteredTerms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No terms found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                Clear all filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 sm:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {filteredTerms.map((term) => (
                <GlossaryCard
                  key={term.romaji}
                  term={term}
                  category={getCategoryInfo(term.category)}
                  isExpanded={expandedTerm === term.romaji}
                  onToggle={() =>
                    setExpandedTerm((prev) =>
                      prev === term.romaji ? null : term.romaji
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex-shrink-0 pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Tap a card to learn more
          </span>
        </div>
      </div>
    </div>
  );

  // Render based on mode
  if (mode === "modal") {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16",
                "bg-background rounded-2xl shadow-2xl z-50",
                "flex flex-col overflow-hidden",
                "border border-border"
              )}
            >
              <div className="flex-1 overflow-hidden p-6">
                {glossaryContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Inline mode
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        {glossaryContent}
      </CardContent>
    </Card>
  );
}

// Export types for external use
export type { GlossaryTerm, CategoryKey, JudoGlossaryProps };
export { GLOSSARY_TERMS, CATEGORIES };
