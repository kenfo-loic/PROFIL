import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activeSection, serverStatus, theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 868) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'Projets', href: '#projects' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Parcours', href: '#experience' },
    { name: 'Mon CV', href: '/cv.html' },
    { name: 'Contact', href: '#contact' },
  ];

  const isLight = theme === 'light';

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <a href="#hero" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </span>
            <span className="logo-text">Kenfo<span className="gradient-text">.Levis</span></span>
          </a>

          {/* Navigation Links */}
          <nav className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Navigation</span>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
                <span className="nav-arrow">→</span>
              </a>
            ))}
            <a href="#contact" className="btn btn-primary nav-cta" onClick={() => setMobileMenuOpen(false)}>
              Me Contacter
            </a>
          </nav>

          <div className="navbar-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isLight ? "Activer le mode sombre" : "Activer le mode clair"}
              title={isLight ? "Mode Sombre" : "Mode Clair"}
            >
              {isLight ? (
                <Moon className="theme-icon moon-icon" size={19} />
              ) : (
                <Sun className="theme-icon sun-icon" size={19} />
              )}
              <span className="theme-toggle-text">{isLight ? 'Sombre' : 'Clair'}</span>
            </button>

            <button 
              className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu de navigation"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-bar bar-1"></span>
              <span className="hamburger-bar bar-2"></span>
              <span className="hamburger-bar bar-3"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop for closing mobile dropdown on click outside */}
      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;


