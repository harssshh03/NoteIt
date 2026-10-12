
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export interface Blog {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  published?: boolean;
  author?: {
    name: string | null;
  };
}

interface BlogResponse {
  blog: {
    id: number | string;
    title: string;
    content: string;
    publishedDate: string;
    published?: boolean;
    author?: {
      name: string | null;
    };
  } | null;
}

interface BlogsResponse {
  blogs: Array<{
    id: number | string;
    title: string;
    content: string;
    publishedDate: string;
    published?: boolean;
    author?: {
      name: string | null;
    };
  }>;
}

const BULK_URL = `${BACKEND_URL}/api/v1/blog/bulk`;

const blogUrl = (id: string) =>
  `${BACKEND_URL}/api/v1/blog/${encodeURIComponent(id)}`;

function normalizeBlog(blog: BlogsResponse["blogs"][number]): Blog {
  return {
    ...blog,
    id: String(blog.id),
  };
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<BlogsResponse>(BULK_URL);

      if (!Array.isArray(response.data.blogs)) {
        throw new Error("Invalid response received from the server.");
      }

      setBlogs(response.data.blogs.map(normalizeBlog));
    } catch (err: unknown) {
      console.error("Failed to fetch all blogs:", err);

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.msg ?? "Failed to load blogs."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
}

export function useBlog({ id }: { id: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBlog() {
      setLoading(true);
      setError(null);
      setBlog(null);

      if (!id || !/^\d+$/.test(id)) {
        setError("Invalid blog ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<BlogResponse>(blogUrl(id));

        if (!response.data.blog) {
          throw new Error("Blog not found.");
        }

        if (!cancelled) {
          setBlog({
            ...response.data.blog,
            id: String(response.data.blog.id),
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            axios.isAxiosError(err)
              ? err.response?.data?.msg ?? "Failed to load this blog."
              : err instanceof Error
                ? err.message
                : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchBlog();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { blog, loading, error };
}