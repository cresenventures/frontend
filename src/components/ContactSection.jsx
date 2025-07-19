import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const ContactInfoCard = ({ icon: Icon, title, description, buttonText, onClick }) => (
  <motion.div 
    className="bg-white p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:border-primary/50 hover:shadow-lg min-h-[220px] flex flex-col justify-between"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 text-primary mr-4" />
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 flex-1">{description}</p>
    <Button 
      onClick={onClick}
      aria-label={title + ' contact button'}
      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full justify-center transition-all duration-200"
    >
      {buttonText}
    </Button>
  </motion.div>
);

const ContactSection = ({ handleCallNow, handleEmailContact, handleWhatsAppContact }) => {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 id="contact-heading" className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-8">Reach out for product inquiries, quotes, or support. Our team is ready to assist you.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <a href="mailto:cresenventures@gmail.com" className="text-primary hover:underline block mb-1">cresenventures@gmail.com</a>
            <span className="text-gray-600">Send us your requirements</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">WhatsApp</h2>
            <a href="https://wa.me/919995742767" className="text-primary hover:underline block mb-1" target="_blank" rel="noopener noreferrer">+91 9995742767</a>
            <span className="text-gray-600">Quick quotes and customization</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;