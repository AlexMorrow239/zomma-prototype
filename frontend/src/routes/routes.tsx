import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/main-layout/MainLayout";

import NotFound from "@/pages/not-found/NotFound";
import Prospectquestionnaire from "@/pages/prospect-questionnaire/ProspectQuestionnaire";

import { AuthRouter } from "./AuthRouter";

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
