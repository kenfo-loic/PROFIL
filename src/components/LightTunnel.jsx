import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Triangle } from 'ogl';
import './LightTunnel.css';

const LightTunnel = ({
  speed = 1.0,
  density = 1.0,
  className = ''
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const camera = new Camera(gl);
    camera.position.z = 1;

    const scene = new Transform();
    const geometry = new Triangle(gl);

    const vertexShader = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
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
        // EXACT mathematical center of the screen
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

        float r = length(st);
        float a = atan(st.y, st.x);

        // Number of radial fiber optic strands
        float numStrands = 38.0 * uDensity;
        float strandId = floor((a / TWO_PI + 0.5) * numStrands);
        float strandAngle = (strandId + 0.5) / numStrands * TWO_PI - PI;
        float angleDist = abs(sin(a - strandAngle));

        // Strand line thickness expanding across full screen
        float strandWidth = 0.015 * (1.0 + r * 1.8);
        float strandLine = smoothstep(strandWidth, 0.0, angleDist);
        float baseStrand = pow(strandLine, 1.5) * 0.35;

        // Traveling light pulses streaming from dead center outward
        float time = uTime * uSpeed * 1.35;
        float pulseTotal = 0.0;
        float hotCoreTotal = 0.0;

        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          float strandRand = hash(strandId * 17.13 + fi * 9.27);
          float speedMod = 0.75 + strandRand * 0.6;

          // Outward streaming pulse wave reaching past screen corners
          float pulsePos = fract((time * speedMod * 0.32) + strandRand);
          float targetR = pow(pulsePos, 1.6) * 2.2;

          float distToPulse = abs(r - targetR);
          float pulseLength = 0.12 + targetR * 0.28;

          float pulseGlow = smoothstep(pulseLength, 0.0, distToPulse);
          pulseGlow = pow(pulseGlow, 2.0);

          float strandPulse = pulseGlow * strandLine * (1.5 + targetR * 1.8);
          pulseTotal += strandPulse;

          // White-hot core inside pulse
          float hotCore = pow(smoothstep(pulseLength * 0.35, 0.0, distToPulse), 3.5) * strandLine;
          hotCoreTotal += hotCore;
        }

        // Color palette (Neon Violet / Purple / Magenta / White Glow)
        vec3 colorDark = vec3(0.015, 0.01, 0.04);
        vec3 colorGlow = vec3(0.70, 0.22, 0.98); // Vibrant purple (#b338fa)
        vec3 colorAccent = vec3(0.94, 0.35, 0.96); // Neon magenta (#f059f5)
        vec3 colorHot = vec3(1.0, 0.96, 1.0); // Brilliant white core

        vec3 finalColor = colorDark;

        // Base fiber lines across the whole screen
        finalColor += mix(colorGlow * 0.35, colorAccent * 0.55, min(1.0, r * 0.8)) * baseStrand;

        // Glowing pulse waves
        finalColor += colorGlow * (pulseTotal * 1.8);
        finalColor += colorAccent * (pulseTotal * 1.3);
        finalColor += colorHot * (hotCoreTotal * 2.8);

        // Core central singularity aura (pinned to exact screen center)
        float centerGlow = exp(-r * 7.0) * 1.1;
        finalColor += mix(colorGlow, colorHot, 0.5) * centerGlow;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [gl.canvas.width || window.innerWidth, gl.canvas.height || window.innerHeight] },
      uSpeed: { value: speed },
      uDensity: { value: density }
    };

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    const handleResize = () => {
      if (!container) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId;
    let startTime = performance.now();

    const render = (time) => {
      const elapsed = (time - startTime) * 0.001;
      uniforms.uTime.value = elapsed;

      renderer.render({ scene, camera });
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (gl.canvas && gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
    };
  }, [speed, density]);

  return (
    <div
      ref={containerRef}
      className={`light-tunnel-container ${className}`}
    />
  );
};

export default LightTunnel;
