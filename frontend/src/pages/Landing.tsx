import { Link } from "react-router-dom";
import { Compass, PenLine, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themetoggle";
import { APP_NAME } from "@/lib/brand";

const features = [
  {
    icon: PenLine,
    title: "Write without friction",
    text: "A clean editor with a title, a body and a Publish button. Nothing else in the way.",
  },
  {
    icon: Compass,
    title: "Read what others write",
    text: "Browse the latest posts from every writer, search by title and react with an emoji.",
  },
  {
    icon: UserRound,
    title: "Keep your own space",
    text: "Your posts live in one place, separate from the feed, ready to revisit or delete.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Features />
        <Cta />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {APP_NAME}
          </span>
          <span>Write. Publish. Read.</span>
        </div>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Logo className="size-7" />
          <span className="text-sm sm:text-base">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/signin">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Sign up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-balance font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
          A quiet place to write and be read
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground sm:mt-6 sm:text-lg">
          Publish your posts, read other writers, and keep everything you have written in one dashboard.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link to="/signup">Start writing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>
      </div>

      <Preview />
    </section>
  );
}

/* Static mock of the dashboard so the page shows the product, not a stock image */
function Preview() {
  const posts = [
    { title: "Why I stopped planning every week", author: "Aarav", date: "2 Oct 2026" },
    { title: "Notes on learning React in public", author: "Meera", date: "1 Oct 2026" },
    { title: "A small guide to writing clearly", author: "Kabir", date: "29 Sep 2026" },
  ];

  return (
    <div className="relative mx-auto mt-12 max-w-3xl sm:mt-16">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-black/5">
        <div className="flex items-center gap-1.5 border-b px-4 py-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="grid sm:grid-cols-[11rem_1fr]">
          <aside className="hidden space-y-1 border-r p-3 text-sm sm:block">
            <div className="rounded-md bg-secondary px-3 py-2 font-medium">All blogs</div>
            <div className="rounded-md px-3 py-2 text-muted-foreground">My blogs</div>
            <div className="rounded-md px-3 py-2 text-muted-foreground">New post</div>
          </aside>

          <div className="divide-y">
            {posts.map((p) => (
              <div key={p.title} className="px-4 py-4 sm:px-5">
                <p className="flex gap-3 text-xs text-muted-foreground">
                  <span>{p.author}</span>
                  <span>{p.date}</span>
                </p>
                <p className="mt-1 font-serif text-lg font-semibold">{p.title}</p>
                <div className="mt-2 h-2 w-4/5 rounded bg-muted" />
                <div className="mt-1.5 h-2 w-3/5 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="max-w-md font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything a blog needs, nothing it doesn&apos;t
        </h2>
        <div className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-balance font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        Your first post is one sign up away
      </h2>
      <div className="mt-6 flex justify-center">
        <Button asChild size="lg">
          <Link to="/signup">Create an account</Link>
        </Button>
      </div>
    </section>
  );
}

export { Logo };