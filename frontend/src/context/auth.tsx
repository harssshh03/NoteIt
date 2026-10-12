import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { api } from "@/lib/api";

export type AuthUser = { id: number; name: string; email: string };

type AuthCtx = {
  token: string | null;
  user: AuthUser | null;
  signin: (token: string, user?: AuthUser) => void;
  signout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

function isExpired(token: string) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function readToken() {
  const t = localStorage.getItem("token");
  if (!t || isExpired(t)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
  return t;
}

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);
  const [user, setUser] = useState<AuthUser | null>(readUser);

  const signin = useCallback((t: string, u?: AuthUser) => {
    localStorage.setItem("token", t);
    setToken(t);
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    }
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // any 401 while logged in = session is dead -> sign out
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (
          axios.isAxiosError(err) &&
          err.response?.status === 401 &&
          localStorage.getItem("token")
        ) {
          signout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, [signout]);

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === null) {
        setToken(readToken());
        setUser(readUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ token, user, signin, signout }),
    [token, user, signin, signout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}