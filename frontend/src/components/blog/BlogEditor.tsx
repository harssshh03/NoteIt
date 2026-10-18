import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/icons/spinner";
import { useAuth } from "@/context/auth";

type Props = {
  heading: string;
  submitLabel: string;
  submittingLabel: string;
  cancelTo: string;
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
};

export function BlogEditor({
  heading,
  submitLabel,
  submittingLabel,
  cancelTo,
  initialTitle = "",
  initialContent = "",
  onSubmit,
}: Props) {
  const { signout } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // auto-grow textarea
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readMin = Math.max(1, Math.ceil(words / 200));
  const canSubmit = title.trim() && content.trim() && !saving;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError("");
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        signout(); // ProtectedRoute redirects to /signin
        return;
      }
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.msg ?? "Something went wrong. Please try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      {/* sticky action bar */}
      <div className="sticky top-14 z-10 border-b bg-background/80 backdrop-blur lg:top-0">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" aria-label="Back">
              <Link to={cancelTo}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <span className="text-sm font-medium">{heading}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {words} {words === 1 ? "word" : "words"} · {readMin} min read
            </span>
            <Button type="submit" disabled={!canSubmit}>
              {saving && <Spinner />}
              {saving ? submittingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        {/*
          Borderless, background-less fields.
          `dark:bg-transparent` is needed because shadcn's Input/Textarea ship
          with `dark:bg-input/30`, which `bg-transparent` alone doesn't override.
        */}
        <Input
          placeholder="Title"
          aria-label="Blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          autoFocus
          className="h-auto rounded-none border-0 border-b border-dashed border-border bg-transparent px-0 pb-4 pt-2 font-serif text-4xl font-bold shadow-none placeholder:text-muted-foreground/70 focus-visible:border-ring/60 focus-visible:ring-0 dark:bg-transparent md:text-5xl"
        />

        <Textarea
          ref={areaRef}
          placeholder="Tell your story..."
          aria-label="Blog content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-6 min-h-[55vh] resize-none overflow-hidden rounded-none border-0 bg-transparent px-0 font-serif text-lg leading-8 shadow-none placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent md:text-xl md:leading-9"
        />

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}