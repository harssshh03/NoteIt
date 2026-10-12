import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

export function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();
  return token ? <Outlet /> : <Navigate to="/signin" replace state={{ from: location }} />;
}

