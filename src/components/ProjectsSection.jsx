import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedList from './AnimatedList';
import './ProjectsSection.css';

const ProjectsSection = ({ projects = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Format list items for AnimatedList component
  const listItems = useMemo(() => {
    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.category,
      badge: p.badge || "Projet",
      raw: p
    }));
  }, [projects]);

  const activeProject = projects[selectedIndex] || projects[0];

  const handleSelect = (item, index) => {
    setSelectedIndex(index);
  };

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">Portfolio Dynamique</span>
          <h2 className="section-title">Mes Réalisations & Projets</h2>
        </div>

        <div className="projects-grid">
          {/* Left Column: AnimatedList Component */}
          <div className="animated-list-wrapper">
            <div className="list-title-bar">
              <span className="list-title-icon">◆</span>
              <span>Projets Récents ({projects.length})</span>
            </div>
            <AnimatedList
              items={listItems}
              onItemSelect={handleSelect}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
              initialSelectedIndex={0}
              className="custom-portfolio-list"
            />
          </div>

          {/* Right Column: Selected Project Detail Card */}
          <div className="project-detail-wrapper">
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div
                  key={activeProject.id}
                  className="project-card glass-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="project-badge-bar">
                    <span className="project-category">{activeProject.category}</span>
                    {activeProject.badge && (
                      <span className="project-badge">{activeProject.badge}</span>
                    )}
                  </div>

                  <div className="project-header-main">
                    <h3 className="project-title-large">{activeProject.title}</h3>
                  </div>

                  <p className="project-description-full">
                    {activeProject.description}
                  </p>

                  <div className="project-metrics">
                    <span className="metric-icon">✓</span>
                    <span>Impact : <strong>{activeProject.metrics}</strong></span>
                  </div>

                  <div className="project-tech-stack">
                    <span className="tech-label">Technologies utilisées :</span>
                    <div className="tech-tags">
                      {activeProject.tags?.map((tag, idx) => (
                        <span key={idx} className="tech-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
