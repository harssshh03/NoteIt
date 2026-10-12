
import { Link, useParams } from "react-router-dom";

import { useBlog } from "@/hooks/useBlogs";
import UserBlogs from "@/components/user-blogs";
import { DashboardLayout } from "@/components/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const { blog, loading, error } = useBlog({ id: id ?? "" });

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <p className="text-destructive">{error}</p>
            <Button asChild variant="outline">
              <Link to="/blogs">Back to blogs</Link>
            </Button>
          </div>
        )}

        {!loading && !error && blog && <UserBlogs blog={blog} />}
      </main>
    </DashboardLayout>
  );
}