import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BACKEND_URL } from "@/lib/config";
import { useAuth } from "@/context/auth";
import { useBlog } from "@/hooks/useBlogs";
import { DashboardLayout } from "@/components/dashboard";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/icons/spinner";

export default function EditBlog() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { blog, loading, error } = useBlog({ id });

  async function save(data: { title: string; content: string }) {
    await axios.put(
      `${BACKEND_URL}/api/v1/blog`,
      { id: Number(id), ...data },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate(`/blog/${id}`);
  }

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : error || !blog ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-muted-foreground">{error ?? "Blog not found."}</p>
          <Button asChild variant="outline">
            <Link to="/my-blogs">Back to my blogs</Link>
          </Button>
        </div>
      ) : (
        <BlogEditor
          heading="Edit story"
          submitLabel="Save changes"
          submittingLabel="Saving..."
          cancelTo="/my-blogs"
          initialTitle={blog.title}
          initialContent={blog.content}
          onSubmit={save}
        />
      )}
    </DashboardLayout>
  );
}