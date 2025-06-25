import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ handleCallNow, user, setUser, setCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Products", href: "#products" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  // Google login handler for navbar
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    // Fetch cart from backend and restore
    try {
      const cartRes = await fetch('/api/get-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decoded.email })
      });
      const cartData = await cartRes.json();
      if (cartData.success && Array.isArray(cartData.cart)) {
        setCart(cartData.cart);
      }
    } catch (err) {}
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200' : 'bg-gradient-to-b from-black/70 via-black/40 to-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a 
            href="#"
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="relative inline-block h-16 w-16 min-h-16 min-w-16 max-h-16 max-w-16 align-middle">
              <img 
                src="/logo.png" 
                alt="Cresen Ventures Logo" 
                className="relative h-full w-full object-contain rounded-full align-middle z-10" 
                draggable="false"
              />
            </span>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className={`text-xl font-extrabold transition-colors duration-300 ${scrolled || isOpen ? 'text-gray-900' : 'text-white'} drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]`} style={{ fontFamily: 'SF Fourche, sans-serif' }}>CRESEN VENTURES</span>
              <p className={`text-xs font-semibold transition-colors duration-300 ${scrolled || isOpen ? 'text-gray-700' : 'text-gray-100'} drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]`}>And Innovations</p>
            </motion.div>
          </motion.a>
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, staggerChildren: 0.1 }}
          >
            {navLinks.map(link => (
              <motion.a
                key={link.name} 
                href={link.href} 
                className={`transition-colors ${scrolled || isOpen ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-primary/90'}`}
              >
                {link.name}
              </motion.a>
            ))}
            <Button 
              onClick={handleCallNow}
              className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105
                ${scrolled || isOpen 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'}
              `}
              style={{boxShadow: scrolled || isOpen ? '' : '0 2px 8px 0 rgba(0,0,0,0.18)'}}
            >
              <Phone className={`w-4 h-4 mr-2 ${scrolled || isOpen ? 'text-primary-foreground' : 'text-white'}`} />
              Call Now
            </Button>
            {user && user.email ? (
              <span className="text-sm font-semibold text-primary ml-4">{user.name || user.email}</span>
            ) : (
              <div className="ml-4"><GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {}}
                width="180"
                scope="openid email profile"
              /></div>
            )}
          </motion.div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="text-gray-800" /> : <Menu className="text-gray-800" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden pb-4"
        >
          <div className="container mx-auto px-6 flex flex-col space-y-4 items-center">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)} 
                className={`transition-colors ${scrolled || isOpen ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-primary/90'}`}
              >
                {link.name}
              </a>
            ))}
            <Button 
              onClick={() => { handleCallNow(); setIsOpen(false); }}
              className={`px-6 py-2 rounded-full transition-all duration-300 w-full
                ${scrolled || isOpen 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'}
              `}
              style={{boxShadow: scrolled || isOpen ? '' : '0 2px 8px 0 rgba(0,0,0,0.18)'}}
            >
              <Phone className={`w-4 h-4 mr-2 ${scrolled || isOpen ? 'text-primary-foreground' : 'text-white'}`} />
              Call Now
            </Button>
            {user && user.email ? (
              <span className="text-sm font-semibold text-primary mt-2">{user.name || user.email}</span>
            ) : (
              <div className="mt-2"><GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {}}
                width="180"
                scope="openid email profile"
              /></div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;