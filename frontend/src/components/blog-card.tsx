
import { Link } from "react-router-dom";
import { CalendarDays, Trash2 } from "lucide-react";
import type { Blog } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  publishedDate: string;
  onDelete?: (id: string) => Promise<boolean>;
}

export default function BlogCard({
  id,
  title,
  content,
  authorName,
  publishedDate,
  onDelete,
}: BlogCardProps) {
  const date = publishedDate
    ? new Date(publishedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  const preview =
    content.length > 180 ? `${content.slice(0, 180)}...` : content;

  return (
    <article className="flex items-start justify-between gap-4 py-6">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{authorName}</p>

        <Link
          to={`/blog/${encodeURIComponent(id)}`}
          className="mt-2 block"
        >
          <h2 className="break-words font-serif text-xl font-semibold hover:underline sm:text-2xl">
            {title}
          </h2>
        </Link>

        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
          {preview}
        </p>

        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {date}
        </p>
      </div>

      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${title}`}
          onClick={async () => {
            if (window.confirm(`Delete "${title}"?`)) {
              await onDelete(id);
            }
          }}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      )}
    </article>
  );
}