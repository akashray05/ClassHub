import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../components/layout/MainLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ResendVerificationPage from "../pages/auth/ResendVerificationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import DashboardPage from "../pages/dashboard/DashboardPage";
import FileExplorerPage from "../pages/files/FileExplorerPage";

import SharedPage from "../pages/shared/SharedPage";
import TrashPage from "../pages/trash/TrashPage";
import SettingsPage from "../pages/settings/SettingsPage";
import AdminPage from "../pages/admin/AdminPage";
import AdminRoute from "./AdminRoute";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "/resend-verification",
        element: <ResendVerificationPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },

      {
        path: "/dashboard",
        element: <DashboardPage />,
      },

      {
        path: "/folders/:folderId",
        element: <FileExplorerPage />,
      },

      {
        path: "/shared",
        element: <SharedPage />,
      },

      {
        path: "/trash",
        element: <TrashPage />,
      },

      {
        path: "/settings",
        element: <SettingsPage />,
      },

      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);