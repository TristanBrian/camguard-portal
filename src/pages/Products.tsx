
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight,
  Filter,
  Search,
  LogIn
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // In a real app, this would come from auth context
  
  // Sample product data - in a real app, this would come from a database
  const productsData = [
    {
      id: "p1",
      name: "HD Dome Camera",
      description: "1080p indoor security camera with night vision and motion detection.",
      price: 8999,
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      category: "Indoor",
      difficulty: "Easy" as const,
    },
    {
      id: "p2",
      name: "4K Bullet Camera",
      description: "Professional 4K outdoor camera with 30m IR range and IP67 weatherproof rating.",
      price: 15999,
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      category: "Outdoor",
      difficulty: "Medium" as const,
    },
    {
      id: "p3",
      name: "8-Channel NVR",
      description: "Network video recorder with 2TB storage and remote viewing capabilities.",
      price: 29999,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      category: "Recorder",
      difficulty: "Advanced" as const,
    },
    {
      id: "p4",
      name: "Mesh WiFi System",
      description: "Whole-home coverage with seamless roaming and parental controls.",
      price: 17999,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      category: "Networking",
      difficulty: "Medium" as const,
    },
    {
      id: "p5",
      name: "Wireless IP Camera",
      description: "Easy to install wireless camera with two-way audio and cloud storage.",
      price: 6999,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      category: "Indoor",
      difficulty: "Easy" as const,
    },
    {
      id: "p6",
      name: "PTZ Security Camera",
      description: "Pan-tilt-zoom camera with 360° coverage and automatic tracking.",
      price: 24999,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      category: "Outdoor",
      difficulty: "Advanced" as const,
    },
    {
      id: "p7",
      name: "16-Channel DVR",
      description: "Digital video recorder with H.265+ compression and multi-site viewing.",
      price: 35999,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      category: "Recorder",
      difficulty: "Advanced" as const,
    },
    {
      id: "p8",
      name: "Security Router",
      description: "Enterprise-grade router with firewall protection and VPN capabilities.",
      price: 12999,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      category: "Networking",
      difficulty: "Medium" as const,
    },
  ];

  // Get unique categories for the filter
  const categories = ['All', ...new Set(productsData.map(product => product.category))];

  // Filter products based on search term and category
  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (id: string) => {
    navigate(`/product-details/${id}`);
  };

  const handleAddToCart = (id: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to your cart");
      navigate('/admin-login');
      return;
    }
    
    toast.success(`Added product ${id} to cart`);
    // In a real app, this would add the product to a cart state/database
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please login to checkout");
      navigate('/admin-login');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-kimcom-800 to-kimcom-600 py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Security Products</h1>
            <p className="text-xl max-w-3xl">
              Browse our extensive collection of high-quality security cameras, recorders, and networking equipment. All products come with professional installation guidance and warranty.
            </p>
          </div>
        </section>

        {/* Products section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* User action */}
            <div className="mb-8 flex justify-end">
              {!isLoggedIn ? (
                <Button 
                  onClick={() => navigate('/admin-login')}
                  className="bg-kimcom-600 hover:bg-kimcom-700"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to Checkout
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckout}
                  className="bg-kimcom-600 hover:bg-kimcom-700"
                >
                  Proceed to Checkout
                </Button>
              )}
            </div>

            {/* Search and filter */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
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
              <div>
                <div className="relative flex items-center">
                  <Filter className="absolute left-3 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-kimcom-500 focus:border-transparent w-full"
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
            </div>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    difficulty={product.difficulty}
                    onViewDetails={() => handleViewDetails(product.id)}
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-kimcom-50 text-kimcom-700">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="mx-1">...</span>
                <Button variant="outline" size="sm">8</Button>
                <Button variant="outline" size="sm">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
