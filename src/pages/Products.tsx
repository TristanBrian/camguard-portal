import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductDetailPopup from '../components/ProductDetailPopup';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight,
  Filter,
  Search,
  LogIn,
  ShoppingCart,
  Trash2,
  MinusCircle,
  RefreshCw
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Product } from '../data/productsData';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { supabase } from '../integrations/supabase/client';
import { fetchProducts } from '../integrations/supabase/admin';

import { CartProvider, useCart } from '../contexts/CartContext';
import Cart from '../components/Cart';

const ProductsContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    cartItems,
    products,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    deleteFromCart,
    emptyCart,
    cartTotal,
    cartProductDetails,
    setProducts,
    checkout,
  } = useCart();

  // Fetch products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const dbProducts = await fetchProducts();
        setProducts(dbProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    
    loadProducts();
    
    // Set up real-time subscription for product changes
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          loadProducts(); // Reload products when anything changes
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setProducts]);

  // Check user login status
  useEffect(() => {
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    } else {
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      };
      
      checkUser();
    }
  }, []);

    // Extract unique categories from products for the filter
    const categories = ['All', ...(Array.from(new Set(products.map(p => p.category))) || [])];

    // Filter products based on search term and category
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
  const handleViewDetails = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsProductDetailOpen(true);
    } else {
      navigate(`/product-details/${id}`);
    }
  };

  const onProductAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      toast.error("Please login to add products to the cart.");
      return;
    }
    addToCart(product.id);
    toast.success(`Added ${product.name} to cart`);
    setIsCartOpen(true);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      await checkout();
      navigate('/checkout');
    } catch (error: any) {
      if (error.message === 'User not logged in') {
        toast.info("Please login to continue with checkout", {
          action: {
            label: "Login",
            onClick: () => navigate('/login')
          },
        });
      } else {
        toast.error("Failed to proceed to checkout");
      }
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex flex-col">
        <section className="bg-gradient-to-r from-kimcom-800 to-kimcom-600 py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Security Products</h1>
            <p className="text-xl max-w-3xl">
              Browse our extensive collection of high-quality security cameras, recorders, and networking equipment. All products come with professional installation guidance and warranty.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50 flex-grow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-kimcom-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-kimcom-50'
                  }`}
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
              >
                Clear filters
              </button>
            </div>

            <div className="mb-8 flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">Filter by:</span>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-kimcom-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Button>
                <Button 
                  onClick={handleCheckout}
                  className="bg-kimcom-600 hover:bg-kimcom-700"
                  disabled={cartItems.length === 0}
                >
                  {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your search.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description || ''}
                    price={product.price}
                    image={product.image || '/placeholder.svg'}
                    category={product.category}
                    difficulty={product.difficulty}
                    stock={product.stock}
                    brand={product.brand || ''}
                    model={product.model || ''}
                    onViewDetails={() => handleViewDetails(product.id)}
                    onAddToCart={() => onProductAddToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <Cart
        cartItems={cartItems}
        products={products}
        onRemoveFromCart={removeFromCart}
        onDeleteFromCart={deleteFromCart}
        onEmptyCart={emptyCart}
        onCheckout={handleCheckout}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />

      <ProductDetailPopup
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onAddToCart={onProductAddToCart}
      />
    </>
  );
};

const Products = () => (
  <CartProvider>
    <ProductsContent />
  </CartProvider>
);

export default Products;