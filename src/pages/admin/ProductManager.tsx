
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, PlusCircle, Search, MoreVertical, Edit, Trash, ArrowUpDown, Download, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/admin/ProductForm';
import { useNavigate } from 'react-router-dom';
import { productsData, Product } from '@/data/productsData';

const ProductManager: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Load products from our shared data source
    setProducts(productsData);
  }, []);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddProduct = (productData: any) => {
    const newProduct = {
      id: `p${Date.now().toString().slice(-5)}`,
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      image: productData.imageUrl || (productData.image ? URL.createObjectURL(productData.image) : '/placeholder.svg'),
      difficulty: productData.difficulty || 'Medium', // Default difficulty
      features: productData.features ? productData.features.split('\n').filter((f: string) => f.trim()) : undefined,
    };
    
    setProducts([...products, newProduct]);
    toast.success('Product added successfully');
    setActiveTab('all');
  };
  
  const handleUpdateProduct = (productData: any) => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(product => 
      product.id === editingProduct.id ? {
        ...product,
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        image: productData.imageUrl || (productData.image ? URL.createObjectURL(productData.image) : product.image),
        features: productData.features ? productData.features.split('\n').filter((f: string) => f.trim()) : product.features,
      } : product
    );
    
    setProducts(updatedProducts);
    setEditingProduct(null);
    setActiveTab('all');
    toast.success('Product updated successfully');
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    toast.success('Product deleted successfully');
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
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "ID,Name,Brand,Model,SKU,Category,Price,Stock,Difficulty,Description\n";
    
    // Add rows
    products.forEach(product => {
      csvContent += `${product.id},"${product.name}",${product.brand || ''},${product.model || ''},${product.sku},${product.category},${product.price},${product.stock},${product.difficulty},"${product.description}"\n`;
    });
    
    // Create download link
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
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
                onClick={handleDeleteSelected}
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
              onClick={handleExportCSV}
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
                features: editingProduct.features ? editingProduct.features.join('\n') : '',
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
