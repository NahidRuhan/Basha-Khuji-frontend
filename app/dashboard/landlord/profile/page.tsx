"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useUpdateProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle, Mail, Phone, Briefcase, MapPin } from "lucide-react";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";

export default function LandlordProfilePage() {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    occupation: "",
    address: "",
    profileImage: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        phoneNumber: user.phoneNumber || "",
        occupation: user.occupation || "",
        address: user.address || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImageToImgBB(file);
      setFormData(prev => ({ ...prev, profileImage: url }));
      toast.success("Image uploaded successfully. Save changes to update profile.");
    } catch (error) {
      console.error("Failed to upload image", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and contact details.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Tenants will see this information on your property listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex items-center gap-6 pb-6 border-b">
              <div className="h-24 w-24 rounded-full bg-muted flex flex-col items-center justify-center border relative overflow-hidden group">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                )}
                
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-xs font-medium px-2 text-center">Change Image</span>
                  )}
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  onChange={handleImageUpload}
                  disabled={isUploading || isPending}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.userName}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user?.role.toLowerCase()}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="userName">Full Name</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="userName" 
                    className="pl-9" 
                    value={formData.userName} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phoneNumber" 
                    className="pl-9" 
                    placeholder="+880 1..."
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="occupation" 
                    className="pl-9" 
                    placeholder="e.g. Property Manager"
                    value={formData.occupation} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="address" 
                    className="pl-9" 
                    placeholder="e.g. Gulshan, Dhaka"
                    value={formData.address} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t p-4 bg-muted/10">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
