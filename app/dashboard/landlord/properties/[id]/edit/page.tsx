"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProperty, useUpdateProperty } from "@/hooks/use-properties";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { uploadImageToImgBB } from "@/lib/imgbb";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const { data: propertyData, isLoading } = useProperty(propertyId);
  const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty();

  const [formData, setFormData] = useState({
    propertyName: "",
    price: "",
    address: "",
    description: "",
    bedroomCount: "",
    squarefoot: "",
    isAvailable: true,
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [prevPropertyData, setPrevPropertyData] = useState(propertyData);

  if (propertyData !== prevPropertyData) {
    setPrevPropertyData(propertyData);
    if (propertyData?.data) {
      const p = propertyData.data;
      setFormData({
        propertyName: p.propertyName || "",
        price: p.price ? p.price.toString() : "",
        address: p.address || "",
        description: p.description || "",
        bedroomCount: p.bedroomCount ? p.bedroomCount.toString() : "",
        squarefoot: p.squarefoot ? p.squarefoot.toString() : "",
        isAvailable: p.isAvailable ?? true,
      });
      setAmenities(p.amenities || []);
      setImages(p.images || []);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isAvailable: checked }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploadingImages(true);
      const uploadPromises = files.map(file => uploadImageToImgBB(file));
      const urls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded successfully.`);
    } catch (error) {
      console.error("Failed to upload images", error);
      toast.error("Failed to upload some images. Please try again.");
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }

    const payload = {
      propertyName: formData.propertyName,
      price: Number(formData.price),
      address: formData.address,
      description: formData.description,
      bedroomCount: Number(formData.bedroomCount),
      squarefoot: Number(formData.squarefoot),
      isAvailable: formData.isAvailable,
      amenities,
      images,
    };

    updateProperty({ id: propertyId, data: payload }, {
      onSuccess: () => {
        router.push("/dashboard/landlord/properties");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!propertyData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-2 text-destructive">Property Not Found</h2>
        <p className="text-muted-foreground mb-4">The property you are trying to edit does not exist.</p>
        <Link href="/dashboard/landlord/properties" className={buttonVariants()}>Back to My Properties</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/landlord/properties" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground text-sm">Update your existing listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update the primary details.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="isAvailable" className="text-sm cursor-pointer">
                      {formData.isAvailable ? "Available" : "Rented"}
                    </Label>
                    <Switch 
                      id="isAvailable" 
                      checked={formData.isAvailable} 
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Title</Label>
                  <Input 
                    id="propertyName" 
                    value={formData.propertyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Rent (৳)</Label>
                    <Input 
                      id="price" 
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedroomCount">Bedrooms</Label>
                    <Input 
                      id="bedroomCount" 
                      type="number"
                      min="1"
                      value={formData.bedroomCount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="squarefoot">Square Feet</Label>
                    <Input 
                      id="squarefoot" 
                      type="number"
                      min="1"
                      value={formData.squarefoot}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label>Amenities</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. WiFi" 
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    />
                    <Button type="button" onClick={addAmenity} variant="secondary">Add</Button>
                  </div>
                  {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {amenities.map((amenity, index) => (
                        <span key={index} className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded-md">
                          {amenity}
                          <button type="button" onClick={() => removeAmenity(index)} className="ml-1 text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload property images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 border-muted-foreground/25 ${isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploadingImages ? (
                        <Loader2 className="w-8 h-8 mb-3 text-muted-foreground animate-spin" />
                      ) : (
                        <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground opacity-50" />
                      )}
                      <p className="mb-2 text-sm text-muted-foreground text-center">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={isUploadingImages || isUpdating}
                    />
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="space-y-2 mt-3 max-h-75 overflow-y-auto pr-2">
                    {images.map((img, index) => (
                      <div key={index} className="flex items-center gap-3 bg-muted/50 p-2 rounded-md border text-sm">
                        <Image src={img} alt={`Property image ${index + 1}`} width={40} height={40} className="w-10 h-10 object-cover rounded border bg-background" />
                        <span className="truncate flex-1 text-muted-foreground">{img}</span>
                        <button type="button" onClick={() => removeImage(index)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors shrink-0">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
