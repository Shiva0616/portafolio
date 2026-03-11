import * as THREE from 'three';

export function createHeroParticles(canvas: HTMLCanvasElement): () => void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particlesCount = 120;
  const positions = new Float32Array(particlesCount * 3);
  const velocities: THREE.Vector3[] = [];

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
      ),
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const isDark = () => document.documentElement.classList.contains('dark');

  const material = new THREE.PointsMaterial({
    color: isDark() ? 0x00c8ff : 0x0088aa,
    size: 0.035,
    transparent: true,
    opacity: isDark() ? 0.8 : 0.6,
    blending: isDark() ? THREE.AdditiveBlending : THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: isDark() ? 0x00c8ff : 0x0088aa,
    transparent: true,
    opacity: isDark() ? 0.15 : 0.12,
    blending: isDark() ? THREE.AdditiveBlending : THREE.NormalBlending,
  });

  // React to theme changes
  const themeObserver = new MutationObserver(() => {
    const dark = isDark();
    material.color.setHex(dark ? 0x00c8ff : 0x0088aa);
    material.opacity = dark ? 0.8 : 0.6;
    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
    lineMaterial.color.setHex(dark ? 0x00c8ff : 0x0088aa);
    lineMaterial.opacity = dark ? 0.15 : 0.12;
    lineMaterial.blending = dark
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;
    lineMaterial.needsUpdate = true;
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  const lineSegments: THREE.LineSegments[] = [];
  const mouse = { x: 0, y: 0 };
  let animationId: number;
  let disposed = false;

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const onResize = () => {
    if (disposed) return;
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  const animate = () => {
    if (disposed) return;
    animationId = requestAnimationFrame(animate);

    const posArray = geometry.attributes['position'].array as Float32Array;

    for (let i = 0; i < particlesCount; i++) {
      posArray[i * 3] += velocities[i].x;
      posArray[i * 3 + 1] += velocities[i].y;
      posArray[i * 3 + 2] += velocities[i].z;

      for (let axis = 0; axis < 3; axis++) {
        if (Math.abs(posArray[i * 3 + axis]) > 5) {
          velocities[i].setComponent(axis, -velocities[i].getComponent(axis));
        }
      }
    }

    geometry.attributes['position'].needsUpdate = true;

    lineSegments.forEach((ls) => {
      scene.remove(ls);
      ls.geometry.dispose();
    });
    lineSegments.length = 0;

    const linePositions: number[] = [];
    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1.5) {
          linePositions.push(
            posArray[i * 3],
            posArray[i * 3 + 1],
            posArray[i * 3 + 2],
            posArray[j * 3],
            posArray[j * 3 + 1],
            posArray[j * 3 + 2],
          );
        }
      }
    }

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3),
      );
      const ls = new THREE.LineSegments(lineGeo, lineMaterial);
      scene.add(ls);
      lineSegments.push(ls);
    }

    scene.rotation.y += 0.001;
    scene.rotation.x = mouse.y * 0.1;
    scene.rotation.y += mouse.x * 0.001;

    renderer.render(scene, camera);
  };

  animate();

  return () => {
    disposed = true;
    cancelAnimationFrame(animationId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    themeObserver.disconnect();

    lineSegments.forEach((ls) => {
      scene.remove(ls);
      ls.geometry.dispose();
    });

    scene.remove(points);
    geometry.dispose();
    material.dispose();
    lineMaterial.dispose();
    renderer.dispose();
  };
}
