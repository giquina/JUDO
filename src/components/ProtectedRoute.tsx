import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Spinner } from "./ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("member" | "coach" | "admin")[];
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

  if (allowedRoles && role && !allowedRoles.includes(role as any)) {
    // Redirect to appropriate dashboard based on role
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "coach") return <Navigate to="/coach" replace />;
    return <Navigate to="/member" replace />;
  }

  return <>{children}</>;
}
