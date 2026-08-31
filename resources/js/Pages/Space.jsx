import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createStarSky, disposeStarSky } from '../lib/starSky';

export default function Space() {
  const mountRef = useRef(null);
  const [mode, setMode] = useState('globe');
  const [selectedName, setSelectedName] = useState(null);
  const selectedNameRef = useRef(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const simTimeRef = useRef(new Date('2026-01-01T00:00:00Z'));
  const [simTick, setSimTick] = useState(0);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const clockRef = useRef(null);
  const frameIdRef = useRef(null);
  const globeAssetsRef = useRef(null);
  const skyGroupRef = useRef(null);
  const focusTargetRef = useRef(null);
  const focusLerpRef = useRef(null);
  const [focusName, setFocusName] = useState(null);

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
    // remove any renderer DOM listeners registered on the scene
    if (sceneRef.current && sceneRef.current._domListeners && rendererRef.current) {
      const { onClick, onDblClick } = sceneRef.current._domListeners;
      try {
        rendererRef.current.domElement.removeEventListener('click', onClick);
        rendererRef.current.domElement.removeEventListener('dblclick', onDblClick);
      } catch (e) {}
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

  const setFocus = useCallback(
    (name) => {
      if (!globeAssetsRef.current) return;
      if (!name || name === 'none') {
        setFocusName(null);
        focusTargetRef.current = null;
        focusLerpRef.current = null;
        if (controlsRef.current) controlsRef.current.autoRotate = true;
        return;
      }

      const assets = globeAssetsRef.current;
      let targetMesh = null;
      if (name === 'earth') targetMesh = assets.globe || assets.earthGroup?.children?.find((c) => c.isMesh);
      else if (name === 'moon') targetMesh = assets.moon;
      else targetMesh = assets.planets?.[name]?.mesh;

      if (!targetMesh) return;

      const worldPos = new THREE.Vector3();
      targetMesh.getWorldPosition(worldPos);

      // choose camera distance based on object size
      let distance = 6;
      const spec = assets.planets?.[name]?.spec;
      if (spec) distance = Math.max(4, spec.radius * 2.5 + 3);
      if (name === 'moon') distance = 3.4;
      if (name === 'earth') distance = 6;

      const cameraPos = worldPos.clone().add(new THREE.Vector3(0, 1.0, distance));

      focusLerpRef.current = {
        startCam: cameraRef.current.position.clone(),
        startTarget: controlsRef.current.target.clone(),
        cameraPos,
        targetPos: worldPos.clone(),
        t: 0,
      };
      focusTargetRef.current = targetMesh;
      setFocusName(name);
      if (controlsRef.current) controlsRef.current.autoRotate = false;
    },
    []
  );

  const initBase = useCallback(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 80, 1200);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = true;
    // map mouse buttons explicitly: left=rotate, right=pan, middle=zoom
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controlsRef.current = controls;

    clockRef.current = new THREE.Clock();

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.7);
    sunlight.position.set(0, 2, 6);
    scene.add(sunlight);

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // pointer events for selection and double-click (inside initBase so renderer/camera are in scope)
    function onPointer(event) {
      if (!globeAssetsRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onClick(e) {
      onPointer(e);
      const rc = raycasterRef.current;
      rc.setFromCamera(mouseRef.current, camera);
      const assets = globeAssetsRef.current;
      const pickList = [];
      if (assets.globe) pickList.push(assets.globe);
      if (assets.moon) pickList.push(assets.moon);
      if (assets.planets) Object.values(assets.planets).forEach((p) => pickList.push(p.mesh));
      const intersects = rc.intersectObjects(pickList, true);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        // find name
        let name = null;
        if (mesh === assets.globe) name = 'earth';
        else if (mesh === assets.moon) name = 'moon';
        else {
          const found = Object.entries(assets.planets).find(([, v]) => v.mesh === mesh);
          if (found) name = found[0];
        }
        if (name) {
          setSelectedName(name);
        }
      } else {
        setSelectedName(null);
      }
    }

    function onDblClick(e) {
      onPointer(e);
      const rc = raycasterRef.current;
      rc.setFromCamera(mouseRef.current, camera);
      const assets = globeAssetsRef.current;
      const pickList = [];
      if (assets.globe) pickList.push(assets.globe);
      if (assets.moon) pickList.push(assets.moon);
      if (assets.planets) Object.values(assets.planets).forEach((p) => pickList.push(p.mesh));
      const intersects = rc.intersectObjects(pickList, true);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        let name = null;
        if (mesh === assets.globe) name = 'earth';
        else if (mesh === assets.moon) name = 'moon';
        else {
          const found = Object.entries(assets.planets).find(([, v]) => v.mesh === mesh);
          if (found) name = found[0];
        }
        if (name) {
          setFocus(name);
          setSelectedName(name);
        }
      }
    }

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('dblclick', onDblClick);

    sceneRef.current._resizeObserver = resizeObserver;
    sceneRef.current._domListeners = { onClick, onDblClick };
  }, []);
  const setupGlobe = useCallback(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

      const earthGroup = new THREE.Group();
      earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
      scene.add(earthGroup);

      const objects = [];

      // -- Earth (textured, unchanged) ---------------------------------
      const globeGeometry = new THREE.SphereGeometry(1.9, 64, 64);
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

    const atmosphereGeometry = new THREE.SphereGeometry(1.98, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3a8fd9,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    earthGroup.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));
    objects.push(atmosphereGeometry, atmosphereMaterial);

    const cloudGeometry = new THREE.SphereGeometry(1.97, 64, 64);
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

    const nightGeometry = new THREE.SphereGeometry(1.95, 64, 64);
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

    const moonPivot = new THREE.Object3D();
    scene.add(moonPivot);

    const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(9.0, 0, 0);
    moonPivot.add(moon);
    objects.push(moonGeometry, moonMaterial);

    textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      moonMaterial.map = texture;
      moonMaterial.color.set(0xffffff);
      moonMaterial.needsUpdate = true;
    });

      // -- Moon orbit already around EarthGroup via moonPivot ----------------
      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(a) * 4.2, 0, Math.sin(a) * 4.2));
      }
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineDashedMaterial({
        color: 0x3a8fd9,
        dashSize: 0.2,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.35,
      });
      const moonOrbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
      moonOrbitLine.computeLineDistances();
      scene.add(moonOrbitLine);
      objects.push(orbitGeometry, orbitMaterial);

      // -- Simple nearby planets (plain colored globes) ------------------
      const solarGroup = new THREE.Group();
      scene.add(solarGroup);

      const planetSpecs = [
        { name: 'Sun', color: 0xffd27a, radius: 3.6, dist: -80 },
        { name: 'Mercury', color: 0xa9a9a9, radius: 0.5, dist: 6 },
        { name: 'Venus', color: 0xe8c07a, radius: 1.3, dist: 10 },
        { name: 'Mars', color: 0xd96b3a, radius: 0.95, dist: 16 },
        { name: 'Jupiter', color: 0xdcb58a, radius: 2.8, dist: 28 },
        { name: 'Saturn', color: 0xe3d3aa, radius: 2.4, dist: 40 },
        { name: 'Uranus', color: 0xa8dff0, radius: 1.8, dist: 60 },
        { name: 'Neptune', color: 0x6ea7ff, radius: 1.8, dist: 80 },
      ];

      const planets = {};
      const orbitLines = [];

      planetSpecs.forEach((spec, idx) => {
        const pivot = new THREE.Object3D();
        solarGroup.add(pivot);

        const geo = new THREE.SphereGeometry(spec.radius, 32, 32);
        const mat = new THREE.MeshPhongMaterial({ color: spec.color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(spec.dist, 0, 0);
        pivot.add(mesh);

        // dynamic orbit line (history-based) for visualizing actual trajectory
        const maxTrail = 1024;
        const trailGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(maxTrail * 3);
        trailGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const trailMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
        const trail = new THREE.Line(trailGeom, trailMat);
        trail.userData.maxTrail = maxTrail;
        trail.userData.length = 0;
        scene.add(trail);

        planets[spec.name.toLowerCase()] = { pivot, mesh, spec, orbitLine: trail };
        orbitLines.push(trail);

        objects.push(geo, mat, trailGeom, trailMat);
      });

      // distance vector line (Earth -> Sun) - will be updated per physics step
      const distGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const distMat = new THREE.LineBasicMaterial({ color: 0x3aa8ff, transparent: true, opacity: 0.85 });
      const distanceLine = new THREE.Line(distGeom, distMat);
      distanceLine.visible = false;
      scene.add(distanceLine);
      objects.push(distGeom, distMat);

      // Keep references for UI focus and animation
      globeAssetsRef.current = {
        earthGroup,
        globe, // main earth mesh
        clouds,
        cityLights,
        moonPivot,
        moon,
        planets,
        objects,
        orbitLines,
        resizeObserver: sceneRef.current._resizeObserver,
        loop: (delta) => {
          const earthSpeed = 1;
          const moonSpeed = earthSpeed / 27.3;

          // if physics enabled, step and apply positions; otherwise fallback to simple rotations
          const sim = globeAssetsRef.current.physics;
          if (sim) {
            sim.step(delta);
            // apply simulated positions to meshes
            sim.bodies.forEach((b) => {
              if (b.mesh) {
                b.mesh.position.copy(b.position);
              }
            });
            // keep visual earth rotations (spin only)
            globe.rotation.y += earthSpeed * delta;
            clouds.rotation.y += earthSpeed * 0.7 * delta;
            cityLights.rotation.y += earthSpeed * 0.7 * delta;
          } else {
            globe.rotation.y += earthSpeed * delta;
            clouds.rotation.y += earthSpeed * 0.7 * delta;
            cityLights.rotation.y += earthSpeed * 0.7 * delta;
            moonPivot.rotation.y += moonSpeed * delta;
            moon.rotation.y = moonPivot.rotation.y;

            // rotate planet pivots for simple orbital motion
            Object.values(planets).forEach((p, idx) => {
              // much slower orbital motion for wider spacing
              const base = 0.04 / (1 + idx * 0.6);
              p.pivot.rotation.y += base * delta;
              p.mesh.rotation.y += 0.02 * delta;
            });
          }

          // update moon phase label
          const sunDirection = new THREE.Vector3(0, 2, 6).normalize();
          const moonWorldPos = new THREE.Vector3();
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

      // --- Physics: N-body simulator (Leapfrog) with unit conversions and diagnostics --
      (function setupPhysics() {
        // Physics units: meters (m), kilograms (kg), seconds (s)
        // Render units (scene units) map to meters via metersPerUnit derived from Earth's mesh radius.
        const EARTH_RADIUS_M = 6371000; // meters

        // real gravitational constant
        const G = 6.67430e-11; // m^3 kg^-1 s^-2

        // find render-to-meter scale from the Earth mesh radius
        const earthRenderRadius = globe.geometry?.parameters?.radius || 1.9;
        const metersPerUnit = EARTH_RADIUS_M / earthRenderRadius;

        // softening length (meters): small fraction of typical body separation but >= body radius to avoid singular forces
        // we choose softening = max(1000 m, 0.02 * metersPerUnit) — keeps it linked to render scale
        const softening = Math.max(1000, 0.02 * metersPerUnit);

        // masses in kg (realistic). We'll place them in the simulation directly — no arbitrary scale.
        const massMapSI = {
          sun: 1.98847e30,
          mercury: 3.3011e23,
          venus: 4.8675e24,
          earth: 5.97237e24,
          moon: 7.342e22,
          mars: 6.4171e23,
          jupiter: 1.8982e27,
          saturn: 5.6834e26,
          uranus: 8.6810e25,
          neptune: 1.02413e26,
        };

        const bodies = [];

        const getWorldPosRender = (mesh) => {
          const v = new THREE.Vector3();
          mesh.getWorldPosition(v);
          return v;
        };

        // helper to add a body from a mesh: store physics position in meters, velocity in m/s
        function addBodyFromMesh(name, mesh, massKg) {
          const posRender = getWorldPosRender(mesh);
          const posMeters = posRender.clone().multiplyScalar(metersPerUnit);
          const body = {
            name,
            mesh,
            mass: massKg,
            position: posMeters, // THREE.Vector3 in meters
            velocity: new THREE.Vector3(), // m/s
            acceleration: new THREE.Vector3(),
            radiusMeters: (mesh.geometry?.parameters?.radius || 1) * metersPerUnit,
          };
          bodies.push(body);
          return body;
        }

        // Add planets from `planets` collection (these are render meshes)
        Object.entries(planets).forEach(([name, p]) => {
          const massKg = massMapSI[name] || 1e22;
          addBodyFromMesh(name, p.mesh, massKg);
        });

        // Ensure Earth and Moon (globe, moon meshes) exist as bodies (globe may already be in planets)
        if (!planets.earth) addBodyFromMesh('earth', globe, massMapSI.earth);
        if (moon) {
          // moon mesh might be separate from planets
          const existing = bodies.find((b) => b.mesh === moon);
          if (!existing) addBodyFromMesh('moon', moon, massMapSI.moon);
        }

        // Find Sun: if we have a 'sun' mesh in planets, fine; otherwise create a placeholder far at origin
        const sunBody = bodies.find((b) => b.name === 'sun');

        // Initialize velocities for near-circular orbits around Sun (or Earth for moon), using real gravity formula
        function initializeOrbitalVelocities() {
          const center = sunBody || bodies[0];
          bodies.forEach((b) => {
            if (b === center) return; // sun stays
            const isMoon = b.name === 'moon';
            const gravCenter = isMoon ? bodies.find((x) => x.name === 'earth') || center : center;
            const rVec = new THREE.Vector3().subVectors(b.position, gravCenter.position);
            const r = rVec.length();
            if (r <= 0) return;
            // compute circular orbit speed: v = sqrt(G*M_center / r)
            const vMag = Math.sqrt((G * gravCenter.mass) / r);
            // direction: perpendicular to r in orbital plane (use up vector)
            const up = new THREE.Vector3(0, 1, 0);
            let dir = new THREE.Vector3().crossVectors(up, rVec).normalize();
            if (!isFinite(dir.length()) || dir.length() === 0) dir = new THREE.Vector3(1, 0, 0);
            b.velocity.copy(dir.multiplyScalar(vMag));
          });
        }

        initializeOrbitalVelocities();

        // compute accelerations with softening (meters)
        function computeAccelerations() {
          bodies.forEach((b) => b.acceleration.set(0, 0, 0));
          for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
              const bi = bodies[i];
              const bj = bodies[j];
              const rVec = new THREE.Vector3().subVectors(bj.position, bi.position);
              const dist2 = rVec.lengthSq() + softening * softening;
              const invDist = 1 / Math.sqrt(dist2);
              const invDist3 = invDist * invDist * invDist;
              // acceleration (m/s^2)
              const ai = rVec.clone().multiplyScalar(G * bj.mass * invDist3);
              const aj = rVec.clone().multiplyScalar(-G * bi.mass * invDist3);
              bi.acceleration.add(ai);
              bj.acceleration.add(aj);
            }
          }
        }

        // diagnostics: energy and momentum
        function computeDiagnostics() {
          let kinetic = 0;
          let potential = 0;
          const momentum = new THREE.Vector3();
          bodies.forEach((b) => {
            const v2 = b.velocity.lengthSq();
            kinetic += 0.5 * b.mass * v2;
            momentum.addScaledVector(b.velocity, b.mass);
          });
          for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
              const bi = bodies[i];
              const bj = bodies[j];
              const r = Math.max(new THREE.Vector3().subVectors(bj.position, bi.position).length(), 1e-6);
              potential += -G * bi.mass * bj.mass / r;
            }
          }
          return { kinetic, potential, total: kinetic + potential, momentum }; 
        }

        // initial accelerations and diagnostics
        computeAccelerations();
        const initialDiag = computeDiagnostics();

        // --- quick diagnostic simulation (on a cloned state) to validate integrator stability ---
        (function diagnosticRun() {
          try {
            const cloneBodies = bodies.map((b) => ({
              mass: b.mass,
              position: b.position.clone(),
              velocity: b.velocity.clone(),
            }));

            function computeAccFor(list) {
              const acc = list.map(() => new THREE.Vector3());
              for (let i = 0; i < list.length; i++) {
                for (let j = i + 1; j < list.length; j++) {
                  const ri = list[i].position;
                  const rj = list[j].position;
                  const rVec = new THREE.Vector3().subVectors(rj, ri);
                  const dist2 = rVec.lengthSq() + softening * softening;
                  const invDist = 1 / Math.sqrt(dist2);
                  const invDist3 = invDist * invDist * invDist;
                  const ai = rVec.clone().multiplyScalar(G * list[j].mass * invDist3);
                  const aj = rVec.clone().multiplyScalar(-G * list[i].mass * invDist3);
                  acc[i].add(ai);
                  acc[j].add(aj);
                }
              }
              return acc;
            }

            const steps = 10;
            const dt = 60; // seconds
            // initial energy
            const energy = (arr) => {
              let ke = 0;
              let pe = 0;
              for (let i = 0; i < arr.length; i++) {
                ke += 0.5 * arr[i].mass * arr[i].velocity.lengthSq();
                for (let j = i + 1; j < arr.length; j++) {
                  const r = Math.max(new THREE.Vector3().subVectors(arr[j].position, arr[i].position).length(), 1e-6);
                  pe += -G * arr[i].mass * arr[j].mass / r;
                }
              }
              return ke + pe;
            };

            const e0 = energy(cloneBodies);
            // simple leapfrog on clones
            let accs = computeAccFor(cloneBodies);
            // half kick
            cloneBodies.forEach((b, i) => b.velocity.addScaledVector(accs[i], 0.5 * dt));
            for (let s = 0; s < steps; s++) {
              // drift
              cloneBodies.forEach((b) => b.position.addScaledVector(b.velocity, dt));
              accs = computeAccFor(cloneBodies);
              // kick
              cloneBodies.forEach((b, i) => b.velocity.addScaledVector(accs[i], dt));
            }
            const e1 = energy(cloneBodies);
            const rel = ((e1 - e0) / Math.abs(e0 || 1));
            console.info('[physics] diagnostic energy: initial=', e0, 'after=', e1, 'rel drift=', rel);
          } catch (err) {
            console.warn('[physics] diagnostic failed', err);
          }
        })();

        // visual compression / mapping (physics meters -> visual meters)
        function compressRadius(r) {
          // non-linear compression: linear near the sun, logarithmic growth far away
          const r0 = 2e9; // meters threshold (2 million km)
          const scale = 3e10; // meters scale for log (30 billion m)
          if (r <= r0) return r;
          return r0 + scale * Math.log1p((r - r0) / scale);
        }

        function physicsToRenderMeters(posMeters) {
          // compress radial distance around sun center
          const sun = bodies.find((b) => b.name === 'sun');
          const sunPos = sun ? sun.position : new THREE.Vector3(0, 0, 0);
          const rVec = new THREE.Vector3().subVectors(posMeters, sunPos);
          const r = rVec.length();
          if (r === 0) return posMeters.clone();
          const cr = compressRadius(r);
          const crVec = rVec.clone().normalize().multiplyScalar(cr);
          return sunPos.clone().add(crVec);
        }

        function physicsToRender(posMeters) {
          const meters = physicsToRenderMeters(posMeters);
          return meters.clone().multiplyScalar(1 / metersPerUnit);
        }

        // fixed timestep leapfrog integrator with accumulator (dt in seconds)
        const physics = {
          bodies,
          metersPerUnit,
          softening,
          G,
          accumulator: 0,
          dt: 60, // physics timestep: 60 seconds (can be tuned)
          diagnostics: { initial: initialDiag, last: initialDiag, history: [] },
          stepFixed(dt) {
            // half kick
            bodies.forEach((b) => b.velocity.addScaledVector(b.acceleration, 0.5 * dt));
            // drift
            bodies.forEach((b) => b.position.addScaledVector(b.velocity, dt));
            // recompute acc
            computeAccelerations();
            // half kick
            bodies.forEach((b) => b.velocity.addScaledVector(b.acceleration, 0.5 * dt));
            // record history for orbit visualization
            bodies.forEach((b) => {
              if (!b.history) b.history = [];
              b.history.push(b.position.clone());
              const maxTrail = 1024;
              if (b.history.length > maxTrail) b.history.shift();
            });
          },
          step(simSeconds) {
            // accumulate and perform fixed steps
            this.accumulator += simSeconds;
            const maxSteps = 100; // safety
            let steps = 0;
            while (this.accumulator >= this.dt && steps < maxSteps) {
              this.stepFixed(this.dt);
              this.accumulator -= this.dt;
              steps += 1;
            }
            // update diagnostics occasionally
            if (steps > 0) {
              const diag = computeDiagnostics();
              this.diagnostics.last = diag;
              this.diagnostics.history.push(diag.total);
              // keep history short
              if (this.diagnostics.history.length > 200) this.diagnostics.history.shift();
            }
            // after physics steps, update render meshes and orbit lines
            this.applyToMeshes();
          },
          // convert physics position (meters) to render units and apply to meshes
          applyToMeshes() {
            const assets = globeAssetsRef.current;
            if (!assets) return;
            // update mesh positions using compressed visual mapping
            bodies.forEach((b) => {
              if (b.mesh) {
                const pRender = physicsToRender(b.position);
                b.mesh.position.copy(pRender);
                // visual radius scaling
                const minRenderRadius = 0.08;
                const renderRadius = Math.max(b.radiusMeters / metersPerUnit, minRenderRadius);
                const originalRadius = b.mesh.geometry?.parameters?.radius || 1;
                const scaleFactor = renderRadius / originalRadius;
                if (b.mesh.scale) b.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
              }
            });

            // update dynamic orbit lines from history
            bodies.forEach((b) => {
              const planet = assets.planets?.[b.name];
              if (planet && planet.orbitLine && b.history && b.history.length > 0) {
                const line = planet.orbitLine;
                const maxTrail = line.userData.maxTrail || 1024;
                const posAttr = line.geometry.attributes.position.array;
                const len = Math.min(b.history.length, maxTrail);
                for (let i = 0; i < len; i++) {
                  const pm = b.history[i];
                  const pr = physicsToRender(pm).toArray();
                  posAttr[i * 3 + 0] = pr[0];
                  posAttr[i * 3 + 1] = pr[1];
                  posAttr[i * 3 + 2] = pr[2];
                }
                line.geometry.setDrawRange(0, len);
                line.geometry.attributes.position.needsUpdate = true;
              }
            });

            // update distance vector if a body is selected (show Earth->Sun vector)
            const sel = selectedNameRef.current;
            if (sel && assets && assets.physics) {
              const selBody = bodies.find((bb) => bb.name === sel);
              const sun = bodies.find((bb) => bb.name === 'sun');
              if (selBody && sun && typeof distanceLine !== 'undefined') {
                const p0 = physicsToRender(selBody.position);
                const p1 = physicsToRender(sun.position);
                distanceLine.geometry.setFromPoints([p0, p1]);
                distanceLine.visible = true;
              } else if (typeof distanceLine !== 'undefined') {
                distanceLine.visible = false;
              }
            } else if (typeof distanceLine !== 'undefined') {
              distanceLine.visible = false;
            }
          },
          physicsToRender,
        };

        globeAssetsRef.current.physics = physics;
      })();
    // camera defaults — start farther out so outer planets are visible
    camera.position.set(0, 5, 70);
    controls.target.set(0, 0, 0);
    controls.minDistance = 3.5;
    controls.maxDistance = 800;
    controls.rotateSpeed = 0.55;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
  }, []);

  // Remove duplicate/residual globeAssetsRef assignment and camera config block

  const setupSky = useCallback(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    const objects = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    camera.position.set(0, 0, 0.1);
    controls.minDistance = 0.1;
    controls.maxDistance = 0.1;
    controls.enableZoom = false;
    controls.rotateSpeed = -0.4;
    controls.autoRotate = false;

    const panoGeometry = new THREE.SphereGeometry(50, 64, 64);
    const panoMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      depthWrite: false,
    });
    const panoSphere = new THREE.Mesh(panoGeometry, panoMaterial);
    scene.add(panoSphere);
    objects.push(panoGeometry, panoMaterial);

    textureLoader.load(
      '/images/panorama.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        panoMaterial.map = texture;
        panoMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        panoMaterial.color.set(0x0a0a14);
      }
    );

    const starSky = createStarSky(40);
    scene.add(starSky);
    skyGroupRef.current = starSky;

    globeAssetsRef.current = {
      objects,
      resizeObserver: sceneRef.current._resizeObserver,
      loop: () => {},
    };
  }, []);

  useEffect(() => {
    selectedNameRef.current = selectedName;
  }, [selectedName]);

  // Fit Solar System utility: frame camera to include all visual positions
  const fitSolarSystem = useCallback(() => {
    const assets = globeAssetsRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!assets || !assets.physics || !camera || !controls) return;
    const phys = assets.physics;
    const bodies = phys.bodies;
    // compute visual positions
    const vis = bodies.map((b) => phys.physicsToRender(b.position));
    // center around sun visual if exists, else centroid
    const sun = bodies.find((b) => b.name === 'sun');
    const center = sun ? phys.physicsToRender(sun.position) : vis.reduce((a, p) => a.add(p.clone()), new THREE.Vector3()).multiplyScalar(1 / vis.length);
    let maxR = 0;
    vis.forEach((p) => maxR = Math.max(maxR, p.distanceTo(center)));
    const fov = camera.fov * (Math.PI / 180);
    const desired = Math.max(10, maxR * 2.2);
    // place camera at an offset along Y+Z so it's above the plane and looking at center
    const camPos = center.clone().add(new THREE.Vector3(0, desired, desired));
    camera.position.copy(camPos);
    controls.target.copy(center);
    controls.update();
  }, []);
  useEffect(() => {
    initBase();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current?.getDelta() || 0;
      const simDelta = isPaused ? 0 : delta * (typeof timeScale === 'number' ? timeScale : 1);
      if (globeAssetsRef.current?.loop) {
        globeAssetsRef.current.loop(simDelta);
      }
      // advance simulation clock (ms)
      simTimeRef.current = new Date(simTimeRef.current.getTime() + simDelta * 1000);
      // handle focus lerp if active
      const f = focusLerpRef.current;
      if (f) {
        f.t = Math.min(1, f.t + delta * 1.2);
        const camPos = new THREE.Vector3().lerpVectors(f.startCam, f.cameraPos, f.t);
        const tgtPos = new THREE.Vector3().lerpVectors(f.startTarget, f.targetPos, f.t);
        cameraRef.current.position.copy(camPos);
        controlsRef.current.target.copy(tgtPos);
        if (f.t >= 1) {
          focusLerpRef.current = null;
        }
      }

      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current, cameraRef.current);
    };

    setupGlobe();
    animate();

    return cleanup;
  }, [initBase, setupGlobe, cleanup]);

  // light-weight tick to update displayed simulation time once per second
  useEffect(() => {
    const id = setInterval(() => setSimTick((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (mode === 'globe') {
      if (skyGroupRef.current) {
        disposeStarSky(skyGroupRef.current);
        sceneRef.current.remove(skyGroupRef.current);
        skyGroupRef.current = null;

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
      if (globeAssetsRef.current) {
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

        const toRemove = sceneRef.current.children.filter((child) => !child.isLight);
        toRemove.forEach((obj) => sceneRef.current.remove(obj));

        globeAssetsRef.current = null;
      }
      setupSky();
    }
  }, [mode, setupGlobe, setupSky]);

  // toggle visibility of orbit lines when user changes setting
  useEffect(() => {
    const assets = globeAssetsRef.current;
    if (!assets) return;
    if (assets.orbitLines) assets.orbitLines.forEach((l) => (l.visible = !!showOrbits));
  }, [showOrbits]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <style>{`
        :root { color-scheme: dark; }
        body { margin: 0; background: #000; }
        canvas { display: block; }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,120,255,0.12),_transparent_45%)]" />

      <Link
        href="/earthwell"
        className="absolute left-4 top-4 z-20 rounded-full border border-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white sm:left-6 sm:top-6 sm:px-5"
      >
        Back
      </Link>

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

      <div className="absolute right-4 top-20 z-20 flex flex-col gap-2 sm:right-6 sm:top-28">
        <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-xs text-white/90 backdrop-blur">Focus</div>
        <button onClick={fitSolarSystem} className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/80">Fit</button>
        <div className="rounded-xl border border-white/8 bg-black/40 p-2 backdrop-blur text-sm flex gap-2 flex-wrap">
          <button onClick={() => setFocus('none')} className="px-2 py-1 rounded bg-white/10 text-white/80">None</button>
          <button onClick={() => setFocus('sun')} className="px-2 py-1 rounded bg-white/6 text-white/80">Sun</button>
          <button onClick={() => setFocus('mercury')} className="px-2 py-1 rounded bg-white/6 text-white/80">Mercury</button>
          <button onClick={() => setFocus('venus')} className="px-2 py-1 rounded bg-white/6 text-white/80">Venus</button>
          <button onClick={() => setFocus('earth')} className="px-2 py-1 rounded bg-white/6 text-white/80">Earth</button>
          <button onClick={() => setFocus('mars')} className="px-2 py-1 rounded bg-white/6 text-white/80">Mars</button>
          <button onClick={() => setFocus('jupiter')} className="px-2 py-1 rounded bg-white/6 text-white/80">Jupiter</button>
          <button onClick={() => setFocus('saturn')} className="px-2 py-1 rounded bg-white/6 text-white/80">Saturn</button>
          <button onClick={() => setFocus('uranus')} className="px-2 py-1 rounded bg-white/6 text-white/80">Uranus</button>
          <button onClick={() => setFocus('neptune')} className="px-2 py-1 rounded bg-white/6 text-white/80">Neptune</button>
          <button onClick={() => setFocus('moon')} className="px-2 py-1 rounded bg-white/6 text-white/80">Moon</button>
        </div>
      </div>

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

      {selectedName && (
        <div className="absolute right-4 top-1/2 z-20 w-64 -translate-y-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-3 text-sm text-white/90 backdrop-blur">
          {(() => {
            const assets = globeAssetsRef.current || {};
            const planet = assets.planets?.[selectedName];
            const spec = planet?.spec || (selectedName === 'earth' ? { radius: 1.9 } : selectedName === 'moon' ? { radius: 0.5 } : null);
            const type = selectedName === 'sun' ? 'Star' : selectedName === 'moon' ? 'Moon' : 'Planet';
            return (
              <div>
                <div className="font-semibold text-white">{selectedName.toUpperCase()}</div>
                <div className="mt-2 text-xs text-white/70">Type: {type}</div>
                <div className="mt-1 text-xs text-white/70">Radius: {spec?.radius ?? '—'}</div>
                <div className="mt-1 text-xs text-white/70">Distance: {planet?.spec?.dist ?? (selectedName==='earth' ? '1 (local)' : '—')}</div>
                <div className="mt-1 text-xs text-white/70">Mass: —</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setFocus(selectedName)} className="px-2 py-1 rounded border border-white/10">Focus</button>
                  <button onClick={() => { setFocus(selectedName); }} className="px-2 py-1 rounded border border-white/10">Explore</button>
                  <button onClick={() => alert('Edit panel (Phase 2)')} className="px-2 py-1 rounded border border-white/10">Edit</button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {mode === 'globe' && (
        <div id="moon-phase" className="absolute bottom-3 left-3 z-10 rounded bg-black/60 px-3 py-1 text-xs text-white" />
      )}

      {/* Bottom simulation control bar (Phase 1) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 flex items-center gap-3 rounded-lg bg-black/50 px-3 py-2 text-xs text-white/90 backdrop-blur">
        <button onClick={() => { setIsPaused((p)=>!p); }} className="px-2 py-1 rounded border border-white/10">{isPaused ? 'Play' : 'Pause'}</button>
        <button onClick={() => { simTimeRef.current = new Date(simTimeRef.current.getTime() - 1000); setSimTick(s=>s+1); }} className="px-2 py-1 rounded border border-white/10">◀</button>
        <button onClick={() => { simTimeRef.current = new Date(simTimeRef.current.getTime() + 1000); setSimTick(s=>s+1); }} className="px-2 py-1 rounded border border-white/10">▶</button>

        <div className="flex items-center gap-1">
          <button onClick={() => setTimeScale(0)} className={`px-2 py-1 rounded ${timeScale===0?'bg-white text-black':''}`}>0x</button>
          <button onClick={() => setTimeScale(0.1)} className={`px-2 py-1 rounded ${timeScale===0.1?'bg-white text-black':''}`}>0.1x</button>
          <button onClick={() => setTimeScale(1)} className={`px-2 py-1 rounded ${timeScale===1?'bg-white text-black':''}`}>1x</button>
          <button onClick={() => setTimeScale(10)} className={`px-2 py-1 rounded ${timeScale===10?'bg-white text-black':''}`}>10x</button>
          <button onClick={() => setTimeScale(100)} className={`px-2 py-1 rounded ${timeScale===100?'bg-white text-black':''}`}>100x</button>
          <button onClick={() => setTimeScale(1000)} className={`px-2 py-1 rounded ${timeScale===1000?'bg-white text-black':''}`}>1000x</button>
        </div>

        <div className="ml-3 text-[11px] text-white/70">Time: {simTimeRef.current.toUTCString()}</div>

        <div className="ml-4 flex items-center gap-2">
          <label className="flex items-center gap-2 text-white/70">Show Orbits
            <input type="checkbox" checked={showOrbits} onChange={(e)=>setShowOrbits(e.target.checked)} className="ml-1" />
          </label>
        </div>
      </div>

      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
