import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ProductForm from '@/components/admin/ProductForm';
import ProductsTable from '@/components/ProductsTable';
import { fetchProducts, addProduct, deleteProduct, updateProduct } from '@/integrations/supabase/admin';
import { AlertCircle, RefreshCw, Plus, AlertTriangle } from 'lucide-react';
import { Product } from '@/data/productsData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkIfAdmin } from '@/utils/adminAuth';
import { initDevelopmentEnvironment } from '@/integrations/supabase/admin';

const ProductManager = () => {
  const navigate = useNavigate();
  const { id: editProductId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  
  // Initialize development environment if needed
  useEffect(() => {
    const init = async () => {
      if (process.env.NODE_ENV === 'development') {
        setIsDevelopmentMode(true);
        await initDevelopmentEnvironment();
      }
    };
    init();
  }, []);
  
  // Load products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);
  
  // Check if we're editing an existing product
  useEffect(() => {
    if (editProductId) {
      setIsEditing(true);
      const productToEdit = products.find(p => p.id === editProductId);
      if (productToEdit) {
        setCurrentProduct(productToEdit);
      } else {
        // Load the specific product if not found in the current list
        fetchProductById(editProductId);
      }
    }
  }, [editProductId, products]);
  
  const fetchProductById = async (id: string) => {
    try {
      // First try to find in current products list
      const product = products.find(p => p.id === id);
      if (product) {
        setCurrentProduct(product);
        return;
      }
      
      // Otherwise reload all products and search again
      setLoading(true);
      const allProducts = await fetchProducts();
      setLoading(false);
      
      const foundProduct = allProducts.find(p => p.id === id);
      if (foundProduct) {
        setCurrentProduct(foundProduct);
      } else {
        toast.error("Product not found");
        navigate('/admin/products');
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      navigate('/admin/products');
    }
  };
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!checkIfAdmin()) {
        setError("Admin authentication required");
        setLoading(false);
        return;
      }
      
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error?.message || "Failed to load products");
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = async (productData: any) => {
    try {
      setLoading(true);
      await addProduct(productData);
      toast.success("Product added successfully");
      setIsAdding(false);
      loadProducts(); // Refresh the product list
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(error?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProduct = async (productData: any) => {
    try {
      if (!editProductId) {
        toast.error("Missing product ID");
        return;
      }
      
      setLoading(true);
      await updateProduct(editProductId, productData);
      toast.success("Product updated successfully");
      navigate('/admin/products');
      loadProducts(); // Refresh the product list
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };
  
  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts(); // Refresh the product list
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };
  
  const prepareProductFormData = (product: Product) => {
    // Convert product data to the format expected by ProductForm
    return {
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description || '',
      sku: product.sku,
      stock: String(product.stock),
      image: product.image || '',
      brand: product.brand || '',
      model: product.model || '',
      features: Array.isArray(product.features) ? product.features.join('\n') : '',
      difficulty: product.difficulty
    };
  };
  
  return (
    <div className="space-y-6">
      {isDevelopmentMode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Running in development mode with local data. Products will not be saved to the database.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Product Management'}</h2>
        {!isEditing && !isAdding && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={loadProducts}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-kimcom-600 hover:bg-kimcom-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            {currentProduct ? (
              <ProductForm 
                onSubmit={handleUpdateProduct}
                isEditing={true}
                initialData={prepareProductFormData(currentProduct)}
              />
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
                <p className="mt-2 text-gray-500">Loading product details...</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : isAdding ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm 
              onSubmit={handleAddProduct}
              isEditing={false}
            />
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(false)}
                className="mr-2"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsTable 
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onRefresh={loadProducts}
              isLoading={loading}
              error={error}
              isAdmin={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManager;
