import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Pencil, UserRound } from "lucide-react";

import { useBlog } from "@/hooks/useBlogs";
import { useAuth } from "@/context/auth";
import { formatDate, readMinutes } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/icons/spinner";

export default function BlogPage() {
  const { id } = useParams();
  const { blog, loading, error } = useBlog(Number(id));
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">{error ?? "Blog not found."}</p>
        <Button asChild variant="outline">
          <Link to="/blogs">Back to blogs</Link>
        </Button>
      </div>
    );
  }

  const isOwner = !!user && blog.authorId === user.id;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="-ml-3 mb-6">
        <Link to="/blogs">
          <ArrowLeft className="size-4" />
          All blogs
        </Link>
      </Button>

      <h1 className="break-words font-serif text-4xl font-bold leading-tight">
        {blog.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b pb-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4" />
            {blog.author?.name ?? "Unknown"}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" />
            {formatDate(blog.publishedDate)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4" />
            {readMinutes(blog.content)} min read
          </span>
        </div>

        {isOwner && (
          <Button asChild variant="outline" size="sm">
            <Link to={`/blog/${blog.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-8 whitespace-pre-wrap break-words font-serif text-lg leading-8">
        {blog.content}
      </div>
    </article>
  );
}