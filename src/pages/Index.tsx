import React, { useEffect, useState } from "react";
import Navbar from "components/Navbar";
import Hero from "components/Hero";
import ServiceCard from "components/ServiceCard";
import ProductCard from "components/ProductCard";
import TestimonialCard from "components/TestimonialCard";
import CTASection from "components/CTASection";
import Footer from "components/Footer";
import { Button } from "components/ui/button";
import { Camera, Settings, Wifi, ShieldCheck, Server, Network, ArrowRight, Package } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts } from "integrations/supabase/admin";

const Index = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample service data
  const services = [{
    id: "s1",
    title: "CCTV Installation",
    description: "Professional installation of security camera systems for homes and businesses.",
    icon: Camera
  }, {
    id: "s2",
    title: "System Maintenance",
    description: "Regular maintenance and repairs to keep your security systems running optimally.",
    icon: Settings
  }, {
    id: "s3",
    title: "Network Setup",
    description: "Complete networking solutions including WiFi optimization and router configuration.",
    icon: Wifi
  }, {
    id: "s4",
    title: "Security Audits",
    description: "Comprehensive security assessments to identify and address vulnerabilities.",
    icon: ShieldCheck
  }];

  // Sample testimonial data
  const testimonials = [{
    content: "KimCom Solutions provided excellent service when installing our office security system. Professional, efficient, and knowledgeable team!",
    author: "Sarah Odhiambo",
    role: "Office Manager",
    rating: 5
  }, {
    content: "We've been using their maintenance service for our CCTV system for years. Always reliable and quick to respond to any issues.",
    author: "Rita Mutua",
    role: "Store Owner",
    rating: 5
  }, {
    content: "The network setup they did for our home office is amazing. Great WiFi coverage and the security features give us peace of mind.",
    author: "Kelvin Momanyi",
    role: "Remote Professional",
    rating: 4
  }];

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await fetchProducts();
        const featured = products.filter(p => p.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Failed to load featured products:", error);
        toast.error("Could not load featured products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleViewDetails = (id: string) => {
    navigate(`/product-details/${id}`);
  };

  const handleAddToCart = (id: string) => {
    // Get cart from localStorage or initialize empty array
    const existingCart = localStorage.getItem('cartItems');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already in cart
    const existingItem = cartItems.find((item: { id: string }) => item.id === id);
    if (existingItem) {
      // Increment quantity if already in cart
      const updatedCart = cartItems.map((item: { id: string; quantity: number }) => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } else {
      // Add new item to cart
      const updatedCart = [...cartItems, { id, quantity: 1 }];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
    
    const product = featuredProducts.find(p => p.id === id);
    toast.success(`Added ${product?.name} to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Our Security Services</h2>
              <p className="text-xl text-gray-600">
                Comprehensive security solutions tailored to your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map(service => (
                <ServiceCard 
                  key={service.id} 
                  title={service.title} 
                  description={service.description} 
                  icon={service.icon} 
                  buttonText=""
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-kimcom-200 text-kimcom-700 hover:bg-kimcom-50" 
                onClick={() => navigate('/services')}
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  alt="Security professionals installing CCTV" 
                  className="rounded-xl shadow-xl" 
                  src="/lovable-uploads/ed271c59-d2fa-4603-a4f3-a98005dc8b9c.jpg" 
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                  Why Choose KimCom Solutions?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  With over 6 years of experience in the security industry, we're committed to providing top-quality products and services tailored to your specific needs.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-kimcom-100 text-kimcom-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Certified Professionals</h3>
                      <p className="mt-2 text-gray-600">Our team consists of certified security specialists with extensive training and experience.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-kimcom-100 text-kimcom-600">
                        <Package className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quality Products</h3>
                      <p className="mt-2 text-gray-600">We only offer high-quality, reliable products from trusted manufacturers.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-kimcom-100 text-kimcom-600">
                        <Server className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Comprehensive Solutions</h3>
                      <p className="mt-2 text-gray-600">From installation to maintenance and networking, we provide end-to-end security solutions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-kimcom-100 text-kimcom-600">
                        <Network className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Ongoing Support</h3>
                      <p className="mt-2 text-gray-600">We offer continuous technical support and maintenance to ensure your systems are always operational.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600">
                Discover our selection of high-quality security and networking equipment
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    difficulty={product.difficulty}
                    stock={product.stock}
                    onViewDetails={() => handleViewDetails(product.id)}
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                ))}
              </div>
            )}

            <div className="mt-16 text-center">
              <Button 
                className="bg-kimcom-600 hover:bg-kimcom-700" 
                size="lg" 
                onClick={() => navigate('/products')}
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-600">
                Read testimonials from our satisfied customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  content={testimonial.content}
                  author={testimonial.author}
                  role={testimonial.role}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection 
          title="Ready to secure your space?" 
          description="Contact us today for a free consultation and quote on your security system needs." 
          primaryButtonText="" 
          secondaryButtonText="Call Us Now" 
          bgColor="bg-kimcom-800" 
        />

        {/* Gallery Section */}
       
      </main>

      <Footer />
    </div>
  );
};

export default Index;