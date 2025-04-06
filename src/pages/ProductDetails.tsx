
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // In a real app, this would come from auth context
  
  // Sample product data - in a real app, this would come from a database
  const productsData = [
    {
      id: "p1",
      name: "HD Dome Camera",
      description: "1080p indoor security camera with night vision and motion detection.",
      longDescription: "This high-definition dome camera offers crystal-clear 1080p video, making it ideal for indoor security monitoring. With advanced night vision capabilities of up to 30 feet in complete darkness and built-in motion detection, you'll receive alerts whenever activity is detected. The sleek dome design allows for discrete installation on ceilings or walls, and its wide-angle lens ensures maximum coverage of your space.",
      price: 8999,
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      category: "Indoor",
      difficulty: "Easy" as const,
      features: [
        "1080p HD resolution",
        "Night vision up to 30ft",
        "Motion detection alerts",
        "Easy ceiling/wall mounting",
        "Wide-angle lens",
        "Compatible with NVR systems"
      ],
      specs: {
        resolution: "1920 x 1080",
        sensor: "1/2.7\" CMOS",
        lens: "2.8mm",
        nightVision: "30ft / 10m",
        powerSupply: "DC 12V",
        dimensions: "110mm x 80mm"
      },
      stock: 15
    },
    // ... add more detailed product data for other products
  ];
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch product details
    const fetchProduct = () => {
      setLoading(true);
      const foundProduct = productsData.find(p => p.id === id) || null;
      setProduct(foundProduct);
      setLoading(false);
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to your cart");
      navigate('/admin-login');
      return;
    }
    
    toast.success(`Added ${product.name} to cart`);
  };
  
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.error("Please login to purchase");
      navigate('/admin-login');
      return;
    }
    
    // Add to cart and navigate to checkout
    toast.success(`Added ${product.name} to cart`);
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
                className="w-full h-full object-contain object-center"
                style={{ maxHeight: '500px' }}
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-5 w-5" fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-600">(24 reviews)</span>
              </div>
              
              <p className="text-2xl font-bold text-kimcom-600 mb-4">
                KSh {product.price.toLocaleString()}
              </p>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.longDescription || product.description}</p>
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
          
          {/* Related Products would go here */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
