import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

/** Logged-in users only. Others go to /signin and come back after. */
export function RequireAuth() {
  const { token } = useAuth();
  const location = useLocation();
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ from: location.pathname }} />
  );
}

/** Logged-out users only (signin/signup). */
export function GuestOnly() {
  const { token } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/blogs";
  return token ? <Navigate to={from} replace /> : <Outlet />;
}