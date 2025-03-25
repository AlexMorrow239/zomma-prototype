import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/main-layout/MainLayout";

import Login from "@/pages/auth/login/Login";
import Registration from "@/pages/auth/registration/Registration";
import Dashboard from "@/pages/dashboard/Dashboard";
import EmailRecipients from "@/pages/email-recipients/EmailRecipients";
import NotFound from "@/pages/not-found/NotFound";
import Prospectquestionnaire from "@/pages/prospect-questionnaire/ProspectQuestionnaire";

import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Prospectquestionnaire />,
      },
      // Public Auth Routes
      {
        path: "auth",
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Registration /> },
        ],
      },
      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "email-recipients", element: <EmailRecipients /> },
        ],
      },
      // Error handling
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
