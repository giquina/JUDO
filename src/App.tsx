import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/member" element={
                <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
                  <MemberDashboard />
                </ProtectedRoute>
              } />
              <Route path="/coach" element={
                <ProtectedRoute allowedRoles={["coach", "admin"]}>
                  <CoachDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
