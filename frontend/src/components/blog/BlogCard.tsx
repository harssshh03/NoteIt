import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate, readMinutes } from "@/lib/format";
import type { Blog } from "@/hooks/useBlogs";

type Props = {
  blog: Blog;
  showAuthor?: boolean;
  actions?: ReactNode;
};

export function BlogCard({ blog, showAuthor = true, actions }: Props) {
  return (
    <Card className="transition-colors hover:bg-muted/40">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Link to={`/blog/${blog.id}`} className="min-w-0 flex-1 space-y-2">
          <p className="text-xs text-muted-foreground">
            {showAuthor && <>{blog.author?.name ?? "Unknown"} · </>}
            {formatDate(blog.publishedDate)} · {readMinutes(blog.content)} min read
          </p>
          <h2 className="line-clamp-2 break-words font-serif text-xl font-semibold">
            {blog.title}
          </h2>
          <p className="line-clamp-3 text-sm text-muted-foreground">{blog.content}</p>
        </Link>

        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}