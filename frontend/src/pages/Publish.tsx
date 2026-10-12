
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL } from "@/lib/config";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function Publish() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const words = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  const canPublish =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    !publishing;

  async function sendPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and content.");
      return;
    }

    setPublishing(true);
    setError("");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title: title.trim(),
          content: content.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blogId = response.data?.blog?.id;

      if (blogId === undefined || blogId === null) {
        throw new Error("Blog was created, but no blog ID was returned.");
      }

      navigate(`/blog/${blogId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
          return;
        }

        setError(
          err.response?.data?.msg ??
            "Unable to publish your blog. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while publishing.");
      }
    } finally {
      setPublishing(false);
    }
  }

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <form onSubmit={sendPost} className="space-y-4">
          <Input
            placeholder="Title of your story"
            aria-label="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            required
            className="h-auto border-0 bg-transparent px-0 font-serif text-3xl font-semibold shadow-none focus-visible:ring-0 md:text-4xl"
          />

          <Separator />

          <Textarea
            placeholder="Tell your story..."
            aria-label="Blog content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="min-h-[50vh] resize-y border-0 bg-transparent px-0 font-serif text-lg leading-8 shadow-none focus-visible:ring-0 md:text-xl md:leading-9"
          />

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between border-t py-4">
            <span className="text-sm text-muted-foreground">
              {words} {words === 1 ? "word" : "words"}
            </span>

            <Button type="submit" disabled={!canPublish}>
              {publishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </main>
    </DashboardLayout>
  );
}