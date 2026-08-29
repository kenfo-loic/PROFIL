import { useEffect, useRef } from 'react';
import './CyberBackground.css';

const CyberBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle settings
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 45 : 90;
    const connectionDistance = isMobile ? 100 : 140;
    const mouseRadius = isMobile ? 100 : 160;

    const mouse = {
      x: null,
      y: null,
      targetX: null,
      targetY: null,
    };

    // Color palette matching theme
    const colors = [
      { r: 99, g: 102, b: 241 },   // Indigo
      { r: 168, g: 85, b: 247 },  // Purple / Violet
      { r: 56, g: 189, b: 248 },   // Cyan
      { r: 52, g: 211, b: 153 },   // Emerald
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2.2 + 1.2;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        // Natural drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce from edges
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;

        // Pulsing glow
        this.pulseAngle += this.pulseSpeed;
        this.currentAlpha = this.alpha + Math.sin(this.pulseAngle) * 0.25;

        // Interactive mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (1 - distance / mouseRadius) * 2.5;
            const dirX = dx / distance;
            const dirY = dy / distance;
            this.x -= dirX * force;
            this.y -= dirY * force;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Shooting stars / laser streaks
    class LaserStreak {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height * 0.6);
        this.length = Math.random() * 120 + 80;
        this.speed = Math.random() * 6 + 4;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 degrees
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.4 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 80;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.active = Math.random() > 0.6; // random spawn
      }

      update() {
        if (!this.active) {
          if (Math.random() < 0.005) {
            this.reset();
            this.active = true;
          }
          return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life++;

        if (this.life < 20) {
          this.alpha = (this.life / 20) * this.maxAlpha;
        } else if (this.life > this.maxLife - 20) {
          this.alpha = ((this.maxLife - this.life) / 20) * this.maxAlpha;
        }

        if (this.life >= this.maxLife || this.x > width + 100 || this.y > height + 100) {
          this.active = false;
        }
      }

      draw() {
        if (!this.active || this.alpha <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());
    const lasers = Array.from({ length: 4 }, () => new LaserStreak());

    // Connect particles with neural network lines
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            const strokeGradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            strokeGradient.addColorStop(
              0,
              `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${alpha})`
            );
            strokeGradient.addColorStop(
              1,
              `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${alpha})`
            );

            ctx.strokeStyle = strokeGradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      }

      // Draw Laser Streaks
      lasers.forEach((laser) => {
        laser.update();
        laser.draw();
      });

      // Update & Draw Particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw Network Lines
      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Event Handlers
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="cyber-bg-container">
      {/* Dynamic Cosmic Aurora Glow Orbs */}
      <div className="cyber-aurora-orb aurora-1"></div>
      <div className="cyber-aurora-orb aurora-2"></div>
      <div className="cyber-aurora-orb aurora-3"></div>

      {/* Cyber Grid Mask Overlay */}
      <div className="cyber-grid-overlay"></div>

      {/* Neural Constellation Canvas */}
      <canvas ref={canvasRef} className="cyber-bg-canvas" />
    </div>
  );
};

export default CyberBackground;
