import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HyperSpeedPresets } from './HyperSpeedPresets';
import './Hyperspeed.css';

const Hyperspeed = ({
  effectOptions = HyperSpeedPresets.neonWaves,
  className = ''
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = { ...HyperSpeedPresets.neonWaves, ...effectOptions };

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(options.colors.background || 0x030712);
    scene.fog = new THREE.Fog(
      options.colors.background || 0x030712,
      options.length * 0.1,
      options.length * 0.95
    );

    const camera = new THREE.PerspectiveCamera(
      options.fov || 90,
      container.clientWidth / container.clientHeight,
      0.1,
      options.length
    );
    camera.position.set(0, 7, -10);
    camera.lookAt(0, 3, options.length * 0.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- Shaders for Distortion ---
    const distortionUniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 1.0 },
      uDistortionFreq: { value: new THREE.Vector2(2.0, 1.5) },
      uDistortionAmp: { value: new THREE.Vector2(20.0, 10.0) }
    };

    const distortionVertexSnippet = `
      uniform float uTime;
      uniform vec2 uDistortionFreq;
      uniform vec2 uDistortionAmp;

      vec3 getDistortion(float z) {
        float progress = z * 0.005;
        float x = sin(progress * uDistortionFreq.x + uTime * 0.8) * uDistortionAmp.x;
        float y = cos(progress * uDistortionFreq.y + uTime * 0.5) * uDistortionAmp.y;
        return vec3(x, y, 0.0);
      }
    `;

    // --- Road Surface ---
    const roadWidth = options.roadWidth * 2 + options.islandWidth;
    const roadGeometry = new THREE.PlaneGeometry(roadWidth, options.length, 30, 200);
    roadGeometry.rotateX(-Math.PI / 2);
    roadGeometry.translate(0, 0, options.length / 2);

    const roadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...distortionUniforms,
        uRoadColor: { value: new THREE.Color(options.colors.roadColor) },
        uIslandColor: { value: new THREE.Color(options.colors.islandColor) },
        uShoulderColor: { value: new THREE.Color(options.colors.shoulderLines) },
        uBrokenColor: { value: new THREE.Color(options.colors.brokenLines) },
        uRoadWidth: { value: roadWidth },
        uHalfRoad: { value: options.roadWidth },
        uIslandWidth: { value: options.islandWidth },
        uFogColor: { value: scene.fog.color },
        uFogNear: { value: scene.fog.near },
        uFogFar: { value: scene.fog.far }
      },
      vertexShader: `
        ${distortionVertexSnippet}
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          vUv = uv;
          vec3 transformed = position;
          vec3 distortion = getDistortion(transformed.z);
          transformed.x += distortion.x;
          transformed.y += distortion.y;

          vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
          vWorldPos = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uRoadColor;
        uniform vec3 uIslandColor;
        uniform vec3 uShoulderColor;
        uniform vec3 uBrokenColor;
        uniform float uRoadWidth;
        uniform float uHalfRoad;
        uniform float uIslandWidth;
        uniform vec3 uFogColor;
        uniform float uFogNear;
        uniform float uFogFar;

        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          float x = (vUv.x - 0.5) * uRoadWidth;
          vec3 color = uRoadColor;

          // Island in center
          if (abs(x) < uIslandWidth * 0.5) {
            color = uIslandColor;
          }

          // Shoulder stripes
          float leftShoulder = -uIslandWidth * 0.5 - uHalfRoad * 0.95;
          float rightShoulder = uIslandWidth * 0.5 + uHalfRoad * 0.95;
          if (abs(x - leftShoulder) < 0.15 || abs(x - rightShoulder) < 0.15) {
            color = uShoulderColor * 2.5;
          }

          // Fog
          float depth = length(vWorldPos - cameraPosition);
          float fogFactor = smoothstep(uFogNear, uFogFar, depth);
          color = mix(color, uFogColor, fogFactor);

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    scene.add(roadMesh);

    // --- Car Lights Streaks ---
    const createCarLights = (isLeft) => {
      const count = options.lightPairsPerRoadWay || 50;
      const geometry = new THREE.InstancedBufferGeometry();

      // Base line strip
      const lineLength = 25;
      const baseGeo = new THREE.CylinderGeometry(0.08, 0.08, lineLength, 6, 1, true);
      baseGeo.rotateX(Math.PI / 2);
      geometry.index = baseGeo.index;
      geometry.attributes = baseGeo.attributes;

      const aOffsets = [];
      const aColors = [];
      const aSpeeds = [];

      const colorPalette = isLeft ? options.colors.leftCars : options.colors.rightCars;
      const speedRange = isLeft ? options.movingAwaySpeed : options.movingCloserSpeed;

      for (let i = 0; i < count; i++) {
        const lane = (Math.random() * (options.lanesPerRoad - 0.2)) + 0.1;
        const laneWidth = options.roadWidth / options.lanesPerRoad;
        let x = (options.islandWidth * 0.5) + (lane * laneWidth);
        if (isLeft) x = -x;

        const y = Math.random() * 0.6 + 0.3;
        const z = Math.random() * options.length;

        aOffsets.push(x, y, z);

        const hex = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const c = new THREE.Color(hex);
        aColors.push(c.r, c.g, c.b);

        const speed = THREE.MathUtils.randFloat(speedRange[0], speedRange[1]);
        aSpeeds.push(speed);
      }

      geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffsets), 3));
      geometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColors), 3));
      geometry.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(new Float32Array(aSpeeds), 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          ...distortionUniforms,
          uLength: { value: options.length },
          uFogColor: { value: scene.fog.color },
          uFogNear: { value: scene.fog.near },
          uFogFar: { value: scene.fog.far }
        },
        vertexShader: `
          ${distortionVertexSnippet}
          attribute vec3 aOffset;
          attribute vec3 aColor;
          attribute float aSpeed;

          uniform float uLength;
          varying vec3 vColor;
          varying vec3 vWorldPos;

          void main() {
            vColor = aColor;
            vec3 pos = position;

            // Animate along Z
            float z = mod(aOffset.z + uTime * aSpeed * uSpeed, uLength);
            pos.z += z;
            pos.x += aOffset.x;
            pos.y += aOffset.y;

            vec3 distortion = getDistortion(pos.z);
            pos.x += distortion.x;
            pos.y += distortion.y;

            vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
            vWorldPos = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying vec3 vWorldPos;
          uniform vec3 uFogColor;
          uniform float uFogNear;
          uniform float uFogFar;

          void main() {
            vec3 color = vColor * 2.2;
            float depth = length(vWorldPos - cameraPosition);
            float fogFactor = smoothstep(uFogNear, uFogFar, depth);
            color = mix(color, uFogColor, fogFactor);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      return new THREE.Mesh(geometry, material);
    };

    const leftLights = createCarLights(true);
    const rightLights = createCarLights(false);
    scene.add(leftLights);
    scene.add(rightLights);

    // --- Side Light Sticks ---
    const createLightSticks = () => {
      const count = options.totalSideLightSticks || 40;
      const geometry = new THREE.InstancedBufferGeometry();
      const baseGeo = new THREE.BoxGeometry(0.15, 2.5, 0.15);
      geometry.index = baseGeo.index;
      geometry.attributes = baseGeo.attributes;

      const aOffsets = [];
      const stickColor = new THREE.Color(options.colors.sticks || 0x6366f1);

      for (let i = 0; i < count; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        const x = side * (options.roadWidth + options.islandWidth * 0.5 + 0.8);
        const y = 1.25;
        const z = (i / count) * options.length;
        aOffsets.push(x, y, z);
      }

      geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffsets), 3));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          ...distortionUniforms,
          uLength: { value: options.length },
          uColor: { value: stickColor },
          uFogColor: { value: scene.fog.color },
          uFogNear: { value: scene.fog.near },
          uFogFar: { value: scene.fog.far }
        },
        vertexShader: `
          ${distortionVertexSnippet}
          attribute vec3 aOffset;
          uniform float uLength;
          varying vec3 vWorldPos;

          void main() {
            vec3 pos = position;
            float z = mod(aOffset.z - uTime * 40.0 * uSpeed, uLength);
            pos.z += z;
            pos.x += aOffset.x;
            pos.y += aOffset.y;

            vec3 distortion = getDistortion(pos.z);
            pos.x += distortion.x;
            pos.y += distortion.y;

            vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
            vWorldPos = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform vec3 uFogColor;
          uniform float uFogNear;
          uniform float uFogFar;
          varying vec3 vWorldPos;

          void main() {
            vec3 color = uColor * 2.0;
            float depth = length(vWorldPos - cameraPosition);
            float fogFactor = smoothstep(uFogNear, uFogFar, depth);
            color = mix(color, uFogColor, fogFactor);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      return new THREE.Mesh(geometry, material);
    };

    const lightSticks = createLightSticks();
    scene.add(lightSticks);

    // --- Animation & Interaction ---
    let targetSpeed = 1.0;
    let currentSpeed = 1.0;
    const clock = new THREE.Clock();
    let animationId;

    const onPointerDown = () => {
      targetSpeed = options.speedUp || 2.5;
      if (options.onSpeedUp) options.onSpeedUp();
    };

    const onPointerUp = () => {
      targetSpeed = 1.0;
      if (options.onSlowDown) options.onSlowDown();
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchend', onPointerUp);

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      currentSpeed += (targetSpeed - currentSpeed) * delta * 4.0;
      distortionUniforms.uTime.value = elapsed;
      distortionUniforms.uSpeed.value = currentSpeed;

      // Subtle camera tilt
      camera.position.x = Math.sin(elapsed * 0.4) * 0.8;
      camera.lookAt(
        Math.sin(elapsed * 0.4) * 2.0,
        3.0,
        options.length * 0.5
      );

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // --- Responsive Resize ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);

      roadGeometry.dispose();
      roadMaterial.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [effectOptions]);

  return (
    <div
      ref={containerRef}
      className={`hyperspeed-container ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default Hyperspeed;
