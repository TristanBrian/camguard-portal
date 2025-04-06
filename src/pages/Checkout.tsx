
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CreditCard, Phone, Loader2, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  
  // Mock cart items - in a real app, these would come from a cart context or state
  const cartItems = [
    {
      id: "p1",
      name: "HD Dome Camera",
      price: 8999,
      quantity: 1
    },
    {
      id: "p6",
      name: "PTZ Security Camera",
      price: 24999,
      quantity: 2
    }
  ];
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 500;
  const total = subtotal + shippingCost;
  
  const handleMpesaPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mpesaPhone || mpesaPhone.length !== 10) {
      toast.error("Please enter a valid M-Pesa phone number");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate M-Pesa STK push
    toast.info("M-Pesa payment request sent. Please check your phone.");
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      toast.success("Payment received successfully!");
    }, 3000);
  };
  
  const handleCardPayment = () => {
    // In a real app, this would integrate with a card payment gateway
    toast.info("Card payment is currently not available. Please use M-Pesa.");
  };
  
  const handleCompleteOrder = () => {
    toast.success("Order placed successfully!");
    navigate('/');
  };
  
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">KSh {item.price.toLocaleString()}</TableCell>
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
                  <div className="flex space-x-2 mb-6">
                    <Button 
                      variant={paymentMethod === 'mpesa' ? 'default' : 'outline'} 
                      className={paymentMethod === 'mpesa' ? 'bg-green-600 hover:bg-green-700' : ''}
                      onClick={() => setPaymentMethod('mpesa')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      M-Pesa
                    </Button>
                    <Button 
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </Button>
                  </div>
                  
                  {paymentMethod === 'mpesa' && !isPaid && (
                    <form onSubmit={handleMpesaPayment}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">M-Pesa Phone Number</label>
                          <Input 
                            placeholder="07XXXXXXXX" 
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            maxLength={10}
                            disabled={isProcessing}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Pay with M-Pesa'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Card Number</label>
                        <Input placeholder="XXXX XXXX XXXX XXXX" disabled />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Expiry Date</label>
                          <Input placeholder="MM/YY" disabled />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">CVV</label>
                          <Input placeholder="XXX" disabled />
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        className="w-full"
                        onClick={handleCardPayment}
                        disabled
                      >
                        Pay with Card
                      </Button>
                    </div>
                  )}
                  
                  {isPaid && (
                    <div className="text-center py-4">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-700 mb-2">Payment Successful</h3>
                      <p className="text-gray-600 mb-4">Your M-Pesa payment has been received.</p>
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
