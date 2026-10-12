
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PenSquare, Search } from "lucide-react";

import { useBlogs, useMyBlogs, type Blog } from "@/hooks/useBlogs";
import BlogCard from "@/components/blog-card";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function BlogList({
  blogs,
  loading,
  error,
  onDelete,
}: {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  onDelete?: (id: string) => Promise<boolean>;
}) {
  const [query, setQuery] = useState("");

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-9"
        />
      </div>

      {loading && (
        <div className="mt-4 space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-3 py-5">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="py-10 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && filteredBlogs.length > 0 && (
        <div className="mt-4 divide-y border-t">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              content={blog.content}
              authorName={blog.author?.name ?? "Unknown Author"}
              publishedDate={blog.publishedDate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredBlogs.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          {blogs.length === 0
            ? "No blogs found."
            : "No posts match your search."}
        </div>
      )}
    </div>
  );
}

function AllBlogs() {
  const { blogs, loading, error } = useBlogs();

  return (
    <BlogList
      blogs={blogs}
      loading={loading}
      error={error}
    />
  );
}

function MyBlogs() {
  const { blogs, loading, error, removeBlog } = useMyBlogs();

  return (
    <>
      <div className="mt-5">
        <Button asChild>
          <Link to="/publish">
            <PenSquare className="mr-2 size-4" />
            New blog
          </Link>
        </Button>
      </div>

      <BlogList
        blogs={blogs}
        loading={loading}
        error={error}
        onDelete={removeBlog}
      />
    </>
  );
}

export default function Blogs() {
  const [params, setParams] = useSearchParams();
  const mine = params.get("view") === "mine";

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            {mine ? "My blogs" : "All blogs"}
          </h1>

          <div className="flex gap-2">
            <Button
              variant={mine ? "outline" : "default"}
              onClick={() => setParams({})}
            >
              All blogs
            </Button>

            <Button
              variant={mine ? "default" : "outline"}
              onClick={() => setParams({ view: "mine" })}
            >
              My blogs
            </Button>
          </div>
        </div>

        {mine ? <MyBlogs /> : <AllBlogs />}
      </main>
    </DashboardLayout>
  );
}