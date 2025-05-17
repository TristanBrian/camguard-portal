
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { fetchProducts } from '@/integrations/supabase/admin';
import { Product } from '@/data/productsData';

interface CartItem {
  product: Product;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        // Try to load cart from localStorage
        const savedCart = localStorage.getItem('kimcom_cart');
        
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          
          // We need to fetch fresh product data to ensure prices are current
          const products = await fetchProducts();
          const productMap = new Map(products.map(p => [p.id, p]));
          
          // Update cart items with current product data
          const updatedCart = parsedCart
            .filter((item: any) => productMap.has(item.productId))
            .map((item: any) => ({
              product: productMap.get(item.productId)!,
              quantity: item.quantity
            }));
            
          setCartItems(updatedCart);
          console.log("Cart loaded from localStorage:", updatedCart);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setError("Failed to load your cart");
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      const cartToSave = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      
      localStorage.setItem('kimcom_cart', JSON.stringify(cartToSave));
      console.log("Cart saved to localStorage:", cartToSave);
    }
  }, [cartItems, loading]);
  
  const increaseQuantity = (productId: string) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
    toast.success("Item quantity updated");
  };
  
  const decreaseQuantity = (productId: string) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
    toast.success("Item quantity updated");
  };
  
  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast.success("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
              <Button 
                onClick={() => navigate('/products')}
                variant="default"
                className="bg-kimcom-600 hover:bg-kimcom-700"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Product</th>
                    <th className="text-center py-4">Price</th>
                    <th className="text-center py-4">Quantity</th>
                    <th className="text-right py-4">Subtotal</th>
                    <th className="py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.product.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <img 
                            src={item.product.image || '/placeholder.svg'} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">{item.product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4">KSh {item.product.price?.toLocaleString() ?? 0}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => decreaseQuantity(item.product.id)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-3">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => increaseQuantity(item.product.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="text-right py-4">
                        KSh {(item.product.price * item.quantity).toLocaleString()}
                      </td>
                      <td className="py-4 pl-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-8 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-xl font-bold">Total: KSh {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {cartItems.length > 0 && (
          <CardFooter className="bg-gray-50 border-t p-6">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={handleCheckout}
                className="bg-kimcom-600 hover:bg-kimcom-700"
              >
                Proceed to Checkout
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Cart;
