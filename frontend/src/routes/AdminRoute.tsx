import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
