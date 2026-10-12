
import { Hono } from "hono";
import { verify } from "hono/jwt";

const middleware = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

middleware.use("/blog/*", async (c, next) => {
  const header = c.req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return c.json({ msg: "Missing or invalid Authorization header" }, 401);
  }

  const token = header.slice(7).trim();

  if (!token) {
    return c.json({ msg: "Token is missing" }, 401);
  }

  try {
   const decoded = await verify(token, c.env.JWT_SECRET, "HS256");

    if (decoded.id === undefined || decoded.id === null) {
      return c.json({ msg: "Invalid token payload" }, 401);
    }

    c.set("userId", String(decoded.id));
    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return c.json({ msg: "Invalid or expired token" }, 401);
  }
});

export default middleware;