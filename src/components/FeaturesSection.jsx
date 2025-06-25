import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Shield, Zap, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = React.forwardRef((props, ref) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);
  const patternRef = useRef(null);

  const features = [
    { icon: Globe, title: "Global Reach", desc: "Serving clients worldwide with reliable supply chains." },
    { icon: Shield, title: "Quality Assured", desc: "International standards with strict quality control." },
    { icon: Zap, title: "Innovation", desc: "Advanced production techniques and sustainable solutions." },
    { icon: Award, title: "Trusted Partner", desc: "Proven track record across multiple industries." }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleEl = titleRef.current;
      if (!titleEl) return;

      const originalText = titleEl.innerText;
      titleEl.innerHTML = '';
      originalText.split(' ').forEach(word => {
        const wordContainer = document.createElement('span');
        wordContainer.className = 'inline-block overflow-hidden pb-2';
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        wordSpan.className = 'inline-block translate-y-full';
        if (word === 'Cresen' || word === 'Ventures') {
          wordSpan.className += ' text-primary';
        }
        wordContainer.appendChild(wordSpan);
        titleEl.appendChild(wordContainer);
        titleEl.appendChild(document.createTextNode(' '));
      });

      const titleSpans = titleEl.querySelectorAll('span > span');
      const subtitleEl = subtitleRef.current;
      const cards = gsap.utils.toArray('.feature-card');

      gsap.set(subtitleEl, { opacity: 0, y: 20 });
      gsap.set(cards, { opacity: 0, y: 50, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to(titleSpans, {
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
      })
      .to(subtitleEl, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
      }, '-=1')
      .to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      }, '-=0.7');

      gsap.to(patternRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      cards.forEach(card => {
        const hoverTimeline = gsap.timeline({ paused: true });
        const icon = card.querySelector('.feature-icon');
        const glow = card.querySelector('.card-glow');

        hoverTimeline
          .to(card, { y: -10, duration: 0.3, ease: 'power2.out' })
          .to(glow, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0)
          .to(icon, { scale: 1.1, rotate: '5deg', color: '#FFFFFF', backgroundColor: '#408BF2', duration: 0.3, ease: 'power2.out' }, 0);

        card.addEventListener('mouseenter', () => hoverTimeline.play());
        card.addEventListener('mouseleave', () => hoverTimeline.reverse());
      });
      
    }, sectionRef);
    
    return () => ctx.revert();

  }, []);

  return (
    <section ref={el => {
      sectionRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    }} className="py-24 bg-secondary relative overflow-hidden">
      <div ref={patternRef} className="pattern-bg absolute top-0 left-0 w-full h-[calc(100%+200px)] z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Why Choose Cresen Ventures
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading the industry with innovation, quality, and customer satisfaction.
          </p>
        </div>
        
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-card p-8 rounded-2xl text-center border border-border/50 shadow-sm transition-shadow duration-300 hover:shadow-xl relative overflow-hidden cursor-pointer"
            >
              <div className="card-glow absolute inset-0 z-0 bg-primary/20 opacity-0 scale-50 transition-opacity duration-300 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="feature-icon-wrapper inline-block mb-6">
                   <div className="feature-icon w-16 h-16 text-primary bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300">
                     <feature.icon className="w-8 h-8" />
                   </div>
                </div>
                <h3 className="feature-title text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="feature-desc text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FeaturesSection;