
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { compare, hash } from "bcryptjs";
import {
  signinSchema,
  signupSchema,
} from "@harshchalwadi/medium-app";

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// POST /api/v1/user/signup
user.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ msg: "Invalid signup data" }, 400);
    }

    const { name, email, password } = parsed.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ msg: "Email already registered" }, 409);
    }

    const passwordHash = await hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    const token = await sign(
      {
        id: String(createdUser.id),
        email: createdUser.email,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      },
      c.env.JWT_SECRET
    );

    return c.json(
      {
        msg: "User created successfully",
        token,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        },
      },
      201
    );
  } catch (error) {
    console.error("Signup failed:", error);
    return c.json({ msg: "Signup failed" }, 500);
  }
});

// POST /api/v1/user/signin
user.post("/signin", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signinSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ msg: "Invalid signin data" }, 400);
    }

    const { email, password } = parsed.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return c.json({ msg: "Invalid email or password" }, 401);
    }

    const passwordValid = await compare(
      password,
      existingUser.password
    );

    if (!passwordValid) {
      return c.json({ msg: "Invalid email or password" }, 401);
    }

    const token = await sign(
      {
        id: String(existingUser.id),
        email: existingUser.email,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      },
      c.env.JWT_SECRET
    );

    return c.json({
      msg: "Signin successful",
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Signin failed:", error);
    return c.json({ msg: "Signin failed" }, 500);
  }
});

export default user;