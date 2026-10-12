import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  createBlogSchema,
  updateBlogSchema,
} from "@harshchalwadi/medium-app";

const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const blogSelect = {
  id: true,
  title: true,
  content: true,
  published: true,
  publishedDate: true,
  authorId: true,
  author: {
    select: { name: true },
  },
} as const;

async function authenticate(c: {
  req: { header: (name: string) => string | undefined };
  env: { JWT_SECRET: string };
}) {
  const header = c.req.header("Authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();

  if (!token) {
    return null;
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET, "HS256");

    if (payload.id === undefined || payload.id === null) {
      return null;
    }

    const userId = Number(payload.id);

    return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
}

function getPrisma(databaseUrl: string) {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());
}

// GET /api/v1/blog/bulk — public feed
blog.get("/bulk", async (c) => {
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);

    const blogs = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedDate: "desc" },
      select: blogSelect,
    });

    return c.json({ blogs });
  } catch (error) {
    console.error("GET /bulk failed:", error);
    return c.json({ msg: "Failed to fetch blogs" }, 500);
  }
});

// GET /api/v1/blog/me — authenticated user's blogs
blog.get("/me", async (c) => {
  const userId = await authenticate(c);

  if (userId === null) {
    return c.json({ msg: "Invalid or missing token" }, 401);
  }

  try {
    const prisma = getPrisma(c.env.DATABASE_URL);

    const blogs = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { publishedDate: "desc" },
      select: blogSelect,
    });

    return c.json({ blogs });
  } catch (error) {
    console.error("GET /me failed:", error);
    return c.json({ msg: "Failed to fetch your blogs" }, 500);
  }
});

// POST /api/v1/blog — create blog
blog.post("/", async (c) => {
  const userId = await authenticate(c);

  if (userId === null) {
    return c.json({ msg: "Invalid or missing token" }, 401);
  }

  try {
    const body = await c.req.json();
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ msg: "Invalid blog data" }, 400);
    }

    const prisma = getPrisma(c.env.DATABASE_URL);

    const createdBlog = await prisma.post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        authorId: userId,
        published: true,
      },
    });

    return c.json(
      {
        msg: "Blog created successfully",
        blog: createdBlog,
      },
      201
    );
  } catch (error) {
    console.error("POST /blog failed:", error);
    return c.json({ msg: "Failed to create blog" }, 500);
  }
});

// PUT /api/v1/blog — update blog (author only)
blog.put("/", async (c) => {
  const userId = await authenticate(c);

  if (userId === null) {
    return c.json({ msg: "Invalid or missing token" }, 401);
  }

  try {
    const body = await c.req.json();
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ msg: "Invalid blog data" }, 400);
    }

    const prisma = getPrisma(c.env.DATABASE_URL);
    const { id, title, content } = parsed.data;

    const existingBlog = await prisma.post.findFirst({
      where: {
        id: Number(id),
        authorId: userId,
      },
    });

    if (!existingBlog) {
      return c.json({ msg: "Blog not found or access denied" }, 404);
    }

    const updatedBlog = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    return c.json({
      msg: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("PUT /blog failed:", error);
    return c.json({ msg: "Failed to update blog" }, 500);
  }
});

// DELETE /api/v1/blog/:id — author only
blog.delete("/:id", async (c) => {
  const userId = await authenticate(c);

  if (userId === null) {
    return c.json({ msg: "Invalid or missing token" }, 401);
  }

  const id = Number(c.req.param("id"));

  if (!Number.isSafeInteger(id) || id <= 0) {
    return c.json({ msg: "Invalid blog ID" }, 400);
  }

  try {
    const prisma = getPrisma(c.env.DATABASE_URL);

    const existingBlog = await prisma.post.findFirst({
      where: { id, authorId: userId },
    });

    if (!existingBlog) {
      return c.json({ msg: "Blog not found or access denied" }, 404);
    }

    await prisma.post.delete({ where: { id } });

    return c.json({ msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("DELETE /blog/:id failed:", error);
    return c.json({ msg: "Failed to delete blog" }, 500);
  }
});

// GET /api/v1/blog/:id — public blog detail (keep this LAST)
blog.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isSafeInteger(id) || id <= 0) {
    return c.json({ msg: "Invalid blog ID" }, 400);
  }

  try {
    const prisma = getPrisma(c.env.DATABASE_URL);

    const foundBlog = await prisma.post.findUnique({
      where: { id },
      select: blogSelect,
    });

    if (!foundBlog || !foundBlog.published) {
      return c.json({ msg: "Blog not found" }, 404);
    }

    return c.json({ blog: foundBlog });
  } catch (error) {
    console.error("GET /blog/:id failed:", error);
    return c.json({ msg: "Failed to fetch blog" }, 500);
  }
});

export default blog;