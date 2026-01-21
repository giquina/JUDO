import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import type { UserRole } from "../lib/auth";
import { Spinner } from "./ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
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

  return <>{children}</>;
}
