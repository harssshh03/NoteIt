import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, PenSquare, Trash2 } from "lucide-react";

import { useMyBlogs } from "@/hooks/useBlogs";
import { errorMessage } from "@/lib/api";
import { BlogList } from "@/components/blog/BlogList";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/icons/spinner";

export default function MyBlogs() {
  const { blogs, loading, error, refetch, deleteBlog } = useMyBlogs();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteBlog(id);
    } catch (err) {
      window.alert(errorMessage(err, "Could not delete this blog."));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">My blogs</h1>
          <p className="text-sm text-muted-foreground">
            {blogs.length} {blogs.length === 1 ? "story" : "stories"}
          </p>
        </div>
        <Button asChild>
          <Link to="/publish">
            <PenSquare className="size-4" />
            New post
          </Link>
        </Button>
      </header>

      <BlogList
        blogs={blogs}
        loading={loading}
        error={error}
        onRetry={() => void refetch()}
        showAuthor={false}
        empty={
          <>
            <p className="text-muted-foreground">You haven't published anything yet.</p>
            <Button asChild>
              <Link to="/publish">Write your first story</Link>
            </Button>
          </>
        }
        actions={(b) => (
          <>
            <Button asChild variant="outline" size="sm">
              <Link to={`/blog/${b.id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={deletingId === b.id}
              onClick={() => void handleDelete(b.id, b.title)}
            >
              {deletingId === b.id ? <Spinner /> : <Trash2 className="size-4" />}
              Delete
            </Button>
          </>
        )}
      />
    </div>
  );
}