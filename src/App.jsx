import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProductsSection from '@/components/ProductsSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CartSheet from '@/components/CartSheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Preloader from './components/Preloader';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import OrderSummaryPage from './pages/OrdersummaryPage';
import AdminPage from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import { BACKEND_URL } from './lib/config';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const heroRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  const [showThermalPaper, setShowThermalPaper] = React.useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cresen-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cresen-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.cursor = 'auto';
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    const splitText = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return [];
      const text = element.innerText;
      element.innerHTML = '';
      return text.split(' ').map(word => {
        const wordWrapper = document.createElement('div');
        wordWrapper.style.display = 'inline-block';
        wordWrapper.style.overflow = 'hidden';
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        wordSpan.style.display = 'inline-block';
        wordSpan.style.transform = 'translateY(110%)';
        wordWrapper.appendChild(wordSpan);
        element.appendChild(wordWrapper);
        element.appendChild(document.createTextNode(' '));
        return wordSpan;
      });
    };

    const heroTitleSpans = splitText('.hero-title');
    
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.to(heroTitleSpans, {
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.08,
    })
    .fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
      '-=1'
    )
    .fromTo('.hero-buttons', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
      '-=0.8'
    )
    .fromTo('.hero-image',
      { opacity: 0, scale: 1.1, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power4.out' },
      '-=1.2'
    );

    gsap.utils.toArray('.animate-on-scroll').forEach((element) => {
      gsap.fromTo(element, 
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !featuresRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom + window.scrollY;
      const featuresTop = featuresRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollY = window.scrollY + 80; // 80px offset for nav height
      setShowThermalPaper(scrollY > heroBottom && scrollY < featuresTop);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && user.email) {
      fetch(`${BACKEND_URL}/api/save-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cart })
      });
    }
  }, [cart, user]);

  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Hi, I’m interested in customizing Cresen Thermal Paper for my business. Could you please share the available options and pricing details?");
    window.open(`https://wa.me/917994951831?text=${message}`, '_blank');
  };

  const handleCallNow = () => {
    window.open('tel:+919995742767', '_self');
  };

  const handleEmailContact = () => {
    window.open('mailto:cresenventures@gmail.com', '_self');
  };

  const showComingSoonToast = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 3000,
    });
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.title === product.title);
      let newCart;
      if (existingProduct) {
        newCart = prevCart.map((item) =>
          item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      return newCart;
    });
    toast({
      title: "✅ Added to Cart",
      description: `${product.title} has been added to your cart.`,
      duration: 2000,
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productTitle) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.title !== productTitle);
      return newCart;
    });
  };

  const updateQuantity = (productTitle, quantity) => {
    if (quantity < 1) {
      removeFromCart(productTitle);
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.title === productTitle ? { ...item, quantity } : item
        );
        return newCart;
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    if (user && user.email) {
      // Clear backend cart as well
      fetch(`${BACKEND_URL}/api/save-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cart: [] })
      });
    }
  }

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const commonProps = {
    handleWhatsAppContact,
    handleCallNow,
    handleEmailContact,
    showComingSoonToast,
    addToCart,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {isLoading && <Preloader onAnimationComplete={handleFinishLoading} />}
      </AnimatePresence>
      {!isLoading && (
        <>
          <Toaster />
          <Navbar {...commonProps} showThermalPaper={showThermalPaper} user={user} setUser={setUser} setCart={setCart} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <main>
                    <HeroSection ref={heroRef} {...commonProps} />
                    <FeaturesSection ref={featuresRef} />
                    <ProductsSection {...commonProps} />
                    <ServicesSection />
                    <AboutSection />
                    <ContactSection {...commonProps} />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route path="/ordersummary" element={<OrderSummaryPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <CartSheet
            isOpen={isCartOpen}
            setIsOpen={setIsCartOpen}
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            handleWhatsAppContact={handleWhatsAppContact}
            user={user}
            setUser={setUser}
            setCart={setCart}
          />
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={() => setIsCartOpen(true)}
              size="lg"
              className="rounded-full shadow-lg w-16 h-16 relative flex flex-col items-center justify-center bg-primary"
            >
              <ShoppingCart className="w-7 h-7 text-white mb-1" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                  {totalCartItems}
                </span>
              )}
              <span className="sr-only">Open cart</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;