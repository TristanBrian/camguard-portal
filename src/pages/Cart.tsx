
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();

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
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
