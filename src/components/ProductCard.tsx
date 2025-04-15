
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Advanced';
  stock?: number;
  brand?: string;
  model?: string;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  category,
  difficulty = 'Medium',
  stock,
  brand,
  model,
  onAddToCart,
  onViewDetails
}) => {
  const navigate = useNavigate();
  
  const getDifficultyColor = () => {
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    
    if (onAddToCart) {
      onAddToCart();
    } else {
      // Fallback if no function provided
      toast.success(`Added ${name} to cart`);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/product-details/${id}`);
    }
  };

  const isLowStock = stock !== undefined && stock <= 5 && stock > 0;
  const isOutOfStock = stock !== undefined && stock === 0;

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-contain p-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kimcom-100 text-kimcom-800">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
            {difficulty} Install
          </span>
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        
        {(brand || model) && (
          <div className="mt-1 flex flex-wrap gap-1">
            {brand && (
              <Badge variant="outline" className="text-xs">
                {brand}
              </Badge>
            )}
            {model && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                {model}
              </Badge>
            )}
          </div>
        )}
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
        
        <div className="mt-auto pt-4 flex justify-between items-center">
          <div className="text-xl font-bold text-kimcom-700">KSh {price.toLocaleString()}</div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails();
              }}
              className="text-gray-600 hover:text-kimcom-600"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAddToCart}
              className="bg-kimcom-600 hover:bg-kimcom-700"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isLowStock && (
          <div className="mt-2">
            <p className="text-xs text-red-500 font-medium">Only {stock} left in stock</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
