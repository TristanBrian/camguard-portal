import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<{id: string, quantity: number}[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);

      const userCartKey = `kimcom_cart_${userData.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } else {
      const anonymousCart = localStorage.getItem('cartItems');
      if (anonymousCart) {
        setCartItems(JSON.parse(anonymousCart));
      }
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Clear cache by forcing fresh fetch
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

          if (error) {
            console.error('Error fetching product:', error);
            setProduct(null);
          } else {
            // Normalize features to be an array
            if (data.features && typeof data.features === 'string') {
              try {
                data.features = JSON.parse(data.features);
              } catch (e) {
                console.error('Error parsing product features:', e);
                data.features = [];
              }
            }
            if (!Array.isArray(data.features)) {
              data.features = [];
            }
            setProduct(data);
          }
      } catch (err) {
        console.error('Unexpected error fetching product:', err);
        setProduct(null);
      }
      setLoading(false);
    };

    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
      setProduct(null);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = cartItems.find(item => item.id === product.id);

    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCartItems = [...cartItems, { id: product.id, quantity: 1 }];
    }

    setCartItems(newCartItems);

    // Save to localStorage
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('kimcom_current_user') || '{}');
      localStorage.setItem(`kimcom_cart_${user.id}`, JSON.stringify(newCartItems));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    }

    toast.success(`Added ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.error("Please login to purchase");
      navigate('/admin-login');
      return;
    }

    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
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
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Button variant="link" className="pl-0" onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
          
          {/* Product Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain object-center p-4"
                style={{ maxHeight: '500px' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                {product.brand && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {product.brand}
                  </span>
                )}
                {product.model && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {product.model}
                  </span>
                )}
                <div className="flex text-yellow-400 ml-auto">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-5 w-5" fill="currentColor" />
                  ))}
                </div>
              </div>
              
              <p className="text-2xl font-bold text-kimcom-600 mb-4">
                KSh {product.price.toLocaleString()}
              </p>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="text-green-600 font-medium">
                    ✓ In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="text-red-600 font-medium">
                    ✗ Out of Stock
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-kimcom-600 hover:bg-kimcom-700"
                  onClick={handleBuyNow}
                  disabled={!product.stock}
                >
                  Buy Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
              
              {/* Product Features */}
              {product.features && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Installation Difficulty */}
              <div>
                <h3 className="font-bold text-lg mb-2">Installation</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${product.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                   product.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                   'bg-red-100 text-red-800'}`}
                >
                  {product.difficulty} Installation
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Specifications */}
          {product.specs && (
            <Card className="mb-12">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {Object.entries(product.specs).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
