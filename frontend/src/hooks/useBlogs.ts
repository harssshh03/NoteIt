import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/api";

export interface Blog {
  id: number;
  title: string;
  content: string;
  published: boolean;
  publishedDate: string;
  authorId?: number;
  author: { name: string | null } | null;
}

/** Tiny GET helper: loading / error / data / reload. */
function useRequest<T>(path: string | null, key: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(path !== null);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef(0);

  const load = useCallback(async () => {
    if (!path) return;
    const run = ++latest.current;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(path);
      if (run === latest.current) setData(res.data[key]);
    } catch (err) {
      if (run === latest.current) setError(errorMessage(err, "Failed to load."));
    } finally {
      if (run === latest.current) setLoading(false);
    }
  }, [path, key]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
}

/** Public feed */
export function useBlogs() {
  const { data, loading, error, reload } = useRequest<Blog[]>("/blog/bulk", "blogs");
  return { blogs: data ?? [], loading, error, refetch: reload };
}

/** Single blog */
export function useBlog(id: number) {
  const valid = Number.isInteger(id) && id > 0;
  const { data, loading, error } = useRequest<Blog>(valid ? `/blog/${id}` : null, "blog");
  return { blog: data, loading, error: valid ? error : "Invalid blog ID." };
}

/** Logged-in user's blogs (+ delete) */
export function useMyBlogs() {
  const { data, setData, loading, error, reload } = useRequest<Blog[]>("/blog/me", "blogs");

  async function deleteBlog(id: number) {
    await api.delete(`/blog/${id}`);
    setData((prev) => prev?.filter((b) => b.id !== id) ?? null);
  }

  return { blogs: data ?? [], loading, error, refetch: reload, deleteBlog };
}