
import React from 'react';
import { Product } from '@/data/productsData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertCircle, RefreshCw, Eye, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductsTableProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  isAdmin?: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products, 
  onEdit, 
  onDelete,
  onView,
  onAddToCart,
  isLoading = false,
  error = null,
  onRefresh,
  isAdmin = false
}) => {
  // Debug information 
  console.log("ProductsTable rendering with products:", products);
  console.log("Loading status:", isLoading);
  console.log("Error status:", error);
  console.log("isAdmin:", isAdmin);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
        <p className="mt-2 text-gray-500">Loading products...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-red-500 mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No products found</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Products
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image || '/placeholder.svg'} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </TableCell>
              <TableCell className="font-medium">
                {product.name}
                <div>
                  <Badge variant="outline" className="mt-1">
                    {product.category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>KSh {product.price?.toLocaleString() ?? 0}</TableCell>
              <TableCell>
                <span className={Number(product.stock) <= 5 ? 'text-red-600 font-medium' : ''}>
                  {product.stock}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(product.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onAddToCart && (
                    <Button variant="ghost" size="sm" onClick={() => onAddToCart(product.id)}>
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && onDelete && (
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => onDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
