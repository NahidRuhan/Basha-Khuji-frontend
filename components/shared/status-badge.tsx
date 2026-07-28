import { Badge } from "@/components/ui/badge";
import { RentalRequestStatus, PaymentStatus, UserRole, UserStatus } from "@/types";

interface StatusBadgeProps {
  status: RentalRequestStatus | PaymentStatus | UserRole | UserStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getBadgeVariant = () => {
    switch (status) {
      // Rental Request Statuses
      case RentalRequestStatus.PENDING:
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20";
      case RentalRequestStatus.APPROVED:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case RentalRequestStatus.REJECTED:
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
      case RentalRequestStatus.ACTIVE:
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
      case RentalRequestStatus.COMPLETED:
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20";
        
      // Payment Statuses (some overlap with Rental)
      case PaymentStatus.FAILED:
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
        
      // User Roles
      case UserRole.ADMIN:
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20";
      case UserRole.LANDLORD:
        return "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20";
      case UserRole.TENANT:
        return "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 border-teal-500/20";
        
      // User Statuses
      case UserStatus.BANNED:
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
        
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20";
    }
  };

  return (
    <Badge variant="outline" className={`${getBadgeVariant()} ${className}`}>
      {status}
    </Badge>
  );
}
