import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const PLANETS = [
  {
    name: 'Merkurius',
    color: 0xc9b7a3,
    radius: 0.38,
    distance: 7,
    orbitDays: 88,
    rotationHours: 1407,
    axialTilt: 0.03,
    info: 'Planet paling dekat dengan Matahari',
  },
  {
    name: 'Venus',
    color: 0xe9b572,
    radius: 0.56,
    distance: 9.9,
    orbitDays: 225,
    rotationHours: 5832,
    axialTilt: 177.4,
    info: 'Atmosfer tebal dan berwarna keemasan',
  },
  {
    name: 'Bumi',
    color: 0x4ab0ff,
    radius: 0.62,
    distance: 13.4,
    orbitDays: 365,
    rotationHours: 24,
    axialTilt: 23.44,
    info: 'Planet biru yang kita tinggali',
  },
  {
    name: 'Mars',
    color: 0xf27a5d,
    radius: 0.46,
    distance: 17.8,
    orbitDays: 687,
    rotationHours: 24.6,
    axialTilt: 25.19,
    info: 'Cokelat kemerahan dengan gurun luas',
  },
  {
    name: 'Jupiter',
    color: 0xf2c98d,
    radius: 1.42,
    distance: 24.2,
    orbitDays: 4333,
    rotationHours: 9.9,
    axialTilt: 3.13,
    info: 'Planet terbesar dengan pola awan indah',
  },
  {
    name: 'Saturnus',
    color: 0xe8d8a3,
    radius: 1.2,
    distance: 31.8,
    orbitDays: 10759,
    rotationHours: 10.7,
    axialTilt: 26.73,
    info: 'Cincin yang sangat khas dan elegan',
  },
  {
    name: 'Uranus',
    color: 0x9fe9ef,
    radius: 1,
    distance: 39.6,
    orbitDays: 30687,
    rotationHours: 17.2,
    axialTilt: 97.77,
    info: 'Atmosfer biru kehijauan dan miring unik',
  },
  {
    name: 'Neptunus',
    color: 0x5a7df7,
    radius: 0.94,
    distance: 47.5,
    orbitDays: 60190,
    rotationHours: 16.1,
    axialTilt: 28.32,
    info: 'Planet biru tua yang sangat dingin',
  },
];

export default function EarthWell() {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const bodiesRef = useRef([]);
  const infoRef = useRef(null);

  const planetStats = useMemo(
    () =>
      PLANETS.map((planet) => ({
        ...planet,
        orbitPeriod: `${planet.orbitDays.toLocaleString()} hari`,
        rotation: `${planet.rotationHours.toLocaleString()} jam`,
        axialTilt: `${planet.axialTilt.toFixed(2)}°`,
      })),
    []
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020612);
    scene.fog = new THREE.Fog(0x020612, 55, 150);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 24, 70);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 22;
    controls.maxDistance = 140;
    controls.maxPolarAngle = Math.PI * 0.9;
    controlsRef.current = controls;

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const sunLight = new THREE.PointLight(0xfff3bf, 2.4, 0, 2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 220;
      positions[i + 1] = (Math.random() - 0.5) * 220;
      positions[i + 2] = (Math.random() - 0.5) * 220;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xdfeeff,
      size: 0.55,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3, 40, 40),
      new THREE.MeshStandardMaterial({
        color: 0xffd27a,
        emissive: 0xffb347,
        emissiveIntensity: 1.5,
        roughness: 0.8,
        metalness: 0.08,
      })
    );
    scene.add(sun);

    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(4.6, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffc56d,
        transparent: true,
        opacity: 0.18,
      })
    );
    scene.add(sunGlow);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const planetBodies = [];

    PLANETS.forEach((planet) => {
      const orbitLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: 160 }, (_, i) => {
            const angle = (i / 160) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * planet.distance, 0, Math.sin(angle) * planet.distance);
          })
        ),
        new THREE.LineBasicMaterial({
          color: 0x7ea6d9,
          transparent: true,
          opacity: 0.24,
        })
      );
      orbitGroup.add(orbitLine);

      const pivot = new THREE.Group();
      orbitGroup.add(pivot);

      const planetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius, 28, 28),
        new THREE.MeshStandardMaterial({
          color: planet.color,
          emissive: planet.color,
          emissiveIntensity: 0.12,
          roughness: 0.92,
          metalness: 0.03,
        })
      );
      planetMesh.position.x = planet.distance;
      planetMesh.rotation.z = THREE.MathUtils.degToRad(planet.axialTilt);
      pivot.add(planetMesh);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius * 1.45, 20, 20),
        new THREE.MeshBasicMaterial({
          color: planet.color,
          transparent: true,
          opacity: 0.09,
        })
      );
      glow.position.copy(planetMesh.position);
      pivot.add(glow);

      const planetData = {
        ...planet,
        mesh: planetMesh,
        pivot,
        orbitLine,
        angle: Math.random() * Math.PI * 2,
      };

      if (planet.name === 'Saturnus') {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.6, 2.8, 48),
          new THREE.MeshStandardMaterial({
            color: 0xe7d7a4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.72,
          })
        );
        ring.rotation.x = Math.PI / 2.8;
        planetMesh.add(ring);
      }

      if (planet.name === 'Bumi') {
        const moonPivot = new THREE.Group();
        const moonMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xc9d0d9, roughness: 1 })
        );
        moonMesh.position.set(1.6, 0, 0);
        moonPivot.add(moonMesh);
        planetMesh.add(moonPivot);
        planetData.moonPivot = moonPivot;
      }

      planetBodies.push(planetData);
    });

    bodiesRef.current = planetBodies;

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const elapsed = performance.now() * 0.001;
      const simTime = elapsed * 0.18;

      sun.rotation.y += 0.002;
      sunGlow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.08);
      starField.rotation.y += 0.00012;

      planetBodies.forEach((planet) => {
        const orbitRate = (Math.PI * 2) / (planet.orbitDays * 4.2);
        const rotationRate = (Math.PI * 2) / (planet.rotationHours / 24 * 6.2);

        planet.angle += orbitRate * 0.6;
        planet.pivot.rotation.y = planet.angle;
        planet.mesh.rotation.y += rotationRate * 0.025;
        planet.mesh.rotation.z = THREE.MathUtils.degToRad(planet.axialTilt);

        if (planet.moonPivot) {
          planet.moonPivot.rotation.y += 0.03 + simTime * 0.01;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      bodiesRef.current = [];
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020612] text-white">
      <style>{`
        :root { color-scheme: dark; }
        body { margin: 0; background: #020612; }
        canvas { display: block; }
      `}</style>

      <div className="absolute left-4 top-4 z-20 flex gap-2">
        <Link
          href="/welcome"
          className="rounded-full border border-white/15 bg-slate-950/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur hover:border-white hover:text-white"
        >
          Back
        </Link>
        <Link
          href="/space"
          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100 backdrop-blur hover:border-cyan-300 hover:bg-cyan-400/15"
        >
          Space
        </Link>
      </div>

      <div className="absolute right-4 top-4 z-20 rounded-full border border-cyan-400/30 bg-slate-950/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-100 backdrop-blur">
        Tata Surya Real-time
      </div>

      <div className="absolute left-4 top-20 z-20 w-[250px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-[10px] leading-5 text-slate-200 backdrop-blur-sm">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-300">Planet map</div>
        <ul className="space-y-1.5">
          {planetStats.map((planet) => (
            <li key={planet.name} className="flex items-center justify-between gap-2 border-b border-white/5 pb-1 last:border-0 last:pb-0">
              <span className="flex items-center gap-2 text-white">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `#${planet.color.toString(16).padStart(6, '0')}` }} />
                {planet.name}
              </span>
              <span className="text-slate-300">{planet.axialTilt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={infoRef} className="absolute bottom-4 right-4 z-20 w-[280px] max-w-[calc(100vw-2rem)] rounded-2xl border border-cyan-400/20 bg-slate-950/45 p-3 text-sm text-slate-200 backdrop-blur-sm">
        <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-300">Planet focus</div>
        <div className="text-lg font-semibold text-white">Bumi</div>
        <div className="mt-1 text-[11px] text-slate-300">Sumbu: 23.44° • Rotasi: 24 jam</div>
      </div>

      <div ref={mountRef} className="h-screen w-full" />
    </div>
  );
}
