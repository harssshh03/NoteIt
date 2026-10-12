import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().trim().min(1, "Content is required"),
});

export const updateBlogSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().trim().min(1, "Content is required"),
});