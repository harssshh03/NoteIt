import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, PenSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HookSidebar } from "@/components/ui/hook-sidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themetoggle";
import { APP_NAME, BRAND_COLOR } from "@/lib/brand";
import { useAuth } from "@/context/auth";

const LINKS = [
  { to: "/blogs", label: "All blogs", private: false },
  { to: "/my-blogs", label: "My blogs", private: true },
  { to: "/publish", label: "New post", private: true },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { token, user, signout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = LINKS.filter((l) => token || !l.private);

  const found = links.findIndex((l) =>
    l.to === "/blogs"
      ? pathname === "/blogs" || (pathname.startsWith("/blog/") && !pathname.endsWith("/edit"))
      : pathname.startsWith(l.to) || (l.to === "/my-blogs" && pathname.endsWith("/edit"))
  );
  const active = found === -1 ? 0 : found;

  function go(index: number) {
    navigate(links[index].to);
    onNavigate?.();
  }

  function handleSignout() {
    signout();
    onNavigate?.();
    navigate("/", { replace: true });
  }

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 py-4 font-semibold"
      >
        <Logo className="size-7" />
        {APP_NAME}
      </Link>

      <div className="flex-1 px-4 pt-2">
        <HookSidebar
          label="Workspace"
          items={links.map(({ label }) => ({ label }))}
          value={active}
          onChange={go}
          color={BRAND_COLOR}
        />
      </div>

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
  const { pathname } = useLocation();

  // editor pages have their own top bar, so hide the app bar on mobile
  const isEditor = pathname === "/publish" || pathname.endsWith("/edit");

  return (
    <div className="min-h-dvh bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        <Sidebar />
      </aside>

      {/* mobile top bar (no logo) */}
      {!isEditor && (
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
      )}

      <main
        className={
          isEditor
            ? "flex min-h-dvh flex-col lg:pl-64"
            : "flex min-h-[calc(100dvh-3.5rem)] flex-col lg:min-h-dvh lg:pl-64"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}