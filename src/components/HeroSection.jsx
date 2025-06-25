import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';

const HeroSection = React.forwardRef(({ handleWhatsAppContact }, ref) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      );
  }, []);

  return (
    <section
      ref={el => {
        sectionRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      aria-labelledby="hero-heading"
      className="relative flex items-center justify-center overflow-x-hidden overflow-hidden min-h-screen w-full pt-8 pb-8 sm:pt-0 sm:pb-0 max-w-full"
    >
      {/* Video background - absolute, only visible in this section */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden max-w-full">
        <video
          id="hero-bg-video"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: 'cover', display: 'block', pointerEvents: 'none', zIndex: 0 }}
          tabIndex="-1"
        >
          <source src="/bg3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="container mx-auto px-4 text-center relative z-20 max-w-3xl flex flex-col justify-center items-center w-full overflow-x-hidden max-w-full">
        <h1
          id="hero-heading"
          ref={titleRef}
          className="text-3xl xs:text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl"
        >
          Premium Thermal Paper Solutions
          <span className="block w-full text-lg xs:text-2xl md:text-4xl font-bold mt-2">
            for Every Industry
          </span>
          <hr className="my-6 border-t-2 border-primary w-24 mx-auto opacity-80" />
        </h1>
        <p
          ref={subtitleRef}
          className="text-base xs:text-lg md:text-2xl text-white font-medium mb-10 max-w-2xl mx-auto drop-shadow"
        >
          Globally recognized manufacturer delivering clear, durable, reliable thermal paper products for diverse industries.
        </p>
        <div
          ref={buttonsRef}
          className="flex flex-col gap-4 sm:flex-row sm:gap-5 justify-center items-center w-full"
        >
          <Button
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-base rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto min-h-[48px] min-w-[48px]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore Products
          </Button>
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-base rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto min-h-[48px] min-w-[48px]"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Get Quote
          </Button>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;