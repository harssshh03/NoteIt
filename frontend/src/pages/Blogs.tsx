import { useBlogs } from "@/hooks/useBlogs";
import { BlogList } from "@/components/blog/BlogList";

export default function Blogs() {
  const { blogs, loading, error, refetch } = useBlogs();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Latest stories</h1>
        <p className="text-sm text-muted-foreground">See what people are writing.</p>
      </header>

      <BlogList
        blogs={blogs}
        loading={loading}
        error={error}
        onRetry={() => void refetch()}
        empty={<p className="text-muted-foreground">No stories yet.</p>}
      />
    </div>
  );
}