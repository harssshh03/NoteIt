import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "@/lib/api";
import { useBlog } from "@/hooks/useBlogs";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/icons/spinner";

export default function EditBlog() {
  const { id } = useParams();
  const blogId = Number(id);
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(blogId);

  async function save(data: { title: string; content: string }) {
    await api.put("/blog", { id: blogId, ...data });
    navigate(`/blog/${blogId}`);
  }

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
          <Link to="/my-blogs">Back to my blogs</Link>
        </Button>
      </div>
    );
  }

  return (
    <BlogEditor
      heading="Edit story"
      submitLabel="Save changes"
      submittingLabel="Saving..."
      cancelTo="/my-blogs"
      initialTitle={blog.title}
      initialContent={blog.content}
      onSubmit={save}
    />
  );
}