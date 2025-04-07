
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CreditCard, Phone, Loader2, CheckCircle, Truck, Calendar } from 'lucide-react';
import { productsData } from '@/data/productsData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'ondelivery'>('mpesa');
  const [mpesaPhone] = useState('0740213382');
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Load cart items from localStorage
  const [cartItems, setCartItems] = useState<{id: string, quantity: number}[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      
      // Load user's cart from localStorage
      const userCartKey = `kimcom_cart_${userData.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } else {
      // Load anonymous cart if there's no user
      const anonymousCart = localStorage.getItem('cartItems');
      if (anonymousCart) {
        setCartItems(JSON.parse(anonymousCart));
      }
    }
  }, []);
  
  // Map cart items to full product details
  const cartProducts = cartItems.map(item => {
    const product = productsData.find(p => p.id === item.id);
    return {
      ...product,
      quantity: item.quantity
    };
  }).filter(item => item && item.id); // Filter out any undefined items
  
  const subtotal = cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 500;
  const total = subtotal + shippingCost;
  
  const handleMpesaPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionRef.trim()) {
      toast.error("Please enter the M-Pesa transaction reference number");
      return;
    }
    
    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing with transaction reference verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      
      // Save order information to localStorage for admin notification
      const currentUser = localStorage.getItem('kimcom_current_user');
      const userId = currentUser ? JSON.parse(currentUser).id : 'guest';
      
      const newOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        items: cartProducts,
        total: total,
        transactionRef: transactionRef,
        address: deliveryAddress,
        status: 'processing',
        userId: userId
      };
      
      // Store the order in localStorage for admin access
      const adminNotifications = localStorage.getItem('kimcom_admin_notifications') || '[]';
      const notifications = JSON.parse(adminNotifications);
      notifications.push({
        type: 'new_order',
        orderId: newOrder.id,
        timestamp: new Date().toISOString(),
        message: `New order (${newOrder.id}) with payment reference: ${transactionRef}`,
        read: false
      });
      
      localStorage.setItem('kimcom_admin_notifications', JSON.stringify(notifications));
      
      // Save to user's order history if logged in
      if (currentUser) {
        const userOrdersKey = `kimcom_orders_${userId}`;
        const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        existingOrders.push(newOrder);
        localStorage.setItem(userOrdersKey, JSON.stringify(existingOrders));
      }
      
      toast.success("Payment reference received! Your order is being processed.");
    }, 2000);
  };
  
  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    // In a real app, this would integrate with a card payment gateway
    toast.info("Card payment is currently not available. Please use M-Pesa.");
  };
  
  const handlePayOnDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      
      // Save order information to localStorage for admin notification
      const currentUser = localStorage.getItem('kimcom_current_user');
      const userId = currentUser ? JSON.parse(currentUser).id : 'guest';
      
      const newOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        items: cartProducts,
        total: total,
        address: deliveryAddress,
        status: 'pending',
        paymentStatus: 'pay_on_delivery',
        userId: userId
      };
      
      // Store the order in localStorage for admin access
      const adminNotifications = localStorage.getItem('kimcom_admin_notifications') || '[]';
      const notifications = JSON.parse(adminNotifications);
      notifications.push({
        type: 'new_order',
        orderId: newOrder.id,
        timestamp: new Date().toISOString(),
        message: `New order (${newOrder.id}) with payment on delivery`,
        read: false
      });
      
      localStorage.setItem('kimcom_admin_notifications', JSON.stringify(notifications));
      
      // Save to user's order history if logged in
      if (currentUser) {
        const userOrdersKey = `kimcom_orders_${userId}`;
        const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        existingOrders.push(newOrder);
        localStorage.setItem(userOrdersKey, JSON.stringify(existingOrders));
      }
      
      toast.success("Your order has been placed! You'll pay on delivery.");
    }, 2000);
  };
  
  const handleCompleteOrder = () => {
    toast.success("Order placed successfully!");
    
    // Clear the cart based on user status
    if (currentUser) {
      localStorage.removeItem(`kimcom_cart_${currentUser.id}`);
    } else {
      localStorage.removeItem('cartItems');
    }
    
    // Trigger storage event for navbar to detect changes
    const event = new Event('storage');
    window.dispatchEvent(event);
    
    navigate('/');
  };

  const handleEmptyCart = () => {
    if (cartProducts.length === 0) {
      toast.error("Your cart is already empty");
      return;
    }

    if (currentUser) {
      localStorage.removeItem(`kimcom_cart_${currentUser.id}`);
    } else {
      localStorage.removeItem('cartItems');
    }
    
    setCartItems([]);
    
    // Trigger storage event for navbar to detect changes
    const event = new Event('storage');
    window.dispatchEvent(event);
    
    toast.success("Cart emptied successfully");
    setTimeout(() => navigate('/products'), 1500);
  };
  
  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CardTitle>Your Cart is Empty</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-8">
                <div className="text-gray-500 mb-6">
                  <p>You don't have any products in your cart.</p>
                  <p className="mt-2">Add some products and come back to checkout!</p>
                </div>
                <Button onClick={() => navigate('/products')} className="bg-kimcom-600 hover:bg-kimcom-700">
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartProducts.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded bg-gray-100 mr-3 overflow-hidden">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.category}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">KSh {item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">KSh {(item.price * item.quantity).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>KSh {shippingCost.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>KSh {total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleEmptyCart}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Empty Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Delivery Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input 
                        id="address"
                        placeholder="Enter your full delivery address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        disabled={isPaid}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Payment Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue="mpesa" 
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as 'mpesa' | 'card' | 'ondelivery')}
                    className="space-y-4"
                    disabled={isPaid}
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa" className="flex items-center cursor-pointer flex-1">
                        <Phone className="mr-2 h-4 w-4 text-green-600" />
                        M-Pesa
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                        Card Payment
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                      <RadioGroupItem value="ondelivery" id="ondelivery" />
                      <Label htmlFor="ondelivery" className="flex items-center cursor-pointer flex-1">
                        <Truck className="mr-2 h-4 w-4 text-orange-600" />
                        Pay on Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox 
                        id="terms" 
                        checked={agreeToTerms} 
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)} 
                        disabled={isPaid}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                  
                  {paymentMethod === 'mpesa' && !isPaid && (
                    <form onSubmit={handleMpesaPayment} className="mt-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-md text-green-800 mb-2">
                          <p className="font-medium mb-1">Payment Instructions:</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Send payment of <strong>KSh {total.toLocaleString()}</strong> to <strong>{mpesaPhone}</strong> via M-Pesa.</li>
                            <li>After payment, copy the M-Pesa transaction code (e.g. QKL5HTRPNM).</li>
                            <li>Paste the code below and submit your order.</li>
                          </ol>
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-1">M-Pesa Transaction Code</Label>
                          <Input 
                            placeholder="e.g. QKL5HTRPNM" 
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            disabled={isProcessing}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This is the confirmation code sent to you by M-Pesa after payment
                          </p>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={isProcessing || !agreeToTerms}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying Payment...
                            </>
                          ) : (
                            'Confirm Payment'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {paymentMethod === 'card' && !isPaid && (
                    <form onSubmit={handleCardPayment} className="mt-4 space-y-4">
                      <div>
                        <Label className="block text-sm font-medium mb-1">Card Number</Label>
                        <Input placeholder="XXXX XXXX XXXX XXXX" disabled={isProcessing} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="block text-sm font-medium mb-1">Expiry Date</Label>
                          <Input placeholder="MM/YY" disabled={isProcessing} />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-1">CVV</Label>
                          <Input placeholder="XXX" disabled={isProcessing} />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isProcessing || !agreeToTerms}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Pay with Card'
                        )}
                      </Button>
                    </form>
                  )}
                  
                  {paymentMethod === 'ondelivery' && !isPaid && (
                    <form onSubmit={handlePayOnDelivery} className="mt-4">
                      <div className="p-4 bg-yellow-50 rounded-md text-yellow-800 mb-4">
                        <p className="text-sm">
                          You'll pay the full amount when your order is delivered to you.
                          Our delivery agent will accept cash or card payment.
                        </p>
                      </div>
                      <Button 
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        disabled={isProcessing || !agreeToTerms}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Place Order - Pay on Delivery'
                        )}
                      </Button>
                    </form>
                  )}
                  
                  {isPaid && (
                    <div className="text-center py-4">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-700 mb-2">
                        {paymentMethod === 'ondelivery' ? 'Order Placed Successfully' : 'Payment Confirmed'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {paymentMethod === 'mpesa' 
                          ? `Your payment reference (${transactionRef}) has been received.` 
                          : paymentMethod === 'ondelivery'
                            ? 'Your order has been confirmed. You will pay on delivery.'
                            : 'Your payment has been processed successfully.'}
                      </p>
                      <div className="p-4 bg-blue-50 rounded-md text-blue-800 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span className="font-medium">Expected Delivery:</span>
                        </div>
                        <p className="ml-7 text-sm">Within 2-3 business days</p>
                      </div>
                      <Button 
                        onClick={handleCompleteOrder} 
                        className="w-full bg-kimcom-600 hover:bg-kimcom-700"
                      >
                        Complete Order
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col text-sm text-gray-500">
                  <p className="mb-2">Payment is secure and encrypted.</p>
                  <p>For any issues, please contact our support team.</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
