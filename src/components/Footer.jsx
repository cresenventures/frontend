import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '12px 6px', fontFamily: 'sans-serif' }}>
      {/* Responsive style for contact info */}
      <style>{`
        @media (max-width: 600px) {
          .footer-contact { text-align: center !important; margin-top: 8px !important; }
          .footer-main { padding: 0 !important; }
          .footer-section { margin-bottom: 6px !important; }
        }
        @media (max-width: 900px) {
          .footer-main { flex-direction: column !important; align-items: stretch !important; text-align: center !important; }
          .footer-section { width: 100% !important; margin-bottom: 8px !important; text-align: center !important; }
          .footer-section:last-child { margin-bottom: 0 !important; }
          .footer-contact { text-align: center !important; margin-top: 0 !important; }
        }
      `}</style>
      <div className="footer-main" style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '6px', padding: 0 }}>
        {/* Quick Links (Left) */}
        <nav aria-label="Footer navigation" className="footer-section" style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Quick Links</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li><a href="#products" style={{ color: '#ccc', textDecoration: 'none' }}>Thermal Paper Products</a></li>
            <li><a href="#services" style={{ color: '#ccc', textDecoration: 'none' }}>Manufacturing Services</a></li>
            <li><a href="#about" style={{ color: '#ccc', textDecoration: 'none' }}>About Cresen Ventures</a></li>
            <li><a href="#contact" style={{ color: '#ccc', textDecoration: 'none' }}>Contact & Location</a></li>
          </ul>
        </nav>
        {/* Contact Info (Middle, center on mobile) */}
        <div
          className="footer-contact footer-section"
          style={{ textAlign: 'left' }}
        >
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Contact</h2>
          <address style={{ fontStyle: 'normal' }}>
            <p style={{ margin: '4px 0' }}>📞 <a href="tel:+919995742767" style={{ color: '#ccc', textDecoration: 'none' }}>+91 9995742767</a></p>
            <p style={{ margin: '4px 0' }}>✉️ <a href="mailto:cresenventures@gmail.com" style={{ color: '#ccc', textDecoration: 'none' }}>cresenventures@gmail.com</a></p>
            <p style={{ margin: '4px 0' }}>📍 Maradu, Ernakulam, Kerala, India</p>
          </address>
        </div>
        {/* Logo & Slogan (Right) */}
        <div className="footer-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Cresen Ventures company logo - premium thermal paper solutions" style={{ height: '56px', width: '56px', background: '#fff', borderRadius: '50%', padding: '8px', marginBottom: '5px', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)' }} />
          <p style={{ margin: 0, color: '#eee', fontWeight: 600 }}>Clear. Durable. Reliable.</p>
        </div>
      </div>
      <hr style={{ margin: '10px 0', borderColor: '#444' }} />
      <p style={{ textAlign: 'center', color: '#aaa', margin: 0, fontSize: '0.92em' }}>© 2025 Cresen Ventures and Innovations. All rights reserved.</p>
    </footer>
  );
};

export default Footer;