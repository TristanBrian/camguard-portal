
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
          <Button 
            onClick={() => navigate('/products')}
            variant="default"
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
