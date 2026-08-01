import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import FileExplorerPage from "../pages/files/FileExplorerPage";
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/folders/:folderId",
        element: (
          <ProtectedRoute>
            <FileExplorerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path:"/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
      },
    ],
  },
]);