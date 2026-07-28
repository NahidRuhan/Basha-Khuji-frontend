"use client";

import { useAllUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, ShieldAlert, CheckCircle, Ban, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminUsersPage() {
  const { data, isLoading } = useAllUsers();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "BANNED" | null>(null);

  const users = data?.data?.user || [];

  const handleUpdateStatus = (userId: string, status: "ACTIVE" | "BANNED") => {
    updateStatus(
      { userId, status },
      { onSuccess: () => setConfirmUserId(null) }
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Admin</Badge>;
      case "LANDLORD":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Landlord</Badge>;
      case "TENANT":
        return <Badge className="bg-green-500 hover:bg-green-600">Tenant</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
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
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all users across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users ({users.length})
          </CardTitle>
          <CardDescription>
            Active and banned users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.userId} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.profileImage || ""} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {user.userName?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{user.userName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <span className="flex items-center text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" /> {user.email}
                            </span>
                            {user.phoneNumber && (
                              <span className="flex items-center text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1" /> {user.phoneNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4">
                          {user.status === "ACTIVE" ? (
                            <span className="inline-flex items-center text-emerald-500 font-medium text-xs bg-emerald-500/10 px-2 py-1 rounded-full">
                              <CheckCircle className="h-3 w-3 mr-1" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-destructive font-medium text-xs bg-destructive/10 px-2 py-1 rounded-full">
                              <Ban className="h-3 w-3 mr-1" /> Banned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(user.createdAt || new Date()), "MMM d, yyyy")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.role !== "ADMIN" && (
                            <Dialog open={confirmUserId === user.userId} onOpenChange={(open) => !open && setConfirmUserId(null)}>
                              <DialogTrigger 
                                render={
                                  <Button 
                                    variant={user.status === "ACTIVE" ? "destructive" : "outline"} 
                                    size="sm"
                                    onClick={() => {
                                      setConfirmUserId(user.userId);
                                      setNewStatus(user.status === "ACTIVE" ? "BANNED" : "ACTIVE");
                                    }}
                                  >
                                    {user.status === "ACTIVE" ? (
                                      <><Ban className="h-3 w-3 mr-2" /> Ban User</>
                                    ) : (
                                      <><CheckCircle className="h-3 w-3 mr-2 text-emerald-500" /> Unban</>
                                    )}
                                  </Button>
                                }
                              />
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-destructive" />
                                    Confirm Action
                                  </DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to {newStatus === "BANNED" ? "ban" : "unban"} <strong>{user.userName}</strong>?
                                    {newStatus === "BANNED" && " They will not be able to log in or use the platform."}
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setConfirmUserId(null)}>Cancel</Button>
                                  <Button 
                                    variant={newStatus === "BANNED" ? "destructive" : "default"}
                                    onClick={() => {
                                      if (newStatus) {
                                        handleUpdateStatus(user.userId, newStatus);
                                      }
                                    }}
                                    disabled={isPending}
                                  >
                                    {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
