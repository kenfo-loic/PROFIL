import { motion } from 'framer-motion';
import './SkillsSection.css';

const SkillsSection = ({ skills = [] }) => {
  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">Expertise Technique</span>
          <h2 className="section-title">Compétences & Technologies</h2>
          <p className="section-subtitle">
            Un ensemble d'outils et de langages maîtrisés pour concevoir des produits web fiables, rapides et évolutifs.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="skill-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="skill-card-header">
                <span className="skill-category">{skill.category}</span>
              </div>

              <div className="skill-info">
                <h4 className="skill-name">{skill.name}</h4>
                <span className="skill-percent">{skill.level}%</span>
              </div>

              <div className="skill-bar-bg">
                <motion.div
                  className="skill-bar-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.08 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
