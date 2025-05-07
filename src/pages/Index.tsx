
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CTASection from '../components/CTASection';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/productsData';
import { fetchProducts } from '@/integrations/supabase/admin';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch featured products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        
        // Ensure product data matches the Product type
        const typedProducts: Product[] = products.slice(0, 3).map(product => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          stock: Number(product.stock),
          category: product.category,
          sku: product.sku,
          description: product.description || '',
          image: product.image || '/placeholder.svg',
          difficulty: product.difficulty || 'Medium'
        }));
        
        setFeaturedProducts(typedProducts);
      } catch (error) {
        console.error("Error loading featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Button 
              onClick={() => navigate('/products')}
              variant="outline"
            >
              View All Products
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-kimcom-600 border-t-transparent rounded-full"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No featured products available</p>
              <Link to="/admin/products">
                <Button>Add Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <CTASection />
    </div>
  );
};

export default Index;
