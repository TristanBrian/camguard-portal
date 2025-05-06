import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailPopup from '@/components/ProductDetailPopup';
import ProductsTable from '@/components/ProductsTable'; // Import ProductsTable for better display
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Product } from '@/data/productsData';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from '@/integrations/supabase/client';
import { adminClient, ensureAdminAuth, debugFetchProducts } from '@/integrations/supabase/adminClient';
import { initializeAdminIfNeeded } from '@/utils/adminAuth';

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<{id: string, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Ensure we have an admin user for development
  initializeAdminIfNeeded();
  
  // Enhanced fetch products function with better error handling
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching products for display page...");
        
        let productsData: Product[] = [];
        let fetchError = null;
        
        // First try fetching with the regular client since RLS should allow public read access
        try {
          console.log("Trying to fetch products with regular supabase client...");
          const { data: regularProducts, error: regularError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (regularError) {
            console.error("Regular fetch error:", regularError);
            fetchError = regularError;
          } else if (regularProducts && regularProducts.length > 0) {
            console.log(`Successfully loaded ${regularProducts.length} products with regular client`);
            productsData = regularProducts as Product[];
          } else {
            console.log("No products found with regular client, will try admin client");
          }
        } catch (regularErr) {
          console.error("Failed to fetch products with regular client:", regularErr);
          fetchError = regularErr;
        }
        
        // If regular client didn't work or returned no products, try admin client as fallback
        if (productsData.length === 0) {
          try {
            console.log("Trying admin client as fallback...");
            const adminProducts = await debugFetchProducts();
              
            if (adminProducts && adminProducts.length > 0) {
              console.log(`Successfully loaded ${adminProducts.length} products with adminClient`);
              productsData = adminProducts as Product[];
            } else {
              console.log("No products found with adminClient either");
            }
          } catch (adminErr) {
            console.error("Failed to fetch products with adminClient:", adminErr);
            fetchError = adminErr;
          }
        }
        
        // At this point, if we have products, show them
        if (productsData.length > 0) {
          console.log("Products loaded:", productsData);
          setProducts(productsData);
          toast.success(`Loaded ${productsData.length} products`);
        } else {
          console.log("No products found in the database");
          if (fetchError) {
            setError(`Failed to load products: ${fetchError.message}`);
            toast.error("Error loading products");
          } else {
            toast.warning("No products found. You may need to add some products in the admin dashboard.");
          }
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
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
          console.log('Product database change detected:', payload);
          loadProducts(); // Reload products when anything changes
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [retryCount]); // Added retryCount to trigger refresh
  
  // Check user login status and load cart items
  useEffect(() => {
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setIsLoggedIn(true);
        
        const userCartKey = `kimcom_cart_${userData.id}`;
        const savedCart = localStorage.getItem(userCartKey);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        } else {
          setCartItems([]);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    } else {
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          
          const userCartKey = `kimcom_cart_${user.id}`;
          const savedCart = localStorage.getItem(userCartKey);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        } else {
          const anonymousCart = localStorage.getItem('cartItems');
          if (anonymousCart) {
            setCartItems(JSON.parse(anonymousCart));
          }
        }
      };
      
      checkUser();
    }
  }, []);
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`kimcom_cart_${currentUser.id}`, JSON.stringify(cartItems));
      
      const event = new Event('storage');
      window.dispatchEvent(event);
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      const event = new Event('storage');
      window.dispatchEvent(event);
    }
  }, [cartItems, currentUser]);

  // Extract unique categories from products for the filter
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

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

  const handleAddToCart = (id: string) => {
    const existingItem = cartItems.find(item => item.id === id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { id, quantity: 1 }]);
    }
    
    const product = products.find(p => p.id === id);
    toast.success(`Added ${product?.name} to cart`);
    
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    const existingItem = cartItems.find(item => item.id === id);
    const product = products.find(p => p.id === id);
    
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ));
      toast.info(`Removed 1 ${product?.name} from cart`);
    } else {
      setCartItems(cartItems.filter(item => item.id !== id));
      toast.info(`Removed ${product?.name} from cart`);
    }
  };

  const handleDeleteFromCart = (id: string) => {
    const product = products.find(p => p.id === id);
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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!isLoggedIn) {
      toast.info("Please login to continue with checkout", {
        action: {
          label: "Login",
          onClick: () => navigate('/login')
        },
      });
      return;
    }
    
    if (currentUser) {
      localStorage.setItem(`kimcom_cart_${currentUser.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    navigate('/checkout');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartProductDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.id);
    return {
      ...product,
      quantity: item.quantity
    };
  }).filter(item => item);

  const cartTotal = cartProductDetails.reduce((total, item) => 
    total + (item.price * item.quantity), 0);

  const onProductAddToCart = (product: Product) => {
    handleAddToCart(product.id);
  };

  const onProductCardClick = (id: string) => {
    handleViewDetails(id);
  };

  const handleRefreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setRetryCount(prev => prev + 1); // Increment retry count to trigger useEffect
      toast.success("Refreshing products...");
    } catch (error) {
      console.error("Error refreshing products:", error);
      setError("Failed to refresh products. Please try again.");
      toast.error("Failed to refresh products");
      setLoading(false);
    }
  };

  const handleGoToAdmin = () => {
    navigate('/admin/products');
  };

  // Check if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!isLoggedIn || !currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currentUser.id)
          .eq("role", "admin")
          .maybeSingle();
          
        if (data) {
          setIsAdmin(true);
          console.log("User is admin");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkIfAdmin();
  }, [isLoggedIn, currentUser]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-kimcom-800 to-kimcom-600 py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Security Products</h1>
            <p className="text-xl max-w-3xl">
              Browse our extensive collection of high-quality security cameras, recorders, and networking equipment. All products come with professional installation guidance and warranty.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap gap-4">
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
            </div>

            <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
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
              <div className="flex space-x-4 flex-wrap">
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
                    onClick={handleGoToAdmin}
                  >
                    Admin Dashboard
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshProducts}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline"
                      className="relative"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-4">
                    <h3 className="font-semibold text-lg mb-2">Your Cart</h3>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">Your cart is empty</p>
                        <Button variant="outline" className="mt-2" onClick={() => setIsCartOpen(false)}>
                          Browse Products
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {cartProductDetails.map(item => item && (
                            <div key={item.id} className="flex items-center justify-between py-2 border-b">
                              <div className="flex items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-10 h-10 object-cover rounded mr-2" 
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
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
                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>KSh {cartTotal.toLocaleString()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={handleEmptyCart}
                            >
                              Empty Cart
                            </Button>
                            <Button 
                              className="flex-1 bg-kimcom-600 hover:bg-kimcom-700"
                              size="sm"
                              onClick={handleCheckout}
                            >
                              Checkout
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </PopoverContent>
                </Popover>
                
                <Button 
                  onClick={handleCheckout}
                  className="bg-kimcom-600 hover:bg-kimcom-700"
                  disabled={cartItemCount === 0}
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
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={handleRefreshProducts}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {products.length === 0 
                    ? "No products found in the database. Please add some products in the admin dashboard." 
                    : "No products found matching your search."}
                </p>
                {products.length === 0 && isAdmin && (
                  <Button 
                    className="bg-kimcom-600 hover:bg-kimcom-700 mt-2"
                    onClick={handleGoToAdmin}
                  >
                    Go to Admin Dashboard
                  </Button>
                )}
                {products.length > 0 && (
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
                )}
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
                    onViewDetails={() => onProductCardClick(product.id)}
                    onAddToCart={() => onProductAddToCart(product)}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-kimcom-50 text-kimcom-700">1</Button>
                  <Button variant="outline" size="sm" disabled>2</Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
      <ProductDetailPopup
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onAddToCart={onProductAddToCart}
      />
    </div>
  );
};

export default Products;
