import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({ providedIn: 'root' })
export class ThreeService {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Creates a particle network hero scene: 120 particles with connecting lines,
   * cyan color (#00C8FF), reacts to mouse movement, rotates slowly.
   * Returns a cleanup function that disposes all resources.
   */
  initHeroScene(canvas: HTMLCanvasElement): () => void {
    if (!isPlatformBrowser(this.platformId)) return () => {};

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    // --- Particles ---
    const PARTICLE_COUNT = 120;
    const CYAN = new THREE.Color(0x00c8ff);
    const CONNECTION_DISTANCE = 1.5;

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 6;
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = (Math.random() - 0.5) * 4;

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: CYAN,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Connecting lines ---
    // Maximum possible connections: PARTICLE_COUNT * (PARTICLE_COUNT - 1) / 2
    const maxLineVertices = PARTICLE_COUNT * PARTICLE_COUNT;
    const linePositions = new Float32Array(maxLineVertices * 3);
    const lineColors = new Float32Array(maxLineVertices * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(lineColors, 3),
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Mouse tracking ---
    const mouse = new THREE.Vector2(0, 0);

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });

    // --- Resize handling ---
    const onResize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // --- Animation loop ---
    let animationId: number | null = null;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const posArray = particleGeometry.attributes['position']
        .array as Float32Array;

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        // Bounce off bounds
        if (Math.abs(posArray[i3]) > 3) velocities[i3] *= -1;
        if (Math.abs(posArray[i3 + 1]) > 3) velocities[i3 + 1] *= -1;
        if (Math.abs(posArray[i3 + 2]) > 2) velocities[i3 + 2] *= -1;
      }

      particleGeometry.attributes['position'].needsUpdate = true;

      // React to mouse — displace nearby particles
      const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const dx = posArray[i3] - mouseWorld.x;
        const dy = posArray[i3 + 1] - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.0 && dist > 0.01) {
          const force = (1.0 - dist) * 0.003;
          posArray[i3] += (dx / dist) * force;
          posArray[i3 + 1] += (dy / dist) * force;
        }
      }

      // Update connecting lines
      let lineIndex = 0;

      const linePosArray = lineGeometry.attributes['position']
        .array as Float32Array;
      const lineColArray = lineGeometry.attributes['color']
        .array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const i3 = i * 3;
          const j3 = j * 3;

          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE;
            const li = lineIndex * 6; // 2 vertices * 3 components

            if (li + 5 < linePosArray.length) {
              linePosArray[li] = posArray[i3];
              linePosArray[li + 1] = posArray[i3 + 1];
              linePosArray[li + 2] = posArray[i3 + 2];
              linePosArray[li + 3] = posArray[j3];
              linePosArray[li + 4] = posArray[j3 + 1];
              linePosArray[li + 5] = posArray[j3 + 2];

              lineColArray[li] = CYAN.r * alpha;
              lineColArray[li + 1] = CYAN.g * alpha;
              lineColArray[li + 2] = CYAN.b * alpha;
              lineColArray[li + 3] = CYAN.r * alpha;
              lineColArray[li + 4] = CYAN.g * alpha;
              lineColArray[li + 5] = CYAN.b * alpha;

              lineIndex++;
            }
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex * 2);
      lineGeometry.attributes['position'].needsUpdate = true;
      lineGeometry.attributes['color'].needsUpdate = true;

      // Slow rotation of the entire particle group
      particles.rotation.y += 0.001;
      lines.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup function ---
    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }

  /**
   * Loads a GLB model via GLTFLoader, adds OrbitControls with auto-rotate,
   * ambient + directional lighting. Returns a cleanup function.
   */
  loadGLBModel(canvas: HTMLCanvasElement, modelPath: string): () => void {
    if (!isPlatformBrowser(this.platformId)) return () => {};

    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 3);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x00c8ff, 0.3);
    fillLight.position.set(-3, 2, -3);
    scene.add(fillLight);

    // --- OrbitControls ---
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    // --- Load GLB ---
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // 1. Scale so largest dimension = 2
        const prebox = new THREE.Box3().setFromObject(model);
        const presize = prebox.getSize(new THREE.Vector3());
        const maxDim = Math.max(presize.x, presize.y, presize.z);
        const s = 2 / maxDim;
        model.scale.setScalar(s);

        // 2. Recompute AABB after scaling to get the real center
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 3. Offset model so its center is at world origin
        model.position.sub(center);
        scene.add(model);

        // 4. Fit camera: place it directly in front at a distance based on FOV
        const maxExtent = Math.max(size.x, size.y, size.z);
        const fovRad = (camera.fov / 2) * (Math.PI / 180);
        const dist = (maxExtent / 2 / Math.tan(fovRad)) * 1.4;
        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      (error) => {
        console.error('ThreeService: Failed to load GLB model:', error);
      },
    );

    // --- Resize handling ---
    const onResize = () => {
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // --- Animation loop ---
    let animationId: number | null = null;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      controls.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }

  /**
   * Creates procedural fallback scenes based on the given type.
   * Supported types: 'wireframe', 'particles', 'wave'.
   * Returns a cleanup function.
   */
  createFallbackScene(canvas: HTMLCanvasElement, type: string): () => void {
    if (!isPlatformBrowser(this.platformId)) return () => {};

    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    let animationId: number | null = null;
    let animationCallback: ((time: number) => void) | null = null;

    switch (type) {
      case 'wireframe':
        animationCallback = this.buildWireframeSphere(scene);
        break;
      case 'particles':
        animationCallback = this.buildFloatingParticles(scene);
        break;
      case 'wave':
        animationCallback = this.buildAudioWave(scene);
        break;
      default:
        animationCallback = this.buildWireframeSphere(scene);
        break;
    }

    // --- Resize handling ---
    const onResize = () => {
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // --- Animation loop ---
    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);
      if (animationCallback) animationCallback(time);
      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // --- Cleanup ---
    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }

  /**
   * Builds a rotating wireframe sphere with cyan edges.
   */
  private buildWireframeSphere(scene: THREE.Scene): (time: number) => void {
    const geometry = new THREE.IcosahedronGeometry(1.5, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00c8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner glow sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00c8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });

    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);

    return (time: number) => {
      const t = time * 0.001;
      sphere.rotation.x = t * 0.3;
      sphere.rotation.y = t * 0.5;
      innerSphere.rotation.x = -t * 0.2;
      innerSphere.rotation.y = -t * 0.4;
    };
  }

  /**
   * Builds floating particles scattered in 3D space with slow orbital motion.
   */
  private buildFloatingParticles(scene: THREE.Scene): (time: number) => void {
    const PARTICLE_COUNT = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const colorCyan = new THREE.Color(0x00c8ff);
    const colorPurple = new THREE.Color(0x7b2fff);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = 1 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = Math.random() > 0.5 ? colorCyan : colorPurple;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    return (time: number) => {
      const t = time * 0.001;
      points.rotation.y = t * 0.15;
      points.rotation.x = Math.sin(t * 0.1) * 0.1;

      // Gentle pulsing
      const scale = 1 + Math.sin(t * 0.5) * 0.05;
      points.scale.setScalar(scale);
    };
  }

  /**
   * Builds an audio-wave-style visualization using a line strip
   * that undulates based on sine waves.
   */
  private buildAudioWave(scene: THREE.Scene): (time: number) => void {
    const SEGMENTS = 128;
    const LINES = 5;
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);

    const lineRefs: {
      geometry: THREE.BufferGeometry;
      positions: Float32Array;
      offset: number;
    }[] = [];

    for (let l = 0; l < LINES; l++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(SEGMENTS * 3);

      for (let i = 0; i < SEGMENTS; i++) {
        const i3 = i * 3;
        positions[i3] = (i / (SEGMENTS - 1)) * 6 - 3; // x from -3 to 3
        positions[i3 + 1] = 0;
        positions[i3 + 2] = (l - (LINES - 1) / 2) * 0.4; // spread lines along z
      }

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );

      const hue = 0.53 + l * 0.03; // cyan-ish range
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1, 0.5),
        transparent: true,
        opacity: 0.7 - l * 0.1,
      });

      const line = new THREE.Line(geometry, material);
      lineGroup.add(line);

      lineRefs.push({ geometry, positions, offset: l * 0.5 });
    }

    return (time: number) => {
      const t = time * 0.001;

      lineRefs.forEach(({ geometry, positions, offset }) => {
        for (let i = 0; i < SEGMENTS; i++) {
          const x = positions[i * 3];
          // Multi-frequency wave
          const y =
            Math.sin(x * 2 + t * 2 + offset) * 0.3 +
            Math.sin(x * 4 + t * 3 + offset) * 0.15 +
            Math.sin(x * 1.5 + t * 1.5 + offset) * 0.2;

          positions[i * 3 + 1] = y;
        }

        geometry.attributes['position'].needsUpdate = true;
      });

      lineGroup.rotation.y = Math.sin(t * 0.3) * 0.2;
    };
  }
}
