
import React from 'react';
import { Product } from '@/data/productsData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products, 
  onEdit, 
  onDelete 
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
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
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>KSh {product.price.toLocaleString()}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
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
