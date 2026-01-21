import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { ConfirmProvider } from "./hooks/useConfirm";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import CommandPalette from "./components/CommandPalette";
import { SkipLinks } from "./components/SkipLinks";
import { KeyboardShortcuts, useKeyboardShortcuts } from "./components/KeyboardShortcuts";
import { useAuth } from "./lib/auth";
import { Spinner } from "./components/ui/spinner";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import SenseiLandingPage from "./pages/SenseiLandingPage";
import MemberDashboard from "./pages/MemberDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TreasurerDashboard from "./pages/TreasurerDashboard";
import ContentManagerDashboard from "./pages/ContentManagerDashboard";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";

// Smart redirect based on auth status
function HomeRedirect() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Redirect authenticated users to their dashboard based on role
  switch (role) {
    case "super_admin":
      return <Navigate to="/admin" replace />;
    case "treasurer":
      return <Navigate to="/treasurer" replace />;
    case "content_manager":
      return <Navigate to="/content" replace />;
    case "coach":
      return <Navigate to="/coach" replace />;
    case "member":
    default:
      return <Navigate to="/member" replace />;
  }
}

function App() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Enable keyboard shortcuts globally
  useKeyboardShortcuts(() => setShortcutsOpen(true));

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="judo-theme">
        <TooltipProvider delayDuration={200}>
          <ConfirmProvider>
            <BrowserRouter>
              <SkipLinks />
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/for-senseis" element={<SenseiLandingPage />} />
                <Route path="/for-coaches" element={<Navigate to="/for-senseis" replace />} />
                <Route path="/for-instructors" element={<Navigate to="/for-senseis" replace />} />
                <Route path="/member" element={
                  <ProtectedRoute allowedRoles={["member", "coach", "treasurer", "content_manager", "super_admin"]}>
                    <MemberDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/coach" element={
                  <ProtectedRoute allowedRoles={["coach", "super_admin"]}>
                    <CoachDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/treasurer" element={
                  <ProtectedRoute allowedRoles={["treasurer", "super_admin"]}>
                    <TreasurerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/content" element={
                  <ProtectedRoute allowedRoles={["content_manager", "super_admin"]}>
                    <ContentManagerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={["super_admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute allowedRoles={["member", "coach", "treasurer", "content_manager", "super_admin"]}>
                    <ChatPage />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute allowedRoles={["member", "coach", "treasurer", "content_manager", "super_admin"]}>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster richColors position="top-center" />
            <CommandPalette />
            <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
          </ConfirmProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
