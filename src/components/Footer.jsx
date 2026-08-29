import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-left">
          <span className="logo-text">Kenfo<span className="gradient-text">.Levis</span></span>
          <p className="footer-tagline">Développement Web & Interfaces Animées avec React et Node.js.</p>
        </div>

        <div className="footer-right">
          <div className="footer-socials" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <a href="mailto:kenfoloic3@gmail.com" title="Email direct" style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            </a>
            <a href="https://wa.me/237693412317" target="_blank" rel="noopener noreferrer" title="WhatsApp direct" style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><path d="M8 12.5a5 5 0 0 0 4 4c.6 0 1-.2 1.3-.5l1.2-1.2a.8.8 0 0 0 0-1.1l-1.8-1.8a.8.8 0 0 0-1.1 0l-.6.6c-.3-.2-.8-.5-1.3-1-.5-.5-.8-1-1-1.3l.6-.6a.8.8 0 0 0 0-1.1L8.5 7.7a.8.8 0 0 0-1.1 0l-1.2 1.2c-.3.3-.5.7-.5 1.3a5 5 0 0 0 2.3 2.3Z"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/loic-kenfo-54b208427/?lipi=urn%3Ali%3Apage%3Ad_flagship3_job_home%3BFgp6JZ0gSEeX2mmecqBlQg%3D%3D" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://web.facebook.com/photo/?fbid=1049877032854202&set=a.181573953017852" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
          <p>© {new Date().getFullYear()} Kenfo Tsentezo Loic Levis. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="#hero">Accueil</a>
            <a href="#projects">Projets</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
