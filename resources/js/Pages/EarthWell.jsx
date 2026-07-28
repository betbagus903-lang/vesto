import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createStarSky, disposeStarSky } from '../lib/starSky';

/**
 * Earth Well — 3D Globe interaktif + Star Sky mode
 * Toggle antara Globe Earth dan langit bintang berdasarkan data astronomi nyata.
 */
export default function EarthWell() {
  const mountRef = useRef(null);
  const [mode, setMode] = useState('globe');
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const clockRef = useRef(null);
  const frameIdRef = useRef(null);
  const globeAssetsRef = useRef(null);
  const skyGroupRef = useRef(null);

  // Cleanup all Three.js resources
  const cleanup = useCallback(() => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
    if (globeAssetsRef.current) {
      const assets = globeAssetsRef.current;
      assets.objects.forEach((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      if (assets.resizeObserver) assets.resizeObserver.disconnect();
      if (assets.earthGroup && sceneRef.current) {
        sceneRef.current.remove(assets.earthGroup);
      }
      globeAssetsRef.current = null;
    }
    if (skyGroupRef.current) {
      disposeStarSky(skyGroupRef.current);
      if (sceneRef.current) sceneRef.current.remove(skyGroupRef.current);
      skyGroupRef.current = null;
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }
    if (rendererRef.current) {
      if (rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    sceneRef.current = null;
    cameraRef.current = null;
    clockRef.current = null;
  }, []);

  // Setup renderer & scene (once)
  const initBase = useCallback(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;

    // renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controlsRef.current = controls;

    // clock
    clockRef.current = new THREE.Clock();

    // lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // resize
    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // store for cleanup
    sceneRef.current._resizeObserver = resizeObserver;
  }, []);

  // ---- GLOBE MODE ----
  const setupGlobe = useCallback(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    const container = mountRef.current;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    // Globe group with axial tilt
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
    scene.add(earthGroup);

    const objects = [];

    // Globe
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({ color: 0x2255aa, shininess: 8 });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    earthGroup.add(globe);
    objects.push(globeGeometry, globeMaterial);

    textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        globeMaterial.map = texture;
        globeMaterial.color.set(0xffffff);
        globeMaterial.needsUpdate = true;
      },
      undefined,
      () => console.error('Globe texture failed to load.')
    );

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(2.06, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3a8fd9,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    earthGroup.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));
    objects.push(atmosphereGeometry, atmosphereMaterial);

    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(2.05, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);
    objects.push(cloudGeometry, cloudMaterial);

    textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png', (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      cloudMaterial.map = t;
      cloudMaterial.alphaMap = t;
      cloudMaterial.needsUpdate = true;
    });

    // City lights
    const nightGeometry = new THREE.SphereGeometry(2.015, 64, 64);
    const nightMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });
    const cityLights = new THREE.Mesh(nightGeometry, nightMaterial);
    earthGroup.add(cityLights);
    objects.push(nightGeometry, nightMaterial);

    textureLoader.load('https://threejs.org/examples/textures/planets/earth_lights_2048.png', (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      nightMaterial.map = t;
      nightMaterial.needsUpdate = true;
    });

    // Moon
    const moonPivot = new THREE.Object3D();
    scene.add(moonPivot);

    const moonGeometry = new THREE.SphereGeometry(0.55, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(4.5, 0, 0);
    moonPivot.add(moon);
    objects.push(moonGeometry, moonMaterial);

    textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      moonMaterial.map = texture;
      moonMaterial.color.set(0xffffff);
      moonMaterial.needsUpdate = true;
    });

    // Moon orbit line
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(a) * 4.5, 0, Math.sin(a) * 4.5));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineDashedMaterial({
      color: 0x3a8fd9,
      dashSize: 0.2,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.35,
    });
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);
    objects.push(orbitGeometry, orbitMaterial);

    // Camera settings for globe
    camera.position.set(0, 0, 6);
    controls.minDistance = 2.1;
    controls.maxDistance = 30;
    controls.rotateSpeed = 0.55;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Moon phase label
    const sunDirection = new THREE.Vector3(5, 3, 5).normalize();
    const moonWorldPos = new THREE.Vector3();

    globeAssetsRef.current = {
      earthGroup,
      clouds,
      cityLights,
      moonPivot,
      moon,
      objects,
      resizeObserver: sceneRef.current._resizeObserver,
      loop: (delta) => {
        const earthSpeed = 1;
        const moonSpeed = earthSpeed / 27.3;

        globe.rotation.y += earthSpeed * delta;
        clouds.rotation.y += earthSpeed * 0.7 * delta;
        cityLights.rotation.y += earthSpeed * 0.7 * delta;
        moonPivot.rotation.y += moonSpeed * delta;
        moon.rotation.y = moonPivot.rotation.y;

        // Moon phase
        moon.getWorldPosition(moonWorldPos);
        const earthToMoon = moonWorldPos.clone().negate().normalize();
        const cosPhase = sunDirection.dot(earthToMoon.negate());
        const illumination = (1 + cosPhase) / 2;
        const elongation = moonPivot.rotation.y % (Math.PI * 2);
        const deg = (elongation * 180) / Math.PI;

        let name = 'Bulan Baru';
        if (deg < 45) name = 'Bulan Baru';
        else if (deg < 90) name = 'Sabit Awal';
        else if (deg < 135) name = 'Kuartal Pertama';
        else if (deg < 180) name = 'Cembung Awal';
        else if (deg < 225) name = 'Purnama';
        else if (deg < 270) name = 'Cembung Akhir';
        else if (deg < 315) name = 'Kuartal Akhir';
        else name = 'Sabit Akhir';

        const label = document.getElementById('moon-phase');
        if (label) label.textContent = `${name} (${Math.round(illumination * 100)}% terang)`;
      },
    };
  }, []);

  // ---- SKY MODE ----
  const setupSky = useCallback(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    const objects = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    // Position camera at center, looking outward
    camera.position.set(0, 0, 0.1);

    // Controls: no zoom, reversed rotation for "look around" feel
    controls.minDistance = 0.1;
    controls.maxDistance = 0.1;
    controls.enableZoom = false;
    controls.rotateSpeed = -0.4;
    controls.autoRotate = false;

    // ---- 360° panoramic background sphere ----
    // Sphere besar, normal dibalik (BackSide) biar foto keliatan dari dalam
    const panoGeometry = new THREE.SphereGeometry(50, 64, 64);
    const panoMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      depthWrite: false,
    });
    const panoSphere = new THREE.Mesh(panoGeometry, panoMaterial);
    scene.add(panoSphere);
    objects.push(panoGeometry, panoMaterial);

    // Ganti URL ini ke foto 360° kamu (equirectangular)
    // Taruh foto di public/images/, lalu ganti path-nya
    textureLoader.load('/images/panorama.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      panoMaterial.map = texture;
      panoMaterial.needsUpdate = true;
    }, undefined, () => {
      // Fallback: kalau foto gak ada, pake gradient gelap
      panoMaterial.color.set(0x0a0a14);
    });

    // Create star sky (radius 40, di dalam pano sphere tapi di luar kamera)
    const starSky = createStarSky(40);
    scene.add(starSky);
    skyGroupRef.current = starSky;

    globeAssetsRef.current = {
      objects,
      resizeObserver: sceneRef.current._resizeObserver,
      loop: () => {},
    };
  }, []);

  // Animation loop
  useEffect(() => {
    initBase();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current?.getDelta() || 0;
      if (globeAssetsRef.current?.loop) {
        globeAssetsRef.current.loop(delta);
      }
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current, cameraRef.current);
    };

    // Start in globe mode
    setupGlobe();
    animate();

    return cleanup;
  }, [initBase, setupGlobe, cleanup]);

  // Mode switch
  useEffect(() => {
    if (mode === 'globe') {
      // Already in globe from initial setup, skip if first render
      if (skyGroupRef.current) {
        // Switching FROM sky TO globe
        disposeStarSky(skyGroupRef.current);
        sceneRef.current.remove(skyGroupRef.current);
        skyGroupRef.current = null;

        // Reset controls
        const controls = controlsRef.current;
        if (controls) {
          controls.enableZoom = true;
          controls.rotateSpeed = 0.55;
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.6;
          controls.minDistance = 2.1;
          controls.maxDistance = 30;
        }

        setupGlobe();
      }
    } else if (mode === 'sky') {
      // Switching TO sky
      if (globeAssetsRef.current) {
        // Dispose globe objects
        globeAssetsRef.current.objects.forEach((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });

        // Remove ALL scene children except lights — clean slate
        const toRemove = sceneRef.current.children.filter(
          (child) => !child.isLight
        );
        toRemove.forEach((obj) => sceneRef.current.remove(obj));

        globeAssetsRef.current = null;
      }
      setupSky();
    }
  }, [mode, setupGlobe, setupSky]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <style>{`
        :root { color-scheme: dark; }
        body { margin: 0; background: #000; }
        canvas { display: block; }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,120,255,0.12),_transparent_45%)]" />

      {/* Back button */}
      <Link
        href="/welcome"
        className="absolute left-4 top-4 z-20 rounded-full border border-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white sm:left-6 sm:top-6 sm:px-5"
      >
        Back
      </Link>

      {/* Mode toggle */}
      <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-6">
        <button
          onClick={() => setMode('globe')}
          className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition sm:px-5 sm:text-[11px] ${
            mode === 'globe'
              ? 'border-white bg-white text-black'
              : 'border-white/15 text-white/70 hover:border-white hover:text-white'
          }`}
        >
          Globe
        </button>
        <button
          onClick={() => setMode('sky')}
          className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition sm:px-5 sm:text-[11px] ${
            mode === 'sky'
              ? 'border-white bg-white text-black'
              : 'border-white/15 text-white/70 hover:border-white hover:text-white'
          }`}
        >
          Langit
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute left-4 top-20 z-20 max-w-xs rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-[11px] leading-5 text-white/80 backdrop-blur sm:left-6 sm:top-24 sm:px-4 sm:text-xs">
        {mode === 'globe' ? (
          <>
            <div>Drag / geser jari = putar globe ke segala arah</div>
            <div className="mt-1">Scroll / cubit = zoom in-out</div>
          </>
        ) : (
          <>
            <div>Drag = lihat sekeliling langit bintang</div>
            <div className="mt-1">60+ bintang nyata & 6 rasi bintang</div>
          </>
        )}
      </div>

      {/* Moon phase (globe mode only) */}
      {mode === 'globe' && (
        <div id="moon-phase" className="absolute bottom-3 left-3 z-10 rounded bg-black/60 px-3 py-1 text-xs text-white" />
      )}

      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
