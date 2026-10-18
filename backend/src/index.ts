
import { Hono } from "hono";
import { cors } from "hono/cors";

import user from "./routes/user";
import blog from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://noteit.harssh.xyz",
  "https://harrsh.xyz",
  "https://note-it.vercel.app",
];

app.use(
  "*",
  cors({
    origin: (origin) =>
      allowedOrigins.includes(origin) ? origin : "",
    credentials: true,
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.route("/api/v1/user", user);
app.route("/api/v1/blog", blog);

app.get("/", (c) => c.text("Post here .."));

export default app;