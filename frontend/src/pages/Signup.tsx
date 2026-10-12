
import { useState } from "react";
import type { FormEvent } from "react";
import type { SignupType } from "@harshchalwadi/medium-app";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { BACKEND_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/passwordinput";
import { Spinner } from "@/components/icons/spinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<SignupType>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        form
      );

      const token: unknown = response.data?.token;

      if (typeof token !== "string" || !token.trim()) {
        throw new Error("Server did not return a valid token.");
      }

      localStorage.setItem("token", token);

      navigate("/blogs", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.msg ??
            "Unable to create your account. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
      <div className="mb-4 w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details to get started.
          </CardDescription>

          <CardAction>
            <Button variant="link" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={sendRequest}>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  required
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  required
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  value={form.password}
                  required
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      password: e.target.value,
                    }))
                  }
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading && <Spinner />}
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}