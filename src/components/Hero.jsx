import { motion } from 'framer-motion';
import DecryptedText from './DecryptedText';
import './Hero.css';

const Hero = ({ profile }) => {
  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-identity-box" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="react-photo-frame">
              <div className="photo-glow-pulse"></div>
              <div className="photo-glow-pulse-2"></div>
              <div className="photo-orbit"></div>
              <div className="photo-placeholder-react">
                <img src="/profile.jpg" alt={profile?.name || "Kenfo Tsentezo Loic Levis"} />
              </div>
            </div>
            <div>
              <div className="hero-badge" style={{ marginBottom: '0.4rem' }}>
                <span className="badge-pulse"></span>
                <span>Full-Stack • Maintenancier • Designer</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                <DecryptedText 
                  text={profile?.name || "KENFO TSENTEZO LOIC LEVIS"} 
                  repeatInterval={5000} 
                  speed={45} 
                />
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '0.2rem 0 0 0' }}>
                <DecryptedText 
                  text="Développeur Full-Stack • Maintenancier & Designer" 
                  repeatInterval={5000} 
                  speed={40} 
                />
              </p>
            </div>
          </div>

          <h1 className="hero-title">
            Créateur d'expériences <br />
            <span className="gradient-text">Full-Stack, Maintenancier &amp; Designer</span>
          </h1>

          <p className="hero-description">
            {profile?.tagline || "Je crée des applications web et mobiles complètes, assure la maintenance informatique et le dépannage de pointe, et crée des designs UI/UX d'exception."}
          </p>

          <div className="hero-actions">
            <a href="/cv.html" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
              <span>Consulter mon CV</span>
            </a>
            <a href="#projects" className="btn btn-secondary">
              <span>Voir mes projets</span>
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Discuter d'un projet</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{profile?.experienceYears || "3 ans"}</span>
              <span className="stat-label">D'expérience</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{profile?.completedProjects || "2"}</span>
              <span className="stat-label">Projets Réalisés</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{profile?.satisfiedClients || "2"}</span>
              <span className="stat-label">Clients Satisfaits</span>
            </div>
          </div>
        </motion.div>

        {/* Visual Glow Graphic */}
        <motion.div 
          className="hero-graphic"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="code-card glass-card">
            <div className="code-header">
              <div className="code-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="code-filename">ExpertProfile.ts</span>
            </div>
            <pre className="code-body">
              <code>
                <span className="token-keyword">const</span> expert = &#123;<br/>
                &nbsp;&nbsp;name: <span className="token-string">"{profile?.name || 'Kenfo Tsentezo Loic Levis'}"</span>,<br/>
                &nbsp;&nbsp;roles: [<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-string">"Développeur Full-Stack"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-string">"Maintenancier Informatique"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-string">"Designer UI/UX"</span><br/>
                &nbsp;&nbsp;],<br/>
                &nbsp;&nbsp;expertise: [<span className="token-string">"React / Node"</span>, <span className="token-string">"Hardware &amp; Réseau"</span>, <span className="token-string">"Figma"</span>],<br/>
                &nbsp;&nbsp;passion: <span className="token-string">"Développement, Maintenance &amp; Design"</span><br/>
                &#125;;
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
