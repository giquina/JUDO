import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command as CommandIcon, Clock, TrendingUp } from "lucide-react";

interface GlobalSearchProps {
  onOpenCommandPalette?: () => void;
}

// Mock recent searches - stored in localStorage
const RECENT_SEARCHES_KEY = "judo_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const TRENDING_SEARCHES = [
  "Training schedule",
  "Belt promotion",
  "Payment status",
  "Attendance history",
  "Upcoming events",
];

export default function GlobalSearch({ onOpenCommandPalette }: GlobalSearchProps) {
  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMac, setIsMac] = useState(false);

  // Detect OS for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // Ignore errors
      }
    }
  }, []);

  // Save search to recent
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;

    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((q) => q !== query)].slice(
        0,
        MAX_RECENT_SEARCHES
      );
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      addRecentSearch(searchValue);
      // TODO: Implement actual search functionality
      console.log("Searching for:", searchValue);
      setFocused(false);
      setSearchValue("");
    }
  };

  // Open command palette on focus (optional behavior)
  const handleFocus = () => {
    setFocused(true);
    // Optionally open command palette instead
    // if (onOpenCommandPalette) {
    //   onOpenCommandPalette();
    // }
  };

  // Handle click on suggestion
  const handleSuggestionClick = (query: string) => {
    setSearchValue(query);
    addRecentSearch(query);
    // TODO: Implement actual search functionality
    console.log("Searching for:", query);
    setFocused(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search or press ⌘K..."
            className="w-full h-10 pl-10 pr-20 rounded-full bg-muted/50 border border-transparent hover:border-border/50 focus:border-primary focus:bg-background transition-all outline-none text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-background px-2 font-mono text-[10px] font-medium text-muted-foreground border border-border/50">
              {isMac ? "⌘" : "Ctrl"}K
            </kbd>
          </div>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Recent
                  </div>
                  {recentSearches.map((query, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(query)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="flex-1 text-sm">{query}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Divider */}
              {recentSearches.length > 0 && (
                <div className="my-2 border-t border-border/50" />
              )}

              {/* Trending/Suggested Searches */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Suggestions
                </div>
                {TRENDING_SEARCHES.map((query, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (recentSearches.length + index) * 0.05 }}
                    onClick={() => handleSuggestionClick(query)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{query}</span>
                  </motion.button>
                ))}
              </div>

              {/* Footer with Command Palette hint */}
              <div className="mt-2 pt-2 border-t border-border/50">
                <button
                  onClick={() => {
                    setFocused(false);
                    onOpenCommandPalette?.();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <CommandIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Open Command Palette</span>
                  </div>
                  <kbd className="inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-2 font-mono text-[10px] font-medium">
                    {isMac ? "⌘" : "Ctrl"}K
                  </kbd>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
