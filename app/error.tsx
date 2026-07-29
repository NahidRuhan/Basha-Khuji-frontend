"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full min-h-[70vh]">
      <AlertOctagon className="h-24 w-24 text-destructive opacity-80 mb-6" />
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
        An unexpected error has occurred. We&apos;ve been notified and are looking into it.
      </p>
      <div className="flex gap-4">
        <Button size="lg" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
