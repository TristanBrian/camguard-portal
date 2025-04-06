
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Menu, X, ShieldCheck, ShoppingCart, Phone, Lock } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-kimcom-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">KimCom Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link to="/" className="text-gray-700 hover:text-kimcom-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-kimcom-600 font-medium transition-colors">
              Services
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-kimcom-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-kimcom-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-kimcom-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </Button>
            <Button className="bg-kimcom-600 hover:bg-kimcom-700 flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Shop Now</span>
            </Button>
            <Link to="/admin-login">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 hover:text-kimcom-600">
                <Lock className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-kimcom-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/admin-login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="outline" size="sm" className="flex items-center justify-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </Button>
              <Button className="bg-kimcom-600 hover:bg-kimcom-700 flex items-center justify-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span>Shop Now</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
