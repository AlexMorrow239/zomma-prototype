import { Navigate, Outlet, useLocation } from "react-router-dom";

// Temporary authentication check - you can replace this with your actual auth logic later
const useAuth = () => {
  // For now, just check if there's a token in localStorage
  const isAuthenticated = !!localStorage.getItem("token");
  return { isAuthenticated };
};

export const ProtectedRoute = (): React.ReactElement => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
