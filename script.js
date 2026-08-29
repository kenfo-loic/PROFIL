/**
 * DecryptedText — Vanilla JS implementation
 */
class DecryptedText {
  constructor(element, options = {}) {
    this.el = element;
    this.originalText = options.text || element.textContent;
    this.speed = options.speed || 60;
    this.maxIterations = options.maxIterations || 15;
    this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*<>{}[]0123456789';
    this.animateOn = options.animateOn || 'view';
    this.revealDirection = options.revealDirection || 'start';
    this.clickMode = options.clickMode || 'toggle';
    this.isDecrypted = false;
    this.isAnimating = false;
    this.intervalId = null;
    this.repeatInterval = options.repeatInterval !== undefined ? options.repeatInterval : 6000;
    this.repeatTimeout = null;
    this._buildDOM();
    this._bindEvents();
  }

  _buildDOM() {
    this.el.innerHTML = '';
    this.el.classList.add('decrypted-text');
    this.chars = [];
    for (let i = 0; i < this.originalText.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char', 'encrypted');
      if (this.originalText[i] === ' ') {
        span.classList.add('space');
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = this._randomChar();
      }
      this.el.appendChild(span);
      this.chars.push({ el: span, target: this.originalText[i], isSpace: this.originalText[i] === ' ', revealed: false, iteration: 0 });
    }
  }

  _randomChar() { return this.characters[Math.floor(Math.random() * this.characters.length)]; }

  _getRevealOrder() {
    const indices = Array.from({ length: this.chars.length }, (_, i) => i);
    if (this.revealDirection === 'end') indices.reverse();
    else if (this.revealDirection === 'center') {
      const mid = Math.floor(indices.length / 2);
      const sorted = [];
      for (let o = 0; o <= mid; o++) {
        if (mid + o < indices.length) sorted.push(mid + o);
        if (mid - o >= 0 && o !== 0) sorted.push(mid - o);
      }
      return sorted;
    }
    return indices;
  }

  decrypt() {
    if (this.isAnimating) return;
    if (this.repeatTimeout) clearTimeout(this.repeatTimeout);

    this.isAnimating = true;
    const order = this._getRevealOrder();
    let currentRevealIndex = 0;
    this.chars.forEach(c => { 
      c.revealed = false; 
      c.iteration = 0; 
      if (!c.isSpace) { 
        c.el.textContent = this._randomChar(); 
        c.el.classList.remove('revealed'); 
        c.el.classList.add('encrypted'); 
      } 
    });

    this.intervalId = setInterval(() => {
      this.chars.forEach(c => { if (!c.revealed && !c.isSpace) c.el.textContent = this._randomChar(); });
      for (let i = 0; i <= currentRevealIndex && i < order.length; i++) {
        const idx = order[i]; const c = this.chars[idx];
        if (!c.revealed && !c.isSpace) { 
          c.iteration++; 
          if (c.iteration >= this.maxIterations) { 
            c.revealed = true; 
            c.el.textContent = c.target; 
            c.el.classList.remove('encrypted'); 
            c.el.classList.add('revealed'); 
          } 
        }
      }
      currentRevealIndex += 1;
      if (this.chars.every(c => c.revealed || c.isSpace) || currentRevealIndex > order.length + this.maxIterations) {
        clearInterval(this.intervalId);
        this.chars.forEach(c => { 
          if (!c.isSpace) { 
            c.el.textContent = c.target; 
            c.el.classList.remove('encrypted'); 
            c.el.classList.add('revealed'); 
          } 
          c.revealed = true; 
        });
        this.isAnimating = false; 
        this.isDecrypted = true;

        // Programmer la répétition automatique
        if (this.repeatInterval > 0) {
          this.repeatTimeout = setTimeout(() => {
            this.decrypt();
          }, this.repeatInterval);
        }
      }
    }, this.speed);
  }

  encrypt() {
    if (this.isAnimating) return;
    if (this.repeatTimeout) clearTimeout(this.repeatTimeout);
    this.isDecrypted = false;
    this.chars.forEach(c => { c.revealed = false; if (!c.isSpace) { c.el.textContent = this._randomChar(); c.el.classList.remove('revealed'); c.el.classList.add('encrypted'); } });
  }

  _bindEvents() {
    if (this.animateOn === 'hover') {
      this.el.addEventListener('mouseenter', () => this.decrypt());
      this.el.addEventListener('mouseleave', () => this.encrypt());
    } else if (this.animateOn === 'click') {
      this.el.addEventListener('click', () => { this.isDecrypted ? this.encrypt() : this.decrypt(); });
    } else if (this.animateOn === 'view') {
      const obs = new IntersectionObserver(entries => { 
        entries.forEach(e => { 
          if (e.isIntersecting) { 
            setTimeout(() => this.decrypt(), 300); 
            obs.unobserve(this.el); 
          } 
        }); 
      }, { threshold: 0.5 });
      obs.observe(this.el);
    }
  }
}


/**
 * ElectricBorder — Vanilla JS Canvas implementation
 * Draws animated electric/lightning border around elements on scroll
 */
class ElectricBorder {
  constructor(element, options = {}) {
    this.container = element;
    this.color = options.color || '#6366f1';
    this.speed = options.speed || 1;
    this.chaos = options.chaos || 0.12;
    this.borderRadius = options.borderRadius || 20;
    this.active = false;
    this.animationId = null;
    this.time = 0;
    this.lastFrameTime = 0;
    this.opacity = 0;
    this.targetOpacity = 0;

    this._setup();
    this._observe();
  }

  _setup() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'visible';
    this.container.style.isolation = 'isolate';

    // Canvas wrapper
    this.canvasWrap = document.createElement('div');
    this.canvasWrap.className = 'eb-canvas-container';
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'eb-canvas';
    this.canvasWrap.appendChild(this.canvas);

    // Glow layers
    this.layers = document.createElement('div');
    this.layers.className = 'eb-layers';
    this.layers.style.setProperty('--electric-border-color', this.color);
    this.layers.innerHTML = `
      <div class="eb-glow-1"></div>
      <div class="eb-glow-2"></div>
      <div class="eb-background-glow"></div>
    `;

    this.container.insertBefore(this.layers, this.container.firstChild);
    this.container.insertBefore(this.canvasWrap, this.container.firstChild);

    this.ctx = this.canvas.getContext('2d');

    // Initially hidden
    this.canvasWrap.style.opacity = '0';
    this.layers.style.opacity = '0';
    this.canvasWrap.style.transition = 'opacity 0.6s ease';
    this.layers.style.transition = 'opacity 0.6s ease';
  }

  _observe() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.targetOpacity = 1;
          this.canvasWrap.style.opacity = '1';
          this.layers.style.opacity = '1';
          if (!this.active) { this.active = true; this.lastFrameTime = performance.now(); this._animate(this.lastFrameTime); }
        } else {
          this.targetOpacity = 0;
          this.canvasWrap.style.opacity = '0';
          this.layers.style.opacity = '0';
        }
      });
    }, { threshold: 0.15 });
    observer.observe(this.container);

    const resizeObs = new ResizeObserver(() => this._updateSize());
    resizeObs.observe(this.container);
    this._updateSize();
  }

  _updateSize() {
    const rect = this.container.getBoundingClientRect();
    const offset = 60;
    const w = rect.width + offset * 2;
    const h = rect.height + offset * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.dpr = dpr;
    this.cw = w;
    this.ch = h;
    this.offset = offset;
  }

  // Noise helpers
  _random(x) { return (Math.sin(x * 12.9898) * 43758.5453) % 1; }

  _noise2D(x, y) {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const a = this._random(i + j * 57), b = this._random(i + 1 + j * 57);
    const c = this._random(i + (j + 1) * 57), d = this._random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3.0 - 2.0 * fx), uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  _octavedNoise(x, octaves, lacunarity, gain, amp, freq, time, seed, flatness) {
    let y = 0, amplitude = amp, frequency = freq;
    for (let i = 0; i < octaves; i++) {
      let oa = amplitude;
      if (i === 0) oa *= flatness;
      y += oa * this._noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return y;
  }

  _getCornerPoint(cx, cy, r, startAngle, arcLen, progress) {
    const angle = startAngle + progress * arcLen;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  _getRoundedRectPoint(t, left, top, w, h, r) {
    const sw = w - 2 * r, sh = h - 2 * r;
    const ca = (Math.PI * r) / 2;
    const totalP = 2 * sw + 2 * sh + 4 * ca;
    const d = t * totalP;
    let acc = 0;

    if (d <= acc + sw) { return { x: left + r + ((d - acc) / sw) * sw, y: top }; } acc += sw;
    if (d <= acc + ca) { return this._getCornerPoint(left + w - r, top + r, r, -Math.PI / 2, Math.PI / 2, (d - acc) / ca); } acc += ca;
    if (d <= acc + sh) { return { x: left + w, y: top + r + ((d - acc) / sh) * sh }; } acc += sh;
    if (d <= acc + ca) { return this._getCornerPoint(left + w - r, top + h - r, r, 0, Math.PI / 2, (d - acc) / ca); } acc += ca;
    if (d <= acc + sw) { return { x: left + w - r - ((d - acc) / sw) * sw, y: top + h }; } acc += sw;
    if (d <= acc + ca) { return this._getCornerPoint(left + r, top + h - r, r, Math.PI / 2, Math.PI / 2, (d - acc) / ca); } acc += ca;
    if (d <= acc + sh) { return { x: left, y: top + h - r - ((d - acc) / sh) * sh }; } acc += sh;
    return this._getCornerPoint(left + r, top + r, r, Math.PI, Math.PI / 2, (d - acc) / ca);
  }

  _animate(currentTime) {
    if (!this.active) return;

    const dt = (currentTime - this.lastFrameTime) / 1000;
    this.time += dt * this.speed;
    this.lastFrameTime = currentTime;

    const ctx = this.ctx;
    const dpr = this.dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const scale = 60;
    const left = this.offset;
    const top = this.offset;
    const bw = this.cw - 2 * this.offset;
    const bh = this.ch - 2 * this.offset;
    const maxR = Math.min(bw, bh) / 2;
    const r = Math.min(this.borderRadius, maxR);
    const approxPerim = 2 * (bw + bh) + 2 * Math.PI * r;
    const samples = Math.floor(approxPerim / 2);

    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const prog = i / samples;
      const pt = this._getRoundedRectPoint(prog, left, top, bw, bh, r);
      const xN = this._octavedNoise(prog * 8, 10, 1.6, 0.7, this.chaos, 10, this.time, 0, 0);
      const yN = this._octavedNoise(prog * 8, 10, 1.6, 0.7, this.chaos, 10, this.time, 1, 0);
      const px = pt.x + xN * scale;
      const py = pt.y + yN * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    this.animationId = requestAnimationFrame(t => this._animate(t));
  }
}


/* ═══════════════════════════════════════════════════════
   🔄 SMOOTH SCROLL SPY FOR SINGLE-PAGE NAVIGATION
   ═══════════════════════════════════════════════════════ */
class ScrollSpy {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.dropdown-menu a[href^="#"]');
    this._bind();
  }

  _bind() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3 });

    this.sections.forEach(s => observer.observe(s));
  }
}

/**
 * LightTunnel — Vanilla JS WebGL Radial Fiber-Optic Tunnel
 */
class LightTunnel {
  constructor(container, options = {}) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else if (container) {
      this.container = container;
    } else {
      this.container = document.getElementById('light-tunnel-bg');
    }

    if (!this.container) return;

    this.options = {
      speed: 0.9,
      density: 1.4,
      radius: 0.45,
      colors: ['#6366f1', '#a855f7', '#22d3ee', '#61dca3'],
      ...options
    };

    this._initWebGL();
  }

  _hexToVec3(hex) {
    const s = hex.replace('#', '');
    const num = parseInt(s, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    ];
  }

  _initWebGL() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);

    const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!gl) return;
    this.gl = gl;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uSpeed;
      uniform float uDensity;

      #define PI 3.14159265359
      #define TWO_PI 6.28318530718

      float hash(float n) {
        return fract(sin(n) * 43758.5453123);
      }

      void main() {
        // EXACT mathematical center of the computer screen
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

        float r = length(st);
        float a = atan(st.y, st.x);

        float numStrands = 38.0 * uDensity;
        float strandId = floor((a / TWO_PI + 0.5) * numStrands);
        float strandAngle = (strandId + 0.5) / numStrands * TWO_PI - PI;
        float angleDist = abs(sin(a - strandAngle));

        float strandWidth = 0.015 * (1.0 + r * 1.8);
        float strandLine = smoothstep(strandWidth, 0.0, angleDist);
        float baseStrand = pow(strandLine, 1.5) * 0.35;

        float time = uTime * uSpeed * 1.35;
        float pulseTotal = 0.0;
        float hotCoreTotal = 0.0;

        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          float strandRand = hash(strandId * 17.13 + fi * 9.27);
          float speedMod = 0.75 + strandRand * 0.6;

          float pulsePos = fract((time * speedMod * 0.32) + strandRand);
          float targetR = pow(pulsePos, 1.6) * 2.2;

          float distToPulse = abs(r - targetR);
          float pulseLength = 0.12 + targetR * 0.28;

          float pulseGlow = smoothstep(pulseLength, 0.0, distToPulse);
          pulseGlow = pow(pulseGlow, 2.0);

          float strandPulse = pulseGlow * strandLine * (1.5 + targetR * 1.8);
          pulseTotal += strandPulse;

          float hotCore = pow(smoothstep(pulseLength * 0.35, 0.0, distToPulse), 3.5) * strandLine;
          hotCoreTotal += hotCore;
        }

        vec3 colorDark = vec3(0.015, 0.01, 0.04);
        vec3 colorGlow = vec3(0.70, 0.22, 0.98);
        vec3 colorAccent = vec3(0.94, 0.35, 0.96);
        vec3 colorHot = vec3(1.0, 0.96, 1.0);

        vec3 finalColor = colorDark;

        finalColor += mix(colorGlow * 0.35, colorAccent * 0.55, min(1.0, r * 0.8)) * baseStrand;
        finalColor += colorGlow * (pulseTotal * 1.8);
        finalColor += colorAccent * (pulseTotal * 1.3);
        finalColor += colorHot * (hotCoreTotal * 2.8);

        float centerGlow = exp(-r * 7.0) * 1.1;
        finalColor += mix(colorGlow, colorHot, 0.5) * centerGlow;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uSpeedLoc = gl.getUniformLocation(program, 'uSpeed');
    const uDensityLoc = gl.getUniformLocation(program, 'uDensity');

    gl.uniform1f(uSpeedLoc, this.options.speed || 1.0);
    gl.uniform1f(uDensityLoc, this.options.density || 1.0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.uniform2f(uResLoc, this.canvas.width, this.canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();
    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      gl.uniform1f(uTimeLoc, elapsed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    requestAnimationFrame(render);
  }
}

/* ═══════════════════════════════════════════════════════
   🚀 AUTO INIT ON DOM READY
   ═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // LightTunnel Fiber-Optic Warp Background
  new LightTunnel('#light-tunnel-bg');

  // DecryptedText
  document.querySelectorAll('[data-decrypt]').forEach(el => {
    new DecryptedText(el, {
      text: el.getAttribute('data-decrypt-text') || el.textContent,
      speed: parseInt(el.getAttribute('data-decrypt-speed')) || 60,
      maxIterations: parseInt(el.getAttribute('data-decrypt-iterations')) || 15,
      characters: el.getAttribute('data-decrypt-chars') || undefined,
      animateOn: el.getAttribute('data-decrypt-on') || 'view',
      revealDirection: el.getAttribute('data-decrypt-direction') || 'start',
      repeatInterval: parseInt(el.getAttribute('data-decrypt-interval')) || 6000,
    });
  });

  // ElectricBorder
  document.querySelectorAll('[data-electric]').forEach(el => {
    new ElectricBorder(el, {
      color: el.getAttribute('data-electric-color') || '#6366f1',
      speed: parseFloat(el.getAttribute('data-electric-speed')) || 1,
      chaos: parseFloat(el.getAttribute('data-electric-chaos')) || 0.12,
      borderRadius: parseInt(el.getAttribute('data-electric-radius')) || 20,
    });
  });

  // Dropdown menu toggle
  document.querySelectorAll('.menu-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.closest('.menu-container').classList.toggle('open');
    });
  });
  document.addEventListener('click', e => {
    document.querySelectorAll('.menu-container.open').forEach(mc => {
      if (!mc.contains(e.target)) mc.classList.remove('open');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close dropdown
        document.querySelectorAll('.menu-container.open').forEach(mc => mc.classList.remove('open'));
      }
    });
  });

  // ScrollSpy
  new ScrollSpy();

  // Section fade-in on scroll
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-section').forEach(s => sectionObs.observe(s));
});

// Global Email Click Handler with instant email opening
function handleEmailClick(event, email) {
  if (!email) email = 'kenfoloic3@gmail.com';
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email);
  }
  // Show toast notification
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#10b981;color:#ffffff;padding:0.85rem 1.6rem;border-radius:12px;font-weight:700;font-size:0.92rem;box-shadow:0 10px 30px rgba(16,185,129,0.4);transform:translateY(100px);opacity:0;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);z-index:99999;pointer-events:none;font-family:sans-serif;';
    document.body.appendChild(toast);
  }
  toast.textContent = "Email " + email + " copié & boîte mail ouverte !";
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3000);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    if (event) event.preventDefault();
    window.location.href = 'mailto:' + email + '?subject=Prise%20de%20Contact%20Professionnelle';
  }
}
