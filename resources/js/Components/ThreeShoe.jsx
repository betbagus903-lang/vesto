import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ThreeShoe() {
  const containerRef = useRef(null);
  const shoeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      500 / 500,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      alpha: false, 
      antialias: true,
      background: new THREE.Color(0x808080)
    });
    
    renderer.setSize(500, 500);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    console.log('Canvas size:', 500, 500);
    console.log('Container:', containerRef.current);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/models/IRAK x Adidas Samba.glb',
      (gltf) => {
        console.log('GLB loaded successfully:', gltf);
        const shoe = gltf.scene;
        shoe.scale.set(2, 2, 2);
        shoe.rotation.y = -Math.PI / 4;
        // Start at center
        shoe.position.y = 0;
        shoe.visible = true;
        scene.add(shoe);
        shoeRef.current = shoe;
        console.log('Shoe added to scene:', shoeRef.current);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLB:', error);
      }
    );

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.5);
    pointLight.position.set(-5, 3, 3);
    scene.add(pointLight);

    // Camera position
    camera.position.z = 8;
    camera.position.y = 2;
    camera.position.x = 0;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // GSAP ScrollTrigger for falling animation (will be applied after model loads)
    let timeline;
    
    const setupAnimations = () => {
      if (!shoeRef.current) return;
      
      console.log('Setting up animations for shoe');
      console.log('Shoe position:', shoeRef.current.position);
      
      // Create timeline with section scroll trigger
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });

      // Fall animation - falls within the section
      timeline.to(shoeRef.current.position, {
        y: -8,
        duration: 1,
        ease: 'power2.inOut',
      })
      .to(shoeRef.current.rotation, {
        x: Math.PI * 4,
        y: Math.PI * 2,
        z: Math.PI,
        duration: 1,
      }, 0);
    };

    // Setup animations after model loads
    setTimeout(setupAnimations, 1000);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (scrollAnimation) scrollAnimation.kill();
      if (rotationAnimation) rotationAnimation.kill();
      if (showAnimation) showAnimation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      renderer.dispose();
      scene.clear();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
      style={{ 
        pointerEvents: 'none', 
        width: '500px', 
        height: '500px',
        border: '2px solid red',
        background: 'lightblue'
      }}
    />
  );
}
