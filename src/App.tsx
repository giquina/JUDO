import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./lib/auth";
import { ClubProvider } from "./contexts/ClubContext";
import { Spinner } from "./components/ui/spinner";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import MemberDashboard from "./pages/MemberDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
    case "club_owner":
    case "head_sensei":
      return <Navigate to="/admin" replace />;
    case "sensei":
    case "sempai":
      return <Navigate to="/sensei" replace />;
    default:
      return <Navigate to="/judoka" replace />;
  }
}

// Wrapper for ClubProvider that needs auth context
function AppWithClub() {
  const { user } = useAuth();

  return (
    <ClubProvider userId={user?.userId || ""}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/judoka" element={
          <ProtectedRoute allowedRoles={["judoka", "sempai", "sensei", "head_sensei", "club_owner"]}>
            <MemberDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sensei" element={
          <ProtectedRoute allowedRoles={["sensei", "head_sensei", "club_owner"]}>
            <CoachDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["club_owner", "head_sensei"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        {/* Legacy routes - redirect to new terminology */}
        <Route path="/member" element={<Navigate to="/judoka" replace />} />
        <Route path="/coach" element={<Navigate to="/sensei" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ClubProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="judo-theme">
        <BrowserRouter>
          <AppWithClub />
        </BrowserRouter>
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
