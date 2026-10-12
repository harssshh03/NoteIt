import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { BACKEND_URL } from "@/lib/config";
import { useAuth } from "@/context/auth";

export interface MyBlog {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  published?: boolean;
  author?: { name: string | null };
}

export function useMyBlogs() {
  const { token, signout } = useAuth();
  const [blogs, setBlogs] = useState<MyBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/blog/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(
        (res.data.blogs ?? []).map((b: MyBlog) => ({ ...b, id: String(b.id) }))
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        signout();
        return;
      }
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.msg ?? "Failed to load your blogs."
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [token, signout]);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  async function deleteBlog(id: string) {
    await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, { headers });
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  }

  return { blogs, loading, error, refetch: fetchBlogs, deleteBlog };
}