
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, ShoppingBag, Package, CreditCard, MinusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '@/data/productsData';

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<{id: string, quantity: number}[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If userId is provided, find that specific user
    // Otherwise, get the current logged in user
    const currentUser = localStorage.getItem('kimcom_current_user');
    
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
      
      // Load user's cart
      const userCartKey = `kimcom_cart_${userData.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      // Load order history (if any)
      const userOrdersKey = `kimcom_orders_${userData.id}`;
      const savedOrders = localStorage.getItem(userOrdersKey);
      if (savedOrders) {
        setOrderHistory(JSON.parse(savedOrders));
      }
    }
  }, [userId]);

  // Save cart whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`kimcom_cart_${user.id}`, JSON.stringify(cartItems));
      
      // Trigger storage event for navbar to detect changes
      const event = new Event('storage');
      window.dispatchEvent(event);
    }
  }, [cartItems, user]);

  const handleRemoveFromCart = (id: string) => {
    const existingItem = cartItems.find(item => item.id === id);
    const product = productsData.find(p => p.id === id);
    
    if (existingItem && existingItem.quantity > 1) {
      // Reduce quantity by 1
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ));
      toast.info(`Removed 1 ${product?.name} from cart`);
    } else {
      // Remove item completely
      setCartItems(cartItems.filter(item => item.id !== id));
      toast.info(`Removed ${product?.name} from cart`);
    }
  };

  const handleDeleteFromCart = (id: string) => {
    const product = productsData.find(p => p.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.info(`Removed ${product?.name} from cart`);
  };

  const handleEmptyCart = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is already empty");
      return;
    }
    
    setCartItems([]);
    toast.success("Cart emptied successfully");
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleViewCart = () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      setTimeout(() => navigate('/products'), 500);
    } else {
      navigate('/products');
      
      // Set a flag in localStorage to open the cart popover when the products page loads
      localStorage.setItem('open_cart_popover', 'true');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      setTimeout(() => navigate('/products'), 500);
    } else {
      navigate('/checkout');
    }
  };

  // Get product details for cart items
  const cartProductDetails = cartItems.map(item => {
    const product = productsData.find(p => p.id === item.id);
    return {
      ...product,
      quantity: item.quantity
    };
  }).filter(item => item); // Filter out any undefined items

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-kimcom-600 h-32 flex items-center justify-center">
        <User className="h-16 w-16 text-white" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">{user.fullName}</h2>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700">{user.email}</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700 capitalize">{user.role || 'Customer'}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
          )}
          
          {user.address && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{user.address}</span>
            </div>
          )}
        </div>
        
        {/* Cart Summary Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Your Cart</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {cartItems.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  You have {cartItems.reduce((total, item) => total + item.quantity, 0)} item(s) in your cart
                </p>
                
                {/* Cart items list */}
                <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
                  {cartProductDetails.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-8 h-8 object-cover rounded mr-2" 
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">KSh {item.price.toLocaleString()} × {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full" 
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50" 
                          onClick={() => handleDeleteFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={handleViewCart}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>
                  <Button 
                    className="bg-kimcom-600 hover:bg-kimcom-700 flex-1" 
                    size="sm"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleEmptyCart}
                >
                  Empty Cart
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">Your cart is currently empty</p>
                <Button onClick={handleShopNow} className="w-full bg-kimcom-600 hover:bg-kimcom-700" size="sm">
                  Shop Now
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Order History Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Order History</h3>
          {orderHistory.length > 0 ? (
            <div className="space-y-4">
              {orderHistory.map((order, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order #{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p>Items: {order.items.length}</p>
                    <p>Total: KSh {order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No order history yet</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Account Options</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => { window.location.href = '/settings'; }}
            >
              <span className="mr-2">⚙️</span>
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <span className="mr-2">🛍️</span>
              View All Orders
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <span className="mr-2">📦</span>
              Update Address
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <span className="mr-2">👤</span>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
