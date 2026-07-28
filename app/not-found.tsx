import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <FileQuestion className="h-24 w-24 text-muted-foreground opacity-50 mb-6" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
