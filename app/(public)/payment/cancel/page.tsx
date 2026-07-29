"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <Card className="max-w-md w-full mx-auto shadow-lg border-destructive/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">Payment Cancelled</CardTitle>
          <CardDescription className="text-base mt-2">
            You have cancelled the payment process. Your rental request has not been activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            No charges were made to your account. You can attempt the payment again from your requests page whenever you are ready.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-6">
          <Button onClick={() => router.back()} className="w-full">
            Try Payment Again
          </Button>
          <Link href="/dashboard/tenant/requests" className={buttonVariants({ variant: "outline", className: "w-full" })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Requests
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
