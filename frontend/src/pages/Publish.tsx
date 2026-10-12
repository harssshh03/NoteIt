import { useNavigate } from "react-router-dom";

import { api } from "@/lib/api";
import { BlogEditor } from "@/components/blog/BlogEditor";

export default function Publish() {
  const navigate = useNavigate();

  async function publish(data: { title: string; content: string }) {
    const res = await api.post("/blog", data);
    const id = res.data?.blog?.id;
    if (id === undefined) throw new Error("Blog was created, but no ID was returned.");
    navigate(`/blog/${id}`);
  }

  return (
    <BlogEditor
      heading="New story"
      submitLabel="Publish"
      submittingLabel="Publishing..."
      cancelTo="/my-blogs"
      onSubmit={publish}
    />
  );
}