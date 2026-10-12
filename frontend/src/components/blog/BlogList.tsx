import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/icons/spinner";
import { BlogCard } from "@/components/blog/BlogCard";
import type { Blog } from "@/hooks/useBlogs";

type Props = {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  empty: ReactNode;
  showAuthor?: boolean;
  actions?: (blog: Blog) => ReactNode;
};

export function BlogList({ blogs, loading, error, onRetry, empty, showAuthor, actions }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 py-20 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-dashed py-16 text-center">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((b) => (
        <BlogCard key={b.id} blog={b} showAuthor={showAuthor} actions={actions?.(b)} />
      ))}
    </div>
  );
}