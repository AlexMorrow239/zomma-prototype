import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export const ProtectedRoute = (): React.ReactElement => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    // Redirect to login page with return location
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
