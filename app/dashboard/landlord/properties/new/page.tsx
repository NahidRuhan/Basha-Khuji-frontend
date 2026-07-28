"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProperty } from "@/hooks/use-properties";
import { useCategories, useLocations } from "@/hooks/use-options";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { uploadImageToImgBB } from "@/lib/imgbb";

export default function NewPropertyPage() {
  const router = useRouter();
  const { mutate: createProperty, isPending } = useCreateProperty();
  const { data: categoriesData } = useCategories();
  const { data: locationsData } = useLocations();

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  const [formData, setFormData] = useState({
    propertyName: "",
    categoryName: "",
    locationName: "",
    price: "",
    address: "",
    description: "",
    bedroomCount: "",
    squarefoot: "",
    vacantFrom: "",
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

    if (!formData.categoryName || !formData.locationName) {
      toast.error("Please select a category and location");
      return;
    }

    if (images.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }

    const payload = {
      propertyName: formData.propertyName,
      categoryName: formData.categoryName,
      locationName: formData.locationName,
      price: Number(formData.price),
      address: formData.address,
      description: formData.description,
      bedroomCount: Number(formData.bedroomCount),
      squarefoot: Number(formData.squarefoot),
      vacantFrom: formData.vacantFrom ? new Date(formData.vacantFrom).toISOString() : new Date().toISOString(),
      amenities,
      images,
    };

    createProperty(payload, {
      onSuccess: () => {
        router.push("/dashboard/landlord/properties");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/landlord/properties" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground text-sm">Create a new rental listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the primary details for your property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Title</Label>
                  <Input 
                    id="propertyName" 
                    placeholder="e.g. Beautiful Apartment in Banani"
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
                      placeholder="e.g. 45000"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacantFrom">Vacant From</Label>
                    <Input 
                      id="vacantFrom" 
                      type="date"
                      value={formData.vacantFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.categoryName} onValueChange={(val) => handleSelectChange("categoryName", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.categoryId} value={c.categoryName}>{c.categoryName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={formData.locationName} onValueChange={(val) => handleSelectChange("locationName", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((l) => (
                          <SelectItem key={l.locationId} value={l.locationName}>{l.locationName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input 
                    id="address" 
                    placeholder="e.g. Road 11, Block F, Banani"
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
                    placeholder="Describe your property..."
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
                      placeholder="e.g. 3"
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
                      placeholder="e.g. 1500"
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
                      placeholder="e.g. WiFi, Gym" 
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
                      disabled={isUploadingImages || isPending}
                    />
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="space-y-2 mt-3 max-h-[300px] overflow-y-auto pr-2">
                    {images.map((img, index) => (
                      <div key={index} className="flex items-center gap-3 bg-muted/50 p-2 rounded-md border text-sm">
                        <img src={img} alt={`Property image ${index + 1}`} className="w-10 h-10 object-cover rounded border bg-background" />
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

            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Listing
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
