import { motion } from 'framer-motion';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div 
          className="contact-card-centered glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="section-header text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">Discutons Ensemble</span>
            <h2 className="section-title">Avez-vous un projet en tête ?</h2>
            <p className="section-subtitle">
              N'hésitez pas à me contacter directement via mes canaux officiels pour une opportunité de collaboration, une mission freelance ou une simple question technique.
            </p>
          </div>

          <div className="contact-direct-grid">
            <a 
              href="mailto:kenfoloic3@gmail.com" 
              className="contact-item-link"
              title="Envoyer un email directement"
            >
              <div className="contact-icon contact-icon-email">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </div>
              <div className="contact-text-content">
                <span className="contact-label">Email Direct</span>
                <p className="contact-value">kenfoloic3@gmail.com</p>
              </div>
              <span className="contact-action-badge">Écrire ↗</span>
            </a>

            <a 
              href="https://wa.me/237693412317?text=Bonjour%20Loic,%20je%20vous%20contacte%20depuis%20votre%20portfolio" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-item-link"
              title="Discuter directement sur WhatsApp"
            >
              <div className="contact-icon contact-icon-whatsapp">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><path d="M8 12.5a5 5 0 0 0 4 4c.6 0 1-.2 1.3-.5l1.2-1.2a.8.8 0 0 0 0-1.1l-1.8-1.8a.8.8 0 0 0-1.1 0l-.6.6c-.3-.2-.8-.5-1.3-1-.5-.5-.8-1-1-1.3l.6-.6a.8.8 0 0 0 0-1.1L8.5 7.7a.8.8 0 0 0-1.1 0l-1.2 1.2c-.3.3-.5.7-.5 1.3a5 5 0 0 0 2.3 2.3Z"></path></svg>
              </div>
              <div className="contact-text-content">
                <span className="contact-label">WhatsApp Direct</span>
                <p className="contact-value">+237 693 41 23 17</p>
              </div>
              <span className="contact-action-badge whatsapp-badge">Chatter ↗</span>
            </a>

            <a 
              href="https://www.linkedin.com/in/loic-kenfo-54b208427/?lipi=urn%3Ali%3Apage%3Ad_flagship3_job_home%3BFgp6JZ0gSEeX2mmecqBlQg%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-item-link"
              title="Consulter mon profil LinkedIn et m'envoyer un message"
            >
              <div className="contact-icon contact-icon-linkedin">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <div className="contact-text-content">
                <span className="contact-label">LinkedIn</span>
                <p className="contact-value">Loic Kenfo</p>
              </div>
              <span className="contact-action-badge linkedin-badge">Profil ↗</span>
            </a>

            <a 
              href="https://github.com/account" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-item-link"
              title="Consulter mon compte GitHub"
            >
              <div className="contact-icon" style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.38)', color: '#c084fc' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </div>
              <div className="contact-text-content">
                <span className="contact-label">GitHub</span>
                <p className="contact-value">account</p>
              </div>
              <span className="contact-action-badge" style={{ background: 'rgba(168,85,247,0.2)', color: '#d8b4fe' }}>Visiter ↗</span>
            </a>

            <a 
              href="https://web.facebook.com/photo/?fbid=1049877032854202&set=a.181573953017852" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-item-link"
              title="Consulter mon compte Facebook"
            >
              <div className="contact-icon contact-icon-facebook">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </div>
              <div className="contact-text-content">
                <span className="contact-label">Facebook</span>
                <p className="contact-value">Loic Kenfo</p>
              </div>
              <span className="contact-action-badge facebook-badge">Visiter ↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
