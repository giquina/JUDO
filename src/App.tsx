import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import NetworkStatus from "./components/NetworkStatus";
import CommandPalette from "./components/CommandPalette";
import InstallPrompt from "./components/InstallPrompt";
import { useAuth } from "./lib/auth";
import { Spinner } from "./components/ui/spinner";
import NotFound from "./pages/NotFound";

// Lazy-loaded page components for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MemberDashboard = lazy(() => import("./pages/MemberDashboard"));
const CoachDashboard = lazy(() => import("./pages/CoachDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));

// Member sub-pages
const MemberClassesPage = lazy(() => import("./pages/member/MemberClassesPage"));
const MemberCheckinPage = lazy(() => import("./pages/member/MemberCheckinPage"));
const MemberProgressPage = lazy(() => import("./pages/member/MemberProgressPage"));
const MemberProfilePage = lazy(() => import("./pages/member/MemberProfilePage"));

// Coach sub-pages
const CoachClassesPage = lazy(() => import("./pages/coach/CoachClassesPage"));
const CoachAttendancePage = lazy(() => import("./pages/coach/CoachAttendancePage"));
const CoachMembersPage = lazy(() => import("./pages/coach/CoachMembersPage"));
const CoachProfilePage = lazy(() => import("./pages/coach/CoachProfilePage"));

// Admin sub-pages
const AdminMembersPage = lazy(() => import("./pages/admin/AdminMembersPage"));
const AdminPaymentsPage = lazy(() => import("./pages/admin/AdminPaymentsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));

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

  // Redirect authenticated users to their dashboard
  switch (role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "coach":
      return <Navigate to="/coach" replace />;
    default:
      return <Navigate to="/member" replace />;
  }
}

// Loading fallback component for Suspense
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="judo-theme">
        <BrowserRouter>
          {/* Skip to content link for keyboard/screen reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <CommandPalette />
          <Suspense fallback={<PageLoader />}>
            <main id="main-content">
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              {/* Member Routes */}
              <Route path="/member" element={
                <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Member Dashboard">
                    <MemberDashboard />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/member/classes" element={
                <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Member Classes">
                    <MemberClassesPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/member/checkin" element={
                <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Member Check-in">
                    <MemberCheckinPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/member/progress" element={
                <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Member Progress">
                    <MemberProgressPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/member/profile" element={
                <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Member Profile">
                    <MemberProfilePage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              {/* Coach Routes */}
              <Route path="/coach" element={
                <ProtectedRoute allowedRoles={["coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Coach Dashboard">
                    <CoachDashboard />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/coach/classes" element={
                <ProtectedRoute allowedRoles={["coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Coach Classes">
                    <CoachClassesPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/coach/attendance" element={
                <ProtectedRoute allowedRoles={["coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Coach Attendance">
                    <CoachAttendancePage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/coach/members" element={
                <ProtectedRoute allowedRoles={["coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Coach Members">
                    <CoachMembersPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/coach/profile" element={
                <ProtectedRoute allowedRoles={["coach", "admin"]}>
                  <RouteErrorBoundary sectionName="Coach Profile">
                    <CoachProfilePage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <RouteErrorBoundary sectionName="Admin Dashboard">
                    <AdminDashboard />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/admin/members" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <RouteErrorBoundary sectionName="Admin Members">
                    <AdminMembersPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <RouteErrorBoundary sectionName="Admin Payments">
                    <AdminPaymentsPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <RouteErrorBoundary sectionName="Admin Analytics">
                    <AdminAnalyticsPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <RouteErrorBoundary sectionName="Admin Settings">
                    <AdminSettingsPage />
                  </RouteErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </main>
          </Suspense>
        </BrowserRouter>
        <Toaster richColors position="top-center" />
        <NetworkStatus />
        <InstallPrompt />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
