
import { Link } from "react-router-dom";
import { CalendarDays, UserRound } from "lucide-react";
import type { Blog } from "@/hooks/useBlogs";

export default function UserBlogs({ blog }: { blog: Blog }) {
  const authorName = blog.author?.name ?? "Unknown Author";

  const date = blog.publishedDate
    ? new Date(blog.publishedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <article className="space-y-6">
      <Link
        to="/blogs"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to blogs
      </Link>

      <header className="space-y-4">
        <h1 className="break-words font-serif text-3xl font-bold sm:text-4xl">
          {blog.title}
        </h1>

        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4" />
            {authorName}
          </span>

          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" />
            {date}
          </span>
        </div>
      </header>

      <div className="h-px bg-border" />

      <div className="whitespace-pre-wrap break-words text-base leading-8">
        {blog.content}
      </div>
    </article>
  );
}