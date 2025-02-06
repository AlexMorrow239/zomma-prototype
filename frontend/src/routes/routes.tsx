import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/main-layout/MainLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/not-found/NotFound";
import Prospectquestionnaire from "@/pages/prospect-questionnaire/ProspectQuestionnaire";

import { AuthRouter } from "./AuthRouter";
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
      {
        path: "auth/*",
        element: <AuthRouter />,
      },
      {
        // Protected dashboard route
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
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
