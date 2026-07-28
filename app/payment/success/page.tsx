"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircle2, Loader2, Home } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate payments and requests to refresh data
    queryClient.invalidateQueries({ queryKey: ["my-payments"] });
    queryClient.invalidateQueries({ queryKey: ["my-requests"] });
  }, [queryClient]);

  return (
    <Card className="max-w-md mx-auto mt-12 shadow-lg border-emerald-500/20">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <CardTitle className="text-2xl text-emerald-600">Payment Successful!</CardTitle>
        <CardDescription className="text-base mt-2">
          Your payment has been processed successfully and your rental request is now ACTIVE.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          A receipt has been sent to your email. You can now contact the landlord to arrange move-in details.
        </p>
        {sessionId && (
          <div className="text-xs font-mono bg-muted p-2 rounded text-muted-foreground break-all">
            Session ID: {sessionId}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-6">
        <Link href="/dashboard/tenant/requests" className={buttonVariants({ className: "w-full" })}>View My Requests</Link>
        <Link href="/dashboard/tenant" className={buttonVariants({ variant: "outline", className: "w-full" })}>
          <Home className="mr-2 h-4 w-4" /> Return to Dashboard
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-emerald-500" />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
