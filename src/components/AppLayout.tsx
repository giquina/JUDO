import type { ReactNode } from "react";
import MobileNavigation from "./MobileNavigation";

interface AppLayoutProps {
  children: ReactNode;
  showMobileNav?: boolean;
}

/**
 * AppLayout - Main layout wrapper for authenticated pages
 *
 * Includes the mobile bottom navigation bar which:
 * - Only shows on screens < 768px (mobile)
 * - Hides when scrolling down, shows when scrolling up
 * - Has safe area padding for iPhone notch
 */
export default function AppLayout({ children, showMobileNav = true }: AppLayoutProps) {
  return (
    <>
      {children}
      {showMobileNav && <MobileNavigation />}
    </>
  );
}
