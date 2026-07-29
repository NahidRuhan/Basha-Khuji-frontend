"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Receipt, Building, Calendar, CreditCard } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import api from "@/lib/api";
import { Payment, PaginatedResponse } from "@/types";
import Link from "next/link";

export default function TenantPaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Payment>>("/api/payments");
      return response.data;
    },
  });

  const payments = data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-500/10 text-emerald-500";
      case "PENDING": return "bg-orange-500/10 text-orange-500";
      case "FAILED": return "bg-destructive/10 text-destructive";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-1">View your past transactions and receipts.</p>
      </div>

      {payments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle className="mb-2">No Payments Found</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            You don&apos;t have any payment history yet. Payments will appear here once you rent a property.
          </CardDescription>
          <Link href="/dashboard/tenant/requests" className={buttonVariants({ variant: "outline" })}>View My Requests</Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {payments.map((payment) => (
            <Card key={payment.paymentId} className="overflow-hidden">
              <div className="md:flex">
                <div className="bg-muted/30 p-6 md:w-64 flex flex-col justify-center border-r md:border-b-0 border-b">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Amount Paid</div>
                  <div className="text-3xl font-bold text-primary">
                    ৳{Number(payment.amount).toLocaleString()}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className={`font-semibold border-transparent ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </Badge>
                    <Badge variant="outline" className="font-semibold capitalize border-muted-foreground/20">
                      {payment.provider.toLowerCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {payment.rentalRequest?.property?.propertyName || "Property Payment"}
                      </h3>
                      <div className="text-sm text-muted-foreground font-mono mt-1">
                        TrxID: {payment.transactionId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Date
                      </div>
                      <div className="font-medium">
                        {payment.paidAt ? format(new Date(payment.paidAt), "MMM d, yyyy h:mm a") : "N/A"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5" /> Request ID
                      </div>
                      <div className="font-mono text-xs mt-0.5 truncate" title={payment.requestId}>
                        {payment.requestId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
