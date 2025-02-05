import { Navigate, Route, Routes } from "react-router-dom";

import Login from "@/pages/auth/login/Login";
import Dashboard from "@/pages/dashboard/Dashboard";

import { ProtectedRoute } from "./ProtectedRoute";
import Registration from "@/pages/auth/registration/Registration";

export const AuthRouter = (): React.ReactElement => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Registration />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      {/* Redirects */}
      <Route index element={<Navigate to="login" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};