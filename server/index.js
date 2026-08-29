import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Ensure messages.json exists
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}

// Portfolio Data
const portfolioData = {
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
    { name: "Création Graphique & Identité Visuelle", level: 95, category: "Design UI/UX", icon: "layers" },
    { name: "Prototypage & Wireframing Figma", level: 90, category: "Design UI/UX", icon: "palette" },
    { name: "Installation, Formatage & Config OS", level: 90, category: "Maintenance Info", icon: "box" },
    { name: "Design Systems & Ergonomie UI/UX", level: 89, category: "Design UI/UX", icon: "layers" },
    { name: "Diagnostic Matériel & Dépannage Hardware", level: 85, category: "Maintenance Info", icon: "cpu" },
    { name: "HTML5 / CSS3 / Tailwind", level: 80, category: "Frontend Web", icon: "palette" },
    { name: "Sécurité & Authentification", level: 80, category: "Backend & Données", icon: "sparkles" },
    { name: "Micro-interactions & Glassmorphism", level: 78, category: "Design UI/UX", icon: "sparkles" },
    { name: "TypeScript / JavaScript", level: 70, category: "Frontend Web", icon: "file-code" },
    { name: "Maintenance Préventive & Sécurisation PC", level: 70, category: "Maintenance Info", icon: "activity" },
    { name: "React & Next.js", level: 60, category: "Frontend Web", icon: "code" },
    { name: "REST API & Microservices", level: 60, category: "Backend & Données", icon: "plug" },
    { name: "Node.js & Express", level: 50, category: "Backend & Données", icon: "server" },
    { name: "Animations", level: 50, category: "Frontend Web", icon: "sparkles" },
    { name: "PostgreSQL, SQLite & Firebase", level: 40, category: "Backend & Données", icon: "database" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "NeoCommerce Dashboard",
      category: "Full-Stack Web App",
      description: "Plateforme analytics e-commerce en temps réel avec graphiques interactifs et animations fluides.",
      tags: ["React", "Node.js", "Motion", "Tailwind"],
      icon: "layout",
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
      icon: "cpu",
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
      icon: "globe",
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
      icon: "activity",
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
      icon: "layers",
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
};

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

app.get('/api/portfolio', (req, res) => {
  res.json(portfolioData);
});

app.get('/api/projects', (req, res) => {
  res.json(portfolioData.projects);
});

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs requis doivent être remplis (nom, email, message).' });
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject: subject || 'Nouveau message portfolio',
      message,
      date: new Date().toISOString()
    };

    const currentMessages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]');
    currentMessages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(currentMessages, null, 2));

    return res.status(201).json({
      success: true,
      message: 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais.',
      data: newMessage
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement du message.' });
  }
});

app.get('/api/messages', (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]');
    res.json({ total: messages.length, messages });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des messages.' });
  }
});

app.listen(PORT, () => {
  console.log(`[BACKEND] Serveur Express en cours d'exécution sur le port ${PORT}`);
});
