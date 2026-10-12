import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, PenSquare, Trash2 } from "lucide-react";

import { useMyBlogs } from "@/hooks/usemyblogs";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/icons/spinner";

export default function MyBlogs() {
  const { blogs, loading, error, refetch, deleteBlog } = useMyBlogs();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteBlog(id);
    } catch {
      window.alert("Could not delete this blog. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
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
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : error ? (
          <div className="space-y-3 py-20 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="space-y-4 rounded-lg border border-dashed py-20 text-center">
            <p className="text-muted-foreground">You haven't published anything yet.</p>
            <Button asChild>
              <Link to="/publish">Write your first story</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => (
              <Card key={b.id}>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <Link to={`/blog/${b.id}`} className="min-w-0 flex-1 space-y-1">
                    <h2 className="truncate font-serif text-xl font-semibold hover:underline">
                      {b.title}
                    </h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {b.content}
                    </p>
                    <p className="pt-1 text-xs text-muted-foreground">
                      {new Date(b.publishedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </Link>

                  <div className="flex shrink-0 gap-2">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}