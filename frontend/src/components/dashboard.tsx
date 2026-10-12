import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, PenSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HookSidebar } from "@/components/ui/hook-sidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themetoggle";
import { APP_NAME, BRAND_COLOR } from "@/lib/brand";
import { useAuth } from "@/context/auth";

const PUBLIC_ITEMS = [{ label: "All blogs", to: "/blogs" }];
const PRIVATE_ITEMS = [
  { label: "All blogs", to: "/blogs" },
  { label: "My blogs", to: "/my-blogs" },
  { label: "New post", to: "/publish" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { token, user, signout } = useAuth();

  const items = token ? PRIVATE_ITEMS : PUBLIC_ITEMS;

  const found = items.findIndex((i) =>
    i.to === "/blogs" ? pathname === "/blogs" || pathname.startsWith("/blog/") : pathname.startsWith(i.to)
  );
  const active = found === -1 ? 0 : found;

  function go(index: number) {
    navigate(items[index].to);
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
        to="/blogs"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 py-4 font-semibold"
      >
        <Logo className="size-7" />
        {APP_NAME}
      </Link>

      <div className="flex-1 px-4 pt-2">
        <HookSidebar
          label="Workspace"
          items={items.map(({ label }) => ({ label }))}
          value={active}
          onChange={go}
          color={BRAND_COLOR}
        />
      </div>

      <div className="space-y-2 border-t p-3">
        {token ? (
          <>
            {user && (
              <div className="px-3 pb-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <div className="flex items-center justify-between gap-1">
              <Button
                variant="ghost"
                className="cursor-pointer justify-start gap-3 text-muted-foreground"
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

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { token } = useAuth();

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarContent onNavigate={() => setOpen(false)} />
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
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;