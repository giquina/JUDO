import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Route label mappings
const routeLabels: Record<string, string> = {
  admin: "Admin",
  member: "Dashboard",
  coach: "Coach",
  treasurer: "Treasurer",
  content: "Content",
  chat: "Chat",
  notifications: "Notifications",
  settings: "Settings",
  profile: "Profile",
  edit: "Edit",
  members: "Members",
  payments: "Payments",
  classes: "Classes",
  events: "Events",
  "for-senseis": "For Senseis",
};

// Generate breadcrumb items from current path
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter((path) => path);

  if (paths.length === 0) {
    return [{ label: "Home", path: "/" }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

  let currentPath = "";
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    breadcrumbs.push({ label, path: currentPath });
  });

  return breadcrumbs;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on home page or if there's only one item
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm mb-6 ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {!isFirst && (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}

              {isLast ? (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </motion.span>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {isFirst && (
                      <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    )}
                    <span className={isFirst ? "sr-only sm:not-sr-only" : ""}>
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
