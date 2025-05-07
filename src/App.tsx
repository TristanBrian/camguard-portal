
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
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

function App() {
  return (
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
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Admin />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="products/edit/:id" element={<ProductManager />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
