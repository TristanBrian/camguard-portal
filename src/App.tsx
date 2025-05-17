
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
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

// Import placeholder components for new admin routes
const OrdersManager = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Orders Management</h1><p className="text-gray-500">This feature is coming soon.</p></div>;
const CustomersManager = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Customers Management</h1><p className="text-gray-500">This feature is coming soon.</p></div>;
const ReportsManager = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Reports</h1><p className="text-gray-500">This feature is coming soon.</p></div>;

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Admin />}>
            <Route path="products" element={<ProductManager />} />
            <Route path="products/edit/:id" element={<ProductManager />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="market-trends" element={<MarketTrends />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="customers" element={<CustomersManager />} />
            <Route path="reports" element={<ReportsManager />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
