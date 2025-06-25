import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, addToCart, handleWhatsAppContact }) => {
  const { title, description, price, unitInfo, features, custom } = product;
  
  const handleOrder = () => {
    if (custom) {
      handleWhatsAppContact();
    } else {
      addToCart(product);
    }
  };

  const isHighlighted = custom;

  return (
    <div className={`
      rounded-3xl border border-white/20 p-8 h-full flex flex-col
      bg-white/10 backdrop-blur-2xl relative overflow-hidden
      transition-all duration-300 group
    `}>
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="mb-8 text-left">
            <p className="font-bold text-2xl text-white mb-2">{title}</p>
            {price ? (
              <div>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">{price}</span>
                  <span className="text-lg font-medium text-gray-400 ml-2">{unitInfo}</span>
                </div>
                <p className="text-md font-medium text-primary mt-1">{description}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-4xl font-extrabold text-white">Custom Solutions</h3>
                <p className="text-md font-medium text-primary mt-1">{description}</p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 my-6"></div>

          <ul className="space-y-4 mb-8 text-gray-300 text-left">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-primary/80 mr-3 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button
          onClick={handleOrder}
          className={`w-full py-3 rounded-full text-base font-bold transition-all duration-300
            ${isHighlighted
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }
          `}
        >
           {custom ? <MessageCircle className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
           {custom ? 'Get Custom Quote' : 'Order Now'}
        </Button>
      </div>
    </div>
  );
};

const ProductsSection = ({ addToCart, handleWhatsAppContact }) => {
  const products = [
    {
      id: "prod_standard_box",
      title: "Standard Roll Box",
      description: "78mm x 50mtrs",
      price: "₹10,200",
      numericPrice: 10200,
      unitInfo: "/ box of 150",
      features: [
        "High-quality 50gsm paper",
        "Sharp & clear print clarity",
        "Long-lasting performance",
        "Compatible with all major printers"
      ],
      custom: false,
    },
    {
      id: "prod_custom",
      title: "Custom Solutions",
      description: "Tailored to your specific needs",
      price: null,
      numericPrice: 0,
      unitInfo: "",
      features: [
        "Any size and length specifications",
        "Custom core sizes available",
        "Private label branding ",
        "Special pricing for bulk orders"
      ],
      custom: true,
    },
    {
      id: "prod_compact_box",
      title: "Compact Roll Box",
      description: "56mm x 25mtrs",
      price: "₹4,500",
      numericPrice: 4500,
      unitInfo: "/ box of 150",
      features: [
        "Compact size for small printers",
        "Excellent and reliable print quality",
        "A highly cost-effective solution",
        "Perfect for modern POS systems"
      ],
      custom: false,
    }
  ];

  return (
    <section id="products" aria-labelledby="products-heading" className="py-24 bg-black relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <h1 
          id="products-heading"
          className="text-[20vw] lg:text-[12vw] font-black text-white opacity-10 select-none"
        >
          Our Products
        </h1>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tighter">
            Choose Your Perfect Roll
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Quality and precision in every size, tailored for your business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.filter(p => !p.custom).map((product) => (
              <motion.div
                className="animate-on-scroll"
                key={product.id}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ProductCard 
                  product={product} 
                  addToCart={addToCart}
                  handleWhatsAppContact={handleWhatsAppContact}
                />
              </motion.div>
          ))}
           {products.filter(p => p.custom).map((product) => (
             <motion.div
                className="animate-on-scroll md:col-span-2 lg:col-span-1"
                key={product.id}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ProductCard 
                  product={product} 
                  addToCart={addToCart}
                  handleWhatsAppContact={handleWhatsAppContact}
                />
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;