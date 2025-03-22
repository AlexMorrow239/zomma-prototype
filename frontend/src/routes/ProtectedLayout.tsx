import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted location for post-login redirect
    return <Navigate to="/faculty" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
