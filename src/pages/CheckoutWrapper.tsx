import React, { useEffect } from 'react';
import { CartProvider, useCart } from '../contexts/CartContext';
import Checkout from './Checkout';
import { fetchProducts } from '../integrations/supabase/admin';

const InnerCheckoutWrapper = () => {
  const { setProducts } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dbProducts = await fetchProducts();
        setProducts(dbProducts);
        console.log("Products loaded in CheckoutWrapper:", dbProducts.length);
      } catch (error) {
        console.error("Error fetching products in CheckoutWrapper:", error);
      }
    };

    loadProducts();
  }, [setProducts]);

  return <Checkout />;
};

const CheckoutWrapper = () => (
  <CartProvider>
    <InnerCheckoutWrapper />
  </CartProvider>
);

export default CheckoutWrapper;
