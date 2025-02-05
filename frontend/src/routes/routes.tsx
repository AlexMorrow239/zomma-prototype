import { createBrowserRouter, Navigate } from "react-router-dom";

import { ErrorDisplay } from "@/pages/error-boundary/ErrorBoundary";
import { MainLayout } from "@/components/layout/main-layout/MainLayout";
import NotFound from "@/pages/not-found/NotFound";

import { AuthRouter } from "./AuthRouter";
import Prospectquestionnaire from "@/pages/prospect-questionnaire/Prospectquestionnaire";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorDisplay />,
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