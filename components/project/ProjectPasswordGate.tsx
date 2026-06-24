"use client";

import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProjectPasswordGateProps {
  slug: string;
}

export function ProjectPasswordGate({ slug }: ProjectPasswordGateProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${slug}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "Incorrect password. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[65vh] flex-col items-center justify-center px-4 py-16">
      <Link
        href="/work"
        className="absolute left-0 top-0 inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Back to work"
      >
        <ArrowLeft className="size-4" />
      </Link>

      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-muted/50">
          <Lock className="size-5 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <h1 className="font-hero text-4xl font-bold md:text-5xl">
            Password please!
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            This page is protected. If you&apos;d like to learn more, please
            reach out to me!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="h-12 bg-background text-base"
          />

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={submitting || !password.trim()}
            className="h-12 w-full text-base"
          >
            {submitting ? "Checking..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
