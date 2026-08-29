import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ activeSection, serverStatus }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'Projets', href: '#projects' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Parcours', href: '#experience' },
    { name: 'Mon CV', href: '/cv.html' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <a href="#hero" className="navbar-logo">
          <span className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </span>
          <span className="logo-text">Kenfo<span className="gradient-text">.Levis</span></span>
        </a>

        {/* Server Status Indicator */}
        <div className="status-pill" title={serverStatus ? "API Backend Connectée" : "API Backend hors ligne"}>
          <span className={`status-dot ${serverStatus ? 'online' : 'offline'}`}></span>
          <span className="status-text">{serverStatus ? 'API Connectée' : 'Mode Hors-ligne'}</span>
        </div>

        <nav className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary nav-cta">Me Contacter</a>
        </nav>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
