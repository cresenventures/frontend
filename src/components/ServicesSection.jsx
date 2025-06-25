import React from 'react';
import { motion } from 'framer-motion';
import { Factory, CheckCircle } from 'lucide-react';

const ServicesSection = () => {
  const thermalPaperServices = [
    "ATM and Kiosk Paper Rolls",
    "Label-Grade Thermal Paper",
    "BPA-Free and Eco-Friendly Options",
    "Custom Slitting and Packaging"
  ];

  return (
    <section id="services" className="py-24 bg-background rounded-3xl" aria-labelledby="services-heading">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-on-scroll">
            <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Specialized <span className="text-primary">Services</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We provide a comprehensive range of manufacturing services to meet your specific thermal paper requirements with precision and quality.
            </p>
            <ul className="space-y-4">
              {thermalPaperServices.map((service, index) => (
                <li key={index} className="flex items-center text-gray-600 text-lg">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-on-scroll">
            <img className="rounded-xl shadow-lg w-full h-auto object-cover" alt="Clean and modern thermal paper manufacturing facility with machinery" src="/cresenrolls.jpg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;