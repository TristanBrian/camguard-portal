import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck, ShoppingCart, Phone, Lock, User, UserCircle2, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const updateCartCount = () => {
    // Check if user is logged in
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      const userData = JSON.parse(user);
      
      // Load user's cart count
      const userCartKey = `kimcom_cart_${userData.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        setCartItemCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
      } else {
        setCartItemCount(0);
      }
    } else {
      // Check anonymous cart
      const anonymousCart = localStorage.getItem('cartItems');
      if (anonymousCart) {
        const cartItems = JSON.parse(anonymousCart);
        setCartItemCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
      } else {
        setCartItemCount(0);
      }
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('kimcom_current_user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
    }
    
    // Initial cart count update
    updateCartCount();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Poll for changes since the storage event won't fire in the same tab
    const interval = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCallButton = () => {
    window.location.href = 'tel:0740213382';
  };

  const handleLogout = () => {
    localStorage.removeItem('kimcom_current_user');
    setCurrentUser(null);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCartClick = () => {
    navigate('/products');
    // Trigger cart popover to open via localStorage
    localStorage.setItem('open_cart_popover', 'true');
    // Force update of cart count
    updateCartCount();
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
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 whitespace-nowrap text-xs lg:text-sm" 
              onClick={handleCallButton}
            >
              <Phone className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="hidden lg:inline">0740213382</span>
            </Button>
            
            <Button 
              onClick={handleCartClick}
              size="sm"
              variant="outline"
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Link to="/products">
              <Button 
                className="bg-kimcom-600 hover:bg-kimcom-700 flex items-center gap-1 text-xs lg:text-sm" 
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span>Shop Now</span>
              </Button>
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden lg:block">Hi, {currentUser.fullName.split(' ')[0]}</span>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-gray-600 hover:text-kimcom-600"
                    onClick={handleProfileClick}
                  >
                    <UserCircle2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-gray-600 hover:text-kimcom-600" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 hover:text-kimcom-600">
                  <UserCircle2 className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
            
            {currentUser?.role === 'admin' && (
              <Link to="/admin-login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 hover:text-kimcom-600">
                  <Lock className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              onClick={handleCartClick}
              size="sm"
              variant="ghost"
              className="relative mr-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
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
            
            {currentUser ? (
              <>
                <div className="block px-3 py-2 text-base font-medium text-gray-700">
                  Signed in as <span className="font-semibold">{currentUser.fullName}</span>
                </div>
                <Link 
                  to="/profile" 
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle2 className="h-5 w-5 mr-2" />
                  My Profile
                </Link>
                <button
                  className="flex w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
            
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin-login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-kimcom-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center justify-center gap-1"
                onClick={handleCallButton}
              >
                <Phone className="h-4 w-4" />
                <span>0740213382</span>
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="relative flex-1 justify-center"
                  onClick={() => {
                    navigate('/products');
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </div>
              
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-kimcom-600 hover:bg-kimcom-700 flex items-center justify-center gap-1 w-full">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Shop Now</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
