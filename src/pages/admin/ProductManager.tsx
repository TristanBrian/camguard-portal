import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, PlusCircle, Search, MoreVertical, Edit, Trash, ArrowUpDown, Download, UploadCloud, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/admin/ProductForm';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/productsData';
import { fetchProducts, createProduct, updateProduct, deleteProduct, isAdmin, uploadProductImage, uploadGalleryImages, setupStorageBucket } from "@/integrations/supabase/admin";
import { supabase } from "@/integrations/supabase/client";

const ProductManager: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);
  const [currentGalleryProductId, setCurrentGalleryProductId] = useState<string|null>(null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      // First check for hardcoded admin in localStorage (from AdminLogin)
      const currentUser = localStorage.getItem('kimcom_current_user');
      if (currentUser) {
        try {
          const parsedUser = JSON.parse(currentUser);
          if (parsedUser.email === 'admin@kimcom.com') {
            setIsAdminUser(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Handle parsing error silently
        }
      }

      // Then check for Supabase auth
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          const hasRole = await isAdmin(user.id);
          setIsAdminUser(hasRole);
          console.log("Admin status:", hasRole);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
    
    // Setup storage bucket if needed
    setupStorageBucket();
  }, []);

  const fetchAllProducts = async () => {
    if (!isAdminUser && loading) return; // Don't fetch if we're not admin or still checking
    
    try {
      setRefreshing(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setRefreshing(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Error fetching products");
      setProducts([]);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    
    // Set up realtime subscription for product changes
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product changed:', payload);
          fetchAllProducts();
        }
      )
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdminUser, loading]);

  const handleAddProduct = async (productData: any) => {
    try {
      let imageUrl = undefined;
      if (productData.image instanceof File) {
        const fileName = `product-${Date.now()}-${productData.image.name}`;
        imageUrl = await uploadProductImage(productData.image, fileName);
      } else if (productData.imageUrl) {
        imageUrl = productData.imageUrl;
      }
      const payload = {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        image: imageUrl || "/placeholder.svg",
        difficulty: productData.difficulty || "Medium",
        features: productData.features ? productData.features.split('\n').filter((f: string) => f.trim()) : undefined,
      };
      await createProduct(payload);
      toast.success("Product added successfully");
      setActiveTab("all");
      fetchAllProducts();
    } catch (e) {
      console.error("Error adding product:", e);
      toast.error("Failed to add product");
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return;
    try {
      let imageUrl = editingProduct.image;
      if (productData.image instanceof File) {
        const fileName = `product-${editingProduct.id}-${Date.now()}-${productData.image.name}`;
        imageUrl = await uploadProductImage(productData.image, fileName);
      } else if (productData.imageUrl) {
        imageUrl = productData.imageUrl;
      }
      const payload = {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        image: imageUrl,
        features: productData.features ? productData.features.split('\n').filter((f: string) => f.trim()) : editingProduct.features,
      };
      await updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
      setActiveTab("all");
      toast.success("Product updated successfully");
      fetchAllProducts();
    } catch (e) {
      console.error("Error updating product:", e);
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchAllProducts();
    } catch (e) {
      console.error("Error deleting product:", e);
      toast.error("Failed to delete product");
    }
  };

  const handleRefresh = () => {
    fetchAllProducts();
    toast.info("Refreshing products...");
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleDeleteSelected = () => {
    setProducts(products.filter(product => !selectedProducts.includes(product.id)));
    setSelectedProducts([]);
    toast.success(`${selectedProducts.length} products deleted successfully`);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('edit');
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Brand,Model,SKU,Category,Price,Stock,Difficulty,Description\n";
    products.forEach(product => {
      csvContent += `${product.id},"${product.name}",${product.brand || ''},${product.model || ''},${product.sku},${product.category},${product.price},${product.stock},${product.difficulty},"${product.description}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Products exported successfully');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryImages(filesArray);
      setGalleryPreviewUrls(filesArray.map(f => URL.createObjectURL(f)));
      setCurrentGalleryProductId(productId);
    }
  };

  const handleGalleryUpload = async (product: Product) => {
    if (!galleryImages.length) return;
    setGalleryUploadLoading(true);
    try {
      const urls = await uploadGalleryImages(galleryImages, product.id);
      let newFeatures = Array.isArray(product.features) ? [...product.features] : [];
      newFeatures = newFeatures.concat(urls);
      await updateProduct(product.id, {
        features: newFeatures
      });
      toast.success("Gallery images uploaded!");
      setGalleryImages([]);
      setGalleryPreviewUrls([]);
      setCurrentGalleryProductId(null);
    } catch (e) {
      console.error("Error uploading gallery images:", e);
      toast.error("Failed to upload images");
    }
    setGalleryUploadLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">
          <p className="text-lg font-medium mb-2">Access Denied</p>
          <p>You do not have admin access to this page.</p>
          <Button 
            onClick={() => navigate('/admin-login')} 
            variant="outline" 
            className="mt-4"
          >
            Go to Admin Login
          </Button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <TabsList className="mb-0">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="add">Add Product</TabsTrigger>
            {editingProduct && <TabsTrigger value="edit">Edit Product</TabsTrigger>}
          </TabsList>
          
          <div className="flex flex-col md:flex-row items-center gap-2">
            {selectedProducts.length > 0 && (
              <Button 
                variant="destructive"
                size="sm"
                className="w-full md:w-auto"
                onClick={() => {
                  toast.error("Batch delete not yet implemented");
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleExportCSV();
              }}
              className="w-full md:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500">
                      <th className="p-3 w-10">
                        <Checkbox 
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} 
                          onCheckedChange={handleSelectAllProducts}
                          aria-label="Select all products"
                        />
                      </th>
                      <th className="p-3 w-16">Image</th>
                      <th className="p-3">
                        <div className="flex items-center">
                          <span>Product</span>
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th className="p-3">Brand/Model</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Difficulty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Stock</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="p-3">
                            <Checkbox 
                              checked={selectedProducts.includes(product.id)} 
                              onCheckedChange={() => handleSelectProduct(product.id)}
                              aria-label={`Select ${product.name}`}
                            />
                          </td>
                          <td className="p-3">
                            <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden border">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div className="mt-2 text-center">
                              <label>
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={galleryUploadLoading && currentGalleryProductId === product.id}
                                >
                                  <span>
                                    +
                                    Gallery
                                  </span>
                                </Button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={e => handleGalleryFileChange(e, product.id)}
                                  disabled={galleryUploadLoading && currentGalleryProductId === product.id}
                                />
                              </label>
                              {currentGalleryProductId === product.id && galleryImages.length > 0 && (
                                <div className="mt-1 flex flex-col items-center">
                                  <div className="flex flex-wrap gap-1">
                                    {galleryPreviewUrls.map((url, idx) => (
                                      <img
                                        key={idx}
                                        src={url}
                                        alt="gallery preview"
                                        className="h-8 w-8 object-cover border rounded shadow"
                                      />
                                    ))}
                                  </div>
                                  <Button
                                    size="sm"
                                    className="mt-1 bg-kimcom-600 text-white"
                                    onClick={() => handleGalleryUpload(product)}
                                    disabled={galleryUploadLoading}
                                  >
                                    {galleryUploadLoading ? "Uploading..." : "Upload"}
                                  </Button>
                                </div>
                              )}
                            </div>
                            {Array.isArray(product.features) && product.features.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {product.features
                                  .filter(f => typeof f === 'string' && (f.startsWith('https://') || f.startsWith('http://')))
                                  .map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt="gallery"
                                    className="h-8 w-8 object-cover border rounded-full"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {product.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            {product.brand && <p className="text-xs font-medium">{product.brand}</p>}
                            {product.model && <p className="text-xs text-gray-500">{product.model}</p>}
                          </td>
                          <td className="p-3 text-gray-500">{product.sku}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-normal">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={`font-normal ${getDifficultyColor(product.difficulty)}`}>
                              {product.difficulty} Install
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-medium">KSh {product.price.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <span className={`font-medium ${Number(product.stock) <= 5 ? 'text-red-600' : ''}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-10 text-center">
                          <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No products found</p>
                          {searchTerm && (
                            <Button 
                              variant="link" 
                              onClick={() => setSearchTerm('')}
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <ProductForm 
            onSubmit={handleAddProduct}
          />
        </TabsContent>
        
        {editingProduct && (
          <TabsContent value="edit">
            <ProductForm 
              onSubmit={handleUpdateProduct}
              initialData={{
                name: editingProduct.name,
                price: String(editingProduct.price),
                category: editingProduct.category,
                description: editingProduct.description,
                sku: editingProduct.sku,
                stock: String(editingProduct.stock),
                image: editingProduct.image,
                brand: editingProduct.brand || '',
                model: editingProduct.model || '',
                features: Array.isArray(editingProduct.features) 
                  ? editingProduct.features
                      .filter(f => typeof f === 'string' && !f.startsWith('http'))
                      .join('\n')
                  : '',
                difficulty: editingProduct.difficulty || 'Medium',
              }}
              isEditing={true}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProductManager;
