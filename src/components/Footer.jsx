import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      {/* Responsive style for contact info */}
      <style>{`
        @media (max-width: 600px) {
          .footer-contact { text-align: center !important; margin-top: 20px !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
        {/* Quick Links (Left) */}
        <nav aria-label="Footer navigation" style={{ flex: '1 1 250px', textAlign: 'left' }}>
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
          className="footer-contact"
          style={{
            flex: '1 1 250px',
            textAlign: 'left',
            marginLeft: '600px'
          }}
        >
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Contact</h2>
          <address style={{ fontStyle: 'normal' }}>
            <p style={{ margin: '4px 0' }}>📞 <a href="tel:+919995742767" style={{ color: '#ccc', textDecoration: 'none' }}>+91 9995742767</a></p>
            <p style={{ margin: '4px 0' }}>✉️ <a href="mailto:cresenventures@gmail.com" style={{ color: '#ccc', textDecoration: 'none' }}>cresenventures@gmail.com</a></p>
            <p style={{ margin: '4px 0' }}>📍 Maradu, Ernakulam, Kerala, India</p>
          </address>
        </div>

      </div>
      <hr style={{ margin: '30px 0', borderColor: '#444' }} />
              {/* Logo & Slogan (Right) */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Cresen Ventures company logo - premium thermal paper solutions" style={{ height: '56px', width: '56px', background: '#fff', borderRadius: '50%', padding: '8px', marginBottom: '5px', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)' }} />
          <p style={{ margin: 0, color: '#eee', fontWeight: 600 }}>Clear. Durable. Reliable.</p>
        </div>
      <p style={{ textAlign: 'center', color: '#aaa' }}>© 2025 Cresen Ventures and Innovations. All rights reserved.</p>
    </footer>
  );
};

export default Footer;