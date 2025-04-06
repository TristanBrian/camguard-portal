
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Package, Upload, X, Link as LinkIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues & { image?: File, imageUrl?: string }) => void;
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
      imageUrl: imageSource === 'url' ? imageUrl : undefined
    };
    
    setTimeout(() => {
      onSubmit(submitData);
      setIsLoading(false);
      if (!isEditing) {
        form.reset();
        clearImage();
      }
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Product description" 
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
                  <FormLabel>Product Image</FormLabel>
                  
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
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Select File
                            </Button>
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
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
                      <p className="text-sm text-gray-600">
                        KSh {form.watch("price") || "0.00"}
                      </p>
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
                <Button type="submit" disabled={isLoading}>
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
