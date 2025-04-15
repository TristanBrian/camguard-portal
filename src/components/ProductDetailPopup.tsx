
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle, ChevronRight } from 'lucide-react';
import { Product } from '@/data/productsData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductDetailPopupProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetailPopup: React.FC<ProductDetailPopupProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const navigate = useNavigate();
  const [isAddedToCart, setIsAddedToCart] = React.useState(false);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    onAddToCart(product);
    setIsAddedToCart(true);
    
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };
  
  const handleCheckout = () => {
    if (!product) return;
    
    if (!isAddedToCart) {
      onAddToCart(product);
    }
    
    onClose();
    navigate('/checkout');
  };
  
  const handleViewDetails = () => {
    if (!product) return;
    
    onClose();
    navigate(`/product-details/${product.id}`);
  };
  
  if (!product) return null;
  
  const getDifficultyColor = () => {
    switch (product.difficulty) {
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
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            {product.brand && (
              <Badge variant="outline" className="font-normal">
                {product.brand}
              </Badge>
            )}
            {product.model && (
              <Badge variant="outline" className="font-normal bg-gray-50">
                {product.model}
              </Badge>
            )}
            <Badge className={`font-normal ${getDifficultyColor()}`}>
              {product.difficulty} Installation
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="object-contain w-full h-48"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="flex flex-col">
            <p className="text-gray-700">{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">Key Features:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-1">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                  {product.features.length > 4 && (
                    <li className="list-none">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={handleViewDetails}
                      >
                        View all features
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="mt-auto">
              <div className="flex items-center justify-between mt-4">
                <div className="text-2xl font-bold text-kimcom-600">
                  KSh {product.price.toLocaleString()}
                </div>
                <div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="sm:mr-auto"
          >
            View Full Details
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAddedToCart}
            className={isAddedToCart ? 'bg-green-50 text-green-600 border-green-200' : ''}
          >
            {isAddedToCart ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
          <Button 
            onClick={handleCheckout}
            disabled={product.stock <= 0}
            className="bg-kimcom-600 hover:bg-kimcom-700"
          >
            Checkout Now
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailPopup;
