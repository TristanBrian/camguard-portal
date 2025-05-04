
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Package, Upload, X, Link as LinkIcon, Image, Images } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  sku: z.string().min(3, {
    message: "SKU must be at least 3 characters.",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number.",
  }),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  features: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Advanced']).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues & { image?: File, imageUrl?: string, galleryImages?: File[] }) => void;
  initialData?: ProductFormValues & { image?: string, imageUrl?: string };
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEditing = false 
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || initialData?.imageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSource, setImageSource] = useState<'file' | 'url'>(initialData?.imageUrl ? 'url' : 'file');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      sku: initialData?.sku || "",
      stock: initialData?.stock || "",
      imageUrl: initialData?.imageUrl || "",
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      features: initialData?.features || "",
      difficulty: initialData?.difficulty || "Medium",
    },
    mode: "onChange",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setGalleryFiles(prev => [...prev, ...fileArray]);
      
      const newPreviewPromises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(newPreviewPromises).then(newPreviews => {
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
  };

  const handleImageSourceChange = (value: 'file' | 'url') => {
    setImageSource(value);
    if (value === 'file') {
      setImageUrl('');
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = (data: ProductFormValues) => {
    setIsLoading(true);
    
    // Combining form data with the image
    const submitData = {
      ...data,
      image: imageFile || undefined,
      imageUrl: imageSource === 'url' ? imageUrl : undefined,
      galleryImages: galleryFiles.length > 0 ? galleryFiles : undefined,
      difficulty: data.difficulty || "Medium",
    };
    
    setTimeout(() => {
      onSubmit(submitData);
      setIsLoading(false);
      if (!isEditing) {
        form.reset();
        clearImage();
        setGalleryFiles([]);
        setGalleryPreviews([]);
      }
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Model number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (KSh)</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="SKU-123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input placeholder="0" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Installation Difficulty</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Easy" id="easy" />
                            <Label htmlFor="easy">Easy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Medium" id="medium" />
                            <Label htmlFor="medium">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Advanced" id="advanced" />
                            <Label htmlFor="advanced">Advanced</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Product description" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Features (one per line)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter features, one per line" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div>
                  <FormLabel>Main Product Image</FormLabel>
                  
                  <RadioGroup 
                    className="flex space-x-4 mb-4" 
                    defaultValue={imageSource} 
                    onValueChange={(value) => handleImageSourceChange(value as 'file' | 'url')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="file" />
                      <Label htmlFor="file">Upload File</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="url" />
                      <Label htmlFor="url">Image URL</Label>
                    </div>
                  </RadioGroup>
                  
                  {imageSource === 'url' && (
                    <div className="mb-4">
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          value={imageUrl} 
                          onChange={handleImageUrlChange}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img 
                          src={imagePreview} 
                          alt="Product Preview" 
                          className="h-[200px] w-full object-contain object-center mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white rounded-full border shadow-sm"
                          onClick={clearImage}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                      </div>
                    ) : imageSource === 'file' ? (
                      <div className="p-8 text-center">
                        <Package className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                        <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 2MB)</p>
                        
                        <div className="mt-4 flex justify-center">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Select File
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <LinkIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Enter an image URL above</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <FormLabel className="flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    Product Gallery Images
                  </FormLabel>
                  
                  <div className="border-2 border-dashed rounded-lg p-4 mt-2">
                    <div className="flex justify-center mb-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('gallery-upload')?.click()}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Add Gallery Images
                      </Button>
                      <input
                        id="gallery-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryImagesChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {galleryPreviews.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Gallery Preview ({galleryPreviews.length} images)</p>
                        
                        <Carousel className="w-full">
                          <CarouselContent>
                            {galleryPreviews.map((preview, index) => (
                              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="relative p-1">
                                  <div className="aspect-square overflow-hidden rounded-md">
                                    <img 
                                      src={preview} 
                                      alt={`Gallery image ${index + 1}`}
                                      className="h-full w-full object-cover" 
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full border shadow-sm"
                                    onClick={() => removeGalleryImage(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="-left-3 h-7 w-7" />
                          <CarouselNext className="-right-3 h-7 w-7" />
                        </Carousel>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium mb-2">Product Preview</h3>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Thumbnail" 
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {form.watch("name") || "Product Name"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {form.watch("brand") && <span className="mr-2">{form.watch("brand")}</span>}
                        {form.watch("model") && <span className="italic">{form.watch("model")}</span>}
                      </p>
                      <p className="text-sm font-medium text-kimcom-600">
                        KSh {form.watch("price") || "0.00"}
                      </p>
                      {galleryPreviews.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{galleryPreviews.length} gallery images
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pb-0 pt-6">
              <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-kimcom-600 hover:bg-kimcom-700">
                  {isLoading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
