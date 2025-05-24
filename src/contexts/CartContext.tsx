import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/productsData';
import { createOrder, OrderItem, generateOrderNumber } from '../integrations/supabase/orders';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  products: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  emptyCart: () => void;
  clearCartCache: () => void;
  cartTotal: number;
  cartProductDetails: (Product & { quantity: number })[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load user and cart from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        const userCartKey = `kimcom_cart_${userData.id}`;
        const savedCart = localStorage.getItem(userCartKey);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error('Error parsing user data in CartContext:', e);
      }
    } else {
      const anonymousCart = localStorage.getItem('cartItems');
      if (anonymousCart) {
        setCartItems(JSON.parse(anonymousCart));
      }
    }
  }, []);

  // Save cart to localStorage on cartItems or currentUser change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`kimcom_cart_${currentUser.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    // Dispatch storage event for other tabs/components
    const event = new Event('storage');
    window.dispatchEvent(event);
  }, [cartItems, currentUser]);

  const addToCart = (id: string) => {
    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { id, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCartItems(cartItems.filter(item => item.id !== id));
    }
  };

  const deleteFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  const clearCartCache = () => {
    if (currentUser) {
      localStorage.removeItem(`kimcom_cart_${currentUser.id}`);
    }
    localStorage.removeItem('cartItems');
    // Dispatch storage event for other tabs/components
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  const cartProductDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean) as (Product & { quantity: number })[];

  const cartTotal = cartProductDetails.reduce((total, item) =>
    total + (item.price * item.quantity), 0);

  const checkout = async () => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    const orderItems = cartItems.map(item => {
      const product = products.find(p => p.id === item.id);
      return product ? {
        id: item.id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity,
      } : null;
    }).filter(Boolean) as (OrderItem & { unit_price: number; total_price: number })[];

    const order = await createOrder(
      'c95c0533-3198-40c5-ac84-16500682c237', // store_id, adjust if needed
      currentUser.id,
      generateOrderNumber(),
      orderItems,
      cartTotal,
      null, // payment_method
      'pending', // payment_status
      {}
    );

    if (order) {
      emptyCart();
      setIsCartOpen(false);
      alert('Order placed successfully!');
    } else {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      products,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      deleteFromCart,
      emptyCart,
      clearCartCache,
      cartTotal,
      cartProductDetails,
      setProducts,
      setCartItems,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
