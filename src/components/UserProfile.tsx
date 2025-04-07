
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, ShoppingBag, Package, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleViewCart = () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      setTimeout(() => navigate('/products'), 500);
    } else {
      navigate('/products');
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
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <MapPin className="h-4 w-4 mr-2" />
              Update Address
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Feature coming soon!')}>
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
