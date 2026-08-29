import { motion } from 'framer-motion';
import './ExperienceSection.css';

const ExperienceSection = ({ experience = [] }) => {
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">🚀 Parcours Professionnel</span>
          <h2 className="section-title">Expérience & Carrière</h2>
          <p className="section-subtitle">
            Mon évolution dans l'écosystème tech et mes rôles clés dans le développement web.
          </p>
        </div>

        <div className="timeline-container">
          {experience.map((item, idx) => (
            <motion.div
              key={idx}
              className="timeline-item"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-card">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-role">{item.role}</h3>
                <h4 className="timeline-company">{item.company}</h4>
                <p className="timeline-desc">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
