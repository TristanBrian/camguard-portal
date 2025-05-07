
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProductForm from '@/components/admin/ProductForm';
import ProductsTable from '@/components/ProductsTable';
import { forceInsertProduct, debugFetchProducts } from '@/integrations/supabase/adminClient';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';

const ProductManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Load products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await debugFetchProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = async (productData) => {
    try {
      setLoading(true);
      await forceInsertProduct(productData);
      toast.success("Product added successfully");
      setIsAdding(false);
      loadProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };
  
  const handleDeleteProduct = async (id) => {
    // Implement delete functionality
    // This would require adding a delete function to adminClient.ts
    toast.info("Delete functionality to be implemented");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
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
      </div>
      
      {isAdding ? (
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
