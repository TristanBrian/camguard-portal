import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, Image, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: {
    name: string;
    price: string;
    category: string;
    description: string;
    sku: string;
    stock: string;
    image: string;
    brand: string;
    model: string;
    features: string;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
  };
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [category, setCategory] = useState(initialData?.category || 'CCTV');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Advanced'>(initialData?.difficulty || 'Medium');
  const [features, setFeatures] = useState(initialData?.features || '');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image || '/placeholder.svg');
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skipImageUpload, setSkipImageUpload] = useState(false);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPreviewUrl(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
      setSkipImageUpload(false);
    }
  };
  
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check if any file is too large
      const hasLargeFile = Array.from(e.target.files).some(file => file.size > 5 * 1024 * 1024);
      
      if (hasLargeFile) {
        toast.error("All images must be less than 5MB");
        return;
      }
      
      setGalleryImages(e.target.files);
      
      // Create preview URLs for all images
      const urls: string[] = [];
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          urls.push(loadEvent.target?.result as string);
          if (urls.length === e.target.files!.length) {
            setGalleryPreviewUrls([...urls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Basic validation
      if (!name.trim()) {
        toast.error("Product name is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!sku.trim()) {
        toast.error("SKU is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!category.trim()) {
        toast.error("Category is required");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for submission
      const productData: any = {
        name,
        price: price || 0,
        category,
        description,
        sku,
        stock: stock || 0,
        brand,
        model,
        features,
        difficulty,
      };
      
      // If image upload is skipped, use placeholder directly
      if (skipImageUpload) {
        productData.image = '/placeholder.svg';
      } else if (image) {
        // Only include the file if we're not skipping upload
        productData.image = image;
      } else if (initialData?.image) {
        // Keep original image if no new one uploaded
        productData.imageUrl = initialData.image;
      }
      
      // Add gallery images if available
      if (galleryImages) {
        productData.galleryImages = galleryImages;
      }
      
      if (onSubmit) {
        console.log("Submitting product data:", productData);
        await onSubmit(productData);
      }
    } catch (error: any) {
      console.error("Error submitting product:", error);
      
      // Handle permission errors specifically
      if (error.message?.includes('policy') || error.message?.includes('permission') || 
          error.message?.includes('authentication') || error.message?.includes('auth')) {
        toast.error("Permission denied. Admin authentication required.");
      } else {
        toast.error(`Failed to save product: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Show authentication warning for admin features */}
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Admin authentication is required to add or edit products.
            </AlertDescription>
          </Alert>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product Name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU*</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Stock Keeping Unit"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand"
                />
              </div>
              
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model Number"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">Stock*</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category*</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="CCTV">CCTV</SelectItem>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="Access Control">Access Control</SelectItem>
                      <SelectItem value="Alarms">Alarms</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Installation Difficulty</Label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'Easy' | 'Medium' | 'Advanced')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="List features, one per line"
                  rows={4}
                />
              </div>
              
              <div>
                <div className="mb-2">
                  <Label htmlFor="main-image">Main Product Image</Label>
                  <div className="flex items-center mt-1">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSkipImageUpload(!skipImageUpload);
                        toast.info(skipImageUpload ? "Image upload enabled" : "Using placeholder image");
                      }}
                      className={`text-xs ${skipImageUpload ? 'bg-amber-100' : ''}`}
                    >
                      {skipImageUpload ? "Using placeholder" : "Skip image upload"}
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={skipImageUpload ? '/placeholder.svg' : previewUrl}
                      alt="Product preview"
                      className="w-36 h-36 object-contain border rounded mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <Label 
                      htmlFor="main-image" 
                      className={`cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded flex items-center ${skipImageUpload ? 'opacity-50' : ''}`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                      <Input
                        id="main-image"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                        disabled={skipImageUpload}
                      />
                    </Label>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-2">
                  <Label htmlFor="gallery">Gallery Images (Optional)</Label>
                </div>
                <div className="border rounded-md p-4">
                  {galleryPreviewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {galleryPreviewUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-16 h-16 object-cover border rounded"
                        />
                      ))}
                    </div>
                  )}
                  <Label 
                    htmlFor="gallery" 
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded flex items-center"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Add Gallery Images
                    <Input
                      id="gallery"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleGalleryChange}
                      accept="image/*"
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-kimcom-600 hover:bg-kimcom-700"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
