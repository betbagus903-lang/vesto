import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import * as THREE from 'three';

export default function EarthWellWorld() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcfeaff);
    scene.fog = new THREE.Fog(0xcfeaff, 18, 42);

    const camera = new THREE.PerspectiveCamera(34, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 7.8, 17.5);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x8bb2db, 0.8);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff3d2, 1.5);
    sun.position.set(16, 22, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const world = new THREE.Group();
    world.rotation.x = -0.35;
    scene.add(world);

    const ocean = new THREE.Mesh(
      new THREE.CircleGeometry(38, 128),
      new THREE.MeshStandardMaterial({
        color: 0x75c5ff,
        roughness: 0.55,
        metalness: 0.08,
      })
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -2.2;
    ocean.receiveShadow = true;
    world.add(ocean);

    const islandBase = new THREE.Mesh(
      new THREE.CylinderGeometry(16.5, 19.2, 3.6, 72),
      new THREE.MeshStandardMaterial({ color: 0x9ac7ff, flatShading: true })
    );
    islandBase.position.y = -1.7;
    islandBase.receiveShadow = true;
    world.add(islandBase);

    const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x7ecf6d, flatShading: true });

    const centralMountain = new THREE.Mesh(new THREE.SphereGeometry(7.6, 32, 32), hillMaterial);
    centralMountain.scale.set(1.45, 1.1, 1.25);
    centralMountain.position.set(0, 2.6, 0);
    centralMountain.castShadow = true;
    centralMountain.receiveShadow = true;
    world.add(centralMountain);

    const peak = new THREE.Mesh(new THREE.ConeGeometry(2.8, 4.6, 20), new THREE.MeshStandardMaterial({ color: 0x6bb45a, flatShading: true }));
    peak.position.set(0, 6.9, 0);
    peak.castShadow = true;
    world.add(peak);

    const hillLeft = new THREE.Mesh(new THREE.SphereGeometry(5.2, 24, 24), hillMaterial.clone());
    hillLeft.scale.set(1.35, 0.75, 1.1);
    hillLeft.position.set(-5.8, 1.8, 2.5);
    hillLeft.castShadow = true;
    hillLeft.receiveShadow = true;
    world.add(hillLeft);

    const hillRight = new THREE.Mesh(new THREE.SphereGeometry(5.4, 24, 24), hillMaterial.clone());
    hillRight.scale.set(1.2, 0.78, 1.25);
    hillRight.position.set(6.1, 1.9, -2.2);
    hillRight.castShadow = true;
    hillRight.receiveShadow = true;
    world.add(hillRight);

    const ridge = new THREE.Mesh(
      new THREE.CylinderGeometry(5.8, 8.2, 1.3, 32),
      new THREE.MeshStandardMaterial({ color: 0x71b95b, flatShading: true })
    );
    ridge.position.set(-3.5, 1.6, 3.8);
    ridge.rotation.z = 0.45;
    ridge.castShadow = true;
    ridge.receiveShadow = true;
    world.add(ridge);

    const pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0.15, 7),
      new THREE.Vector3(-6, 0.2, 3),
      new THREE.Vector3(-2, 0.22, 0),
      new THREE.Vector3(5, 0.2, -2),
      new THREE.Vector3(9, 0.18, 5),
      new THREE.Vector3(10, 0.15, 8),
    ]);

    const path = new THREE.Mesh(
      new THREE.TubeGeometry(pathCurve, 80, 0.38, 12, false),
      new THREE.MeshStandardMaterial({ color: 0xf0d9a5, flatShading: true })
    );
    path.position.y = 0.05;
    path.receiveShadow = true;
    world.add(path);

    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5f9c, flatShading: true });
    const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x7a4d30, flatShading: true });

    const treePositions = [
      [-8.6, 1.2, 4.9], [-7.4, 1.2, -4.3], [-2.3, 1.2, -9.8], [3.9, 1.2, -8.5], [9.1, 1.2, -2.7],
      [8.3, 1.2, 5.4], [-9.1, 1.2, 0.7], [1.2, 1.2, 9.6], [6.2, 1.2, 8.4], [-4.1, 1.2, 7.0],
      [-0.8, 1.2, 3.8], [4.8, 1.2, 1.5], [6.6, 1.2, -6.2]
    ];

    treePositions.forEach(([x, y, z], index) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.8, 8), treeTrunkMaterial);
      trunk.position.set(x, y, z);
      trunk.castShadow = true;
      world.add(trunk);

      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.95 + (index % 3) * 0.1, 2.1, 8), treeMaterial);
      crown.position.set(x, y + 1.8, z);
      crown.castShadow = true;
      world.add(crown);
    });

    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0xe7b79b, flatShading: true });
    [
      [-3.2, 0.8, 1.8], [2.2, 0.8, -3.4], [-2.1, 0.8, 5.8], [5.8, 0.8, 1.5], [0.8, 0.8, -5.8], [6.8, 0.8, 8.5], [-7.4, 0.8, 4.8]
    ].forEach(([x, y, z]) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), rockMaterial);
      rock.position.set(x, y, z);
      rock.scale.set(1.3, 0.85, 1.1);
      rock.castShadow = true;
      rock.receiveShadow = true;
      world.add(rock);
    });

    const house = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf6d9b8, flatShading: true });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x5148d6, flatShading: true });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x5a3f2d, flatShading: true });

    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.2, 1.9), wallMat);
    wall.position.y = 0.8;
    house.add(wall);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.7, 1.0, 4), roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 1.9;
    house.add(roof);

    const windowLeft = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.08), trimMat);
    windowLeft.position.set(-0.45, 1.0, 0.98);
    house.add(windowLeft);

    const windowRight = windowLeft.clone();
    windowRight.position.x = 0.45;
    house.add(windowRight);

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.78, 0.08), trimMat);
    door.position.set(0, 0.38, 0.98);
    house.add(door);

    house.position.set(7.3, 0.4, 5.8);
    house.rotation.y = -0.55;
    world.add(house);

    const dragState = {
      active: false,
      lastX: 0,
      lastY: 0,
      velocity: 0,
      pointerId: null,
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      dragState.active = true;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      dragState.pointerId = event.pointerId;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragState.active) return;

      const dx = event.clientX - dragState.lastX;
      const dy = event.clientY - dragState.lastY;

      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;

      world.rotation.y += dx * 0.008;
      world.rotation.x = THREE.MathUtils.clamp(world.rotation.x - dy * 0.005, -0.8, 0.28);
      dragState.velocity = dx * 0.012;
    };

    const onPointerUp = (event) => {
      if (dragState.pointerId !== null && event.pointerId !== undefined && event.pointerId !== dragState.pointerId) {
        return;
      }

      dragState.active = false;
      dragState.pointerId = null;
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);

    const tick = () => {
      if (!dragState.active) {
        dragState.velocity *= 0.94;
        world.rotation.y += dragState.velocity;
        if (Math.abs(dragState.velocity) < 0.0008) {
          dragState.velocity = 0;
        }
      }

      const sway = Math.sin(performance.now() * 0.0009) * 0.08;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, sway, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 7.8, 0.03);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 17.5, 0.03);
      camera.lookAt(0, 1.3, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    const animationId = requestAnimationFrame(tick);

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-sky-200 text-slate-800">
      <Link href="/earthwell" className="absolute left-4 top-4 z-20 rounded-full border border-slate-700/30 bg-white/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-800 backdrop-blur-sm hover:bg-white">
        Back to Earth
      </Link>

      <div className="absolute right-4 top-4 z-20 rounded-full border border-slate-700/20 bg-white/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-800 backdrop-blur-sm">
        EARTHWELL WORLD
      </div>

      <div className="absolute left-4 top-20 z-20 rounded-xl border border-slate-700/20 bg-white/45 px-3 py-2 text-[11px] text-slate-700 backdrop-blur-sm">
        Drag to rotate the island
      </div>

      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}
