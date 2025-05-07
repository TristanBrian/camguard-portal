
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Products from './pages/Products';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ProductManager from './pages/admin/ProductManager';
import Statistics from './pages/admin/Statistics';
import MarketTrends from './pages/admin/MarketTrends';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<ProductManager />} />
          <Route path="/admin/products/edit/:id" element={<ProductManager />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/market-trends" element={<MarketTrends />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
