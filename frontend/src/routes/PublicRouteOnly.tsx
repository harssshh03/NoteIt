import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth";


export function PublicOnlyRoute() {
  const { token } = useAuth();
  return token ? <Navigate to="/blogs" replace /> : <Outlet />;
}