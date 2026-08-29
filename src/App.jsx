import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BackgroundPixelSwap from './components/BackgroundPixelSwap';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Fetch portfolio data from Express backend API
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolioData(data);
          setServerOnline(true);
        } else {
          throw new Error('API return non-200');
        }
      } catch (error) {
        console.warn('Backend API connection failed, loading fallback data:', error);
        setServerOnline(false);
        // Fallback default data
        setPortfolioData({
          profile: {
            name: "Kenfo Tsentezo Loic Levis",
            title: "Développeur Full-Stack • Maintenancier Informatique & Designer UI/UX",
            tagline: "Je crée des applications web et mobiles complètes, assure la maintenance informatique et le dépannage de pointe, et crée des designs UI/UX d'exception.",
            location: "Disponible Remote",
            experienceYears: "3 ans",
            completedProjects: 2,
            satisfiedClients: 2,
            email: "kenfoloic3@gmail.com",
            whatsapp: "693412317",
            whatsappUrl: "https://wa.me/237693412317",
            linkedin: "https://www.linkedin.com/in/loic-kenfo-54b208427/?lipi=urn%3Ali%3Apage%3Ad_flagship3_job_home%3BFgp6JZ0gSEeX2mmecqBlQg%3D%3D",
            facebook: "https://web.facebook.com/photo/?fbid=1049877032854202&set=a.181573953017852"
          },
          skills: [
            { name: "Création Graphique & Identité Visuelle", level: 95, category: "Design UI/UX" },
            { name: "Prototypage & Wireframing Figma", level: 90, category: "Design UI/UX" },
            { name: "Installation, Formatage & Config OS", level: 90, category: "Maintenance Info" },
            { name: "Design Systems & Ergonomie UI/UX", level: 89, category: "Design UI/UX" },
            { name: "Diagnostic Matériel & Dépannage Hardware", level: 85, category: "Maintenance Info" },
            { name: "HTML5 / CSS3 / Tailwind", level: 80, category: "Frontend Web" },
            { name: "Sécurité & Authentification", level: 80, category: "Backend & Données" },
            { name: "Micro-interactions & Glassmorphism", level: 78, category: "Design UI/UX" },
            { name: "TypeScript / JavaScript", level: 70, category: "Frontend Web" },
            { name: "Maintenance Préventive & Sécurisation PC", level: 70, category: "Maintenance Info" },
            { name: "React & Next.js", level: 60, category: "Frontend Web" },
            { name: "REST API & Microservices", level: 60, category: "Backend & Données" },
            { name: "Node.js & Express", level: 50, category: "Backend & Données" },
            { name: "Animations", level: 50, category: "Frontend Web" },
            { name: "PostgreSQL, SQLite & Firebase", level: 40, category: "Backend & Données" }
          ],
          projects: [
            {
              id: "proj-1",
              title: "NeoCommerce Dashboard",
              category: "Full-Stack Web App",
              description: "Plateforme analytics e-commerce en temps réel avec graphiques interactifs et animations fluides.",
              tags: ["React", "Node.js", "Motion", "Tailwind"],
              badge: "Vedette",
              liveUrl: "https://example.com/demo1",
              githubUrl: "https://github.com/example/neocommerce",
              metrics: "+140% d'engagement client"
            },
            {
              id: "proj-2",
              title: "FlowMind AI Studio",
              category: "Intelligence Artificielle",
              description: "Interface SaaS permettant de générer et d'orchestrer des workflows IA complexes.",
              tags: ["Next.js", "Express", "OpenAI API", "Motion"],
              badge: "SaaS",
              liveUrl: "https://example.com/demo2",
              githubUrl: "https://github.com/example/flowmind",
              metrics: "50k+ requêtes/jour"
            },
            {
              id: "proj-3",
              title: "CryptoSphere Wallet UI",
              category: "Web3 & FinTech",
              description: "Interface sécurisée et ultra-réactive de gestion de portefeuille multi-chain.",
              tags: ["React", "Ethers.js", "Framer Motion"],
              badge: "Web3",
              liveUrl: "https://example.com/demo3",
              githubUrl: "https://github.com/example/cryptosphere",
              metrics: "Sécurité certifiée"
            },
            {
              id: "proj-4",
              title: "Pulse Social Cloud",
              category: "Réseau Social",
              description: "Application temps réel de messagerie et de partage d'événements à faible latence.",
              tags: ["Node.js", "Socket.io", "React", "MongoDB"],
              badge: "Realtime",
              liveUrl: "https://example.com/demo4",
              githubUrl: "https://github.com/example/pulse",
              metrics: "< 50ms latence"
            },
            {
              id: "proj-5",
              title: "Aura Design System",
              category: "Design & Open Source",
              description: "Bibliothèque de composants UI accessibles et animés pour candidatures React modernes.",
              tags: ["React", "Figma", "CSS Modules", "Storybook"],
              badge: "Design System",
              liveUrl: "https://example.com/demo5",
              githubUrl: "https://github.com/example/aura-ui",
              metrics: "2.4k étoiles GitHub"
            }
          ],
          experience: [
            {
              year: "2024 - Présent",
              role: "Développeur Full-Stack Web & Mobile",
              company: "Projets & Applications SaaS",
              description: "Conception d'applications web et mobiles complètes. Développement Frontend réactif avec React et architectures serveurs robustes avec Node.js, Express & PostgreSQL."
            },
            {
              year: "2022 - 2024",
              role: "Développeur Frontend & Intégration UI",
              company: "Studio Digital",
              description: "Traduction de maquettes Figma en interfaces web interactives, intégration HTML5/CSS3/Tailwind et développement de composants réactifs."
            },
            {
              year: "2020 - 2022",
              role: "Technicien Maintenance Informatique & Électronique",
              company: "Atelier & Formation AFROGEEK (2022)",
              description: "Formation en maintenance électronique à AFROGEEK (2022). Diagnostic de pannes matérielles et circuits, dépannage hardware/software, installation, formatage et configuration de systèmes d'exploitation Windows et Linux."
            },
            {
              year: "2018 - 2020",
              role: "Design UI/UX & Création Visuelle",
              company: "Débuts & Projets Graphiques",
              description: "Apprentissage du design d'interface, wireframing et prototypage sur Figma, création d'identités visuelles et recherche ergonomique utilisateur."
            }
          ]
        });
      }
    };

    fetchPortfolio();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'skills', 'experience', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-app">
      <BackgroundPixelSwap />
      <Navbar activeSection={activeSection} serverStatus={serverOnline} />
      <main>
        <Hero profile={portfolioData?.profile} />
        <ProjectsSection projects={portfolioData?.projects || []} />
        <SkillsSection skills={portfolioData?.skills || []} />
        <ExperienceSection experience={portfolioData?.experience || []} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
