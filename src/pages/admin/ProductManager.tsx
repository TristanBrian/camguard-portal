
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, PlusCircle, Search, MoreVertical, Edit, Trash, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/admin/ProductForm';
import { useNavigate } from 'react-router-dom';

// Sample product data
const initialProducts = [
  {
    id: '1',
    name: 'Wireless Keyboard',
    price: '4500',
    category: 'Electronics',
    stock: '24',
    image: '/placeholder.svg',
    sku: 'KB-001',
    description: 'A premium wireless keyboard with long battery life',
  },
  {
    id: '2',
    name: 'LED Monitor 24"',
    price: '18900',
    category: 'Electronics',
    stock: '12',
    image: '/placeholder.svg',
    sku: 'MON-002',
    description: '24-inch LED monitor with HD resolution',
  },
  {
    id: '3',
    name: 'Ergonomic Mouse',
    price: '2800',
    category: 'Electronics',
    stock: '35',
    image: '/placeholder.svg',
    sku: 'MS-003',
    description: 'Comfortable ergonomic mouse designed for all-day use',
  },
  {
    id: '4',
    name: 'USB-C Hub',
    price: '3599',
    category: 'Accessories',
    stock: '18',
    image: '/placeholder.svg',
    sku: 'USB-004',
    description: 'Multi-port USB-C hub with power delivery',
  },
];

const ProductManager: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = (productData: any) => {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      image: productData.imageUrl || (productData.image ? URL.createObjectURL(productData.image) : '/placeholder.svg'),
    };
    
    setProducts([...products, newProduct]);
    toast.success('Product added successfully');
  };
  
  const handleUpdateProduct = (productData: any) => {
    const updatedProducts = products.map(product => 
      product.id === editingProduct.id ? {
        ...product,
        ...productData,
        image: productData.imageUrl || (productData.image ? URL.createObjectURL(productData.image) : product.image),
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
  
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setActiveTab('edit');
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
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
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
                                className="h-full w-full object-contain"
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
                          <td className="p-3 text-gray-500">{product.sku}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-normal">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-medium">KSh {product.price}</td>
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
                        <td colSpan={8} className="p-10 text-center">
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
              initialData={editingProduct}
              isEditing={true}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProductManager;
