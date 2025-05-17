import React from 'react';
import { Button } from '../components/ui/button';
import { MinusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../data/productsData';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  products: Product[];
  onRemoveFromCart: (id: string) => void;
  onDeleteFromCart: (id: string) => void;
  onEmptyCart: () => void;
  onCheckout: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  products,
  onRemoveFromCart,
  onDeleteFromCart,
  onEmptyCart,
  onCheckout,
  isCartOpen,
  setIsCartOpen,
}) => {
  // Show loading state when cart is open, has items, but products aren't loaded yet
  if (isCartOpen && cartItems.length > 0 && products.length === 0) {
    return (
      <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded p-4 z-50">
        <h3 className="font-semibold text-lg mb-2">Your Cart</h3>
        <div className="text-center py-6">
          <p className="text-gray-500">Loading cart items...</p>
        </div>
      </div>
    );
  }

  const cartProductDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean) as (Product & { quantity: number })[];

  const cartTotal = cartProductDetails.reduce((total, item) => 
    total + (item.price * item.quantity), 0);

  return (
    <>
      {isCartOpen && (
        <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded p-4 z-50">
          <h3 className="font-semibold text-lg mb-2">Your Cart</h3>
          {cartItems.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Your cart is empty</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsCartOpen(false)}>
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {cartProductDetails.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <img 
                        src={item.image || '/placeholder.svg'} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded mr-2" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">KSh {item.price ? item.price.toLocaleString() : '0'} × {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full" 
                        onClick={() => onRemoveFromCart(item.id)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50" 
                        onClick={() => onDeleteFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={onEmptyCart}
                  >
                    Empty Cart
                  </Button>
                  <Button 
                    className="flex-1 bg-kimcom-600 hover:bg-kimcom-700"
                    size="sm"
                    onClick={onCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;