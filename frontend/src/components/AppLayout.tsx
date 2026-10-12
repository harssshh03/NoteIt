import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, LogIn, LogOut, Menu, Newspaper, PenSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themetoggle";
import { APP_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";

const LINKS = [
  { to: "/blogs", label: "All blogs", icon: Newspaper, private: false },
  { to: "/my-blogs", label: "My blogs", icon: BookOpen, private: true },
  { to: "/publish", label: "New post", icon: PenSquare, private: true },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { token, user, signout } = useAuth();
  const navigate = useNavigate();
  const links = LINKS.filter((l) => token || !l.private);

  function handleSignout() {
    signout();
    onNavigate?.();
    navigate("/blogs", { replace: true });
  }

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/blogs"
        onClick={onNavigate}
        className="flex items-center gap-2 px-5 py-5 font-semibold"
      >
        <Logo className="size-7" />
        {APP_NAME}
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t p-3">
        {token ? (
          <>
            {user && (
              <div className="px-2">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="gap-3 text-muted-foreground"
                onClick={handleSignout}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
              <ThemeToggle />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild className="flex-1" onClick={onNavigate}>
              <Link to="/signin">
                <LogIn className="size-4" />
                Sign in
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" onClick={onNavigate}>
              <Link to="/signup">Sign up</Link>
            </Button>
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { token } = useAuth();

  return (
    <div className="min-h-dvh bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        <Sidebar />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link to="/blogs" className="flex items-center gap-2 font-semibold">
          <Logo className="size-6" />
          <span className="text-sm">{APP_NAME}</span>
        </Link>

        <div className="flex items-center">
          <ThemeToggle />
          {token && (
            <Button asChild size="icon" variant="ghost" aria-label="New post">
              <Link to="/publish">
                <PenSquare className="size-5" />
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col lg:min-h-dvh lg:pl-64">
        <Outlet />
      </main>
    </div>
  );
}