import { motion } from "framer-motion"
import { Home, Calendar, Users, Settings, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate, useLocation } from "react-router-dom"

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Calendar, label: "Classes", path: "/classes" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.path)

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors active:scale-95"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 relative z-10 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />

              <span
                className={cn(
                  "text-xs font-medium relative z-10 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
