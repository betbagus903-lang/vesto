import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ---------- tiny inline icon set (no external deps) ---------- */
const Icon = {
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.6-3.6 4.6-5.5 7.5-5.5s5.9 1.9 7.5 5.5" strokeLinecap="round" />
    </svg>
  ),
  Bag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M20 12H4M11 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2.5l2.9 6.3 6.8.7-5.1 4.6 1.5 6.9L12 17.6 5.9 21l1.5-6.9-5.1-4.6 6.8-.7L12 2.5Z" />
    </svg>
  ),
  Quote: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M9.5 6C6.5 7.3 5 9.7 5 12.7c0 2.4 1.4 4 3.4 4 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.9.3-1.6 1.6-3 3.2-3.7L9.5 6Zm9 0c-3 1.3-4.5 3.7-4.5 6.7 0 2.4 1.4 4 3.4 4 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.9.3-1.6 1.6-3 3.2-3.7L18.5 6Z" />
    </svg>
  ),
  Truck: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M2 7h11v9H2z" strokeLinejoin="round" />
      <path d="M13 10h4l4 3.2V16h-8z" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 10a8 8 0 0 1 13.7-5.7L20 6" strokeLinecap="round" />
      <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 14a8 8 0 0 1-13.7 5.7L4 18" strokeLinecap="round" />
      <path d="M4 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Image: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L4 19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Logo icon for VESTO
  Logo: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
    </svg>
  ),
};

const Stars = ({ className = 'h-3 w-3' }) => (
  <div className="flex gap-0.5 text-black">
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon.Star key={i} className={className} />
    ))}
  </div>
);

/**
 * MountainAnimation (versi baru — 1 gambar utuh, dibagi jadi "band" horizontal
 * pakai clip-path, jadi efek render bertahap tapi tetap nyambung sempurna
 * karena sumbernya cuma 1 file yang sama).
 */
const MountainAnimation = ({
  imageSrc = '/images/mountain-full.png',
  bandCount = 8,
  staggerDelay = 0.15,
  containerHeight = '600px',
  containerWidth = '100%',
}) => {
  const containerRef = useRef(null);
  const bandRefs = useRef([]);

  useEffect(() => {
    if (containerRef.current && bandRefs.current.length > 0) {
      gsap.set(bandRefs.current, { y: '35%', opacity: 0 });
      gsap.to(bandRefs.current, {
        y: '0%',
        opacity: 1,
        stagger: staggerDelay,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, [imageSrc, bandCount, staggerDelay]);

  const bandHeight = 100 / bandCount;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: containerHeight,
        width: containerWidth,
        // fade tepi kiri/kanan/bawah biar nyatu ke gradient hero
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, black 75%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, black 75%, transparent 100%)',
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
    >
      {/* band paling bawah dirender belakangan di DOM tapi index-nya dibalik
          supaya urutan "muncul dari bawah dulu" tetap benar */}
      {Array.from({ length: bandCount }).map((_, i) => {
        // i = 0 adalah band paling ATAS (puncak gunung), bandCount-1 = paling BAWAH
        const reverseIndex = bandCount - 1 - i; // dipakai buat stagger order
        const top = i * bandHeight;
        const bottom = 100 - top - bandHeight;
        return (
          <div
            key={i}
            ref={(el) => (bandRefs.current[reverseIndex] = el)}
            className="absolute inset-0"
            style={{ clipPath: `inset(${top}% 0 ${bottom}% 0)` }}
          >
            <img
              src={imageSrc}
              alt="Mountain"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * Placeholder pengganti foto.
 * Nanti tinggal ganti pemanggilannya jadi <img src="..." alt="..." className="..." />
 * dengan className yang sama persis biar ukuran/posisi gak berubah.
 */
const PhotoPlaceholder = ({ label, className = '' }) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 bg-gray-100 text-gray-400 ${className}`}
  >
    <Icon.Image className="h-6 w-6" />
    <span className="px-4 text-center text-[11px] font-medium uppercase tracking-[0.15em]">
      {label}
    </span>
  </div>
);

const NAV = [
  { label: 'Home', href: '/welcome', active: true },
  { label: 'Shop', href: '/home', authRequired: true },
  { label: 'Collections', href: '#collections' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
];

const COLLECTIONS = [
  { title: 'MEN', href: '/shop/men', photoLabel: 'Foto: Kategori Men' },
  { title: 'WOMEN', href: '/shop/women', photoLabel: 'Foto: Kategori Women' },
  { title: 'ACCESSORIES', href: '/shop/accessories', photoLabel: 'Foto: Kategori Accessories' },
];

const FEATURES = [
  { icon: Icon.Truck, title: 'FREE SHIPPING', subtitle: 'For all orders' },
  { icon: Icon.Shield, title: 'SECURE PAYMENT', subtitle: '100% safe & secure' },
  { icon: Icon.Refresh, title: '30 DAYS RETURN', subtitle: 'No hassle return' },
];

function SpiderWeb({
  className = '',
  particleCount = 70,
  maxDistance = 95,
  lineOpacity = 0.55,
  dotColor = 'rgba(255,255,255,0.95)',
  dotRadius = 1.2,
  speed = 0.18,
  alwaysWhite = false,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false, lastMove: 0, fade: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const host = canvas.parentElement;
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId;

    function resize() {
      const rect = host?.getBoundingClientRect();
      if (!rect) return;

      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function getHeroBrightness(x, y) {
      const xRatio = Math.min(1, Math.max(0, x / Math.max(1, width)));
      const yRatio = Math.min(1, Math.max(0, y / Math.max(1, height)));

      const t = Math.min(1, Math.max(0, xRatio));

      const stops = [
        { stop: 0, r: 0, g: 0, b: 0 },
        { stop: 0.44, r: 0, g: 0, b: 0 },
        { stop: 0.52, r: 64, g: 64, b: 64 },
        { stop: 0.6, r: 200, g: 200, b: 200 },
        { stop: 1, r: 255, g: 255, b: 255 },
      ];

      let start = stops[0];
      let end = stops[1];

      for (let i = 1; i < stops.length; i += 1) {
        const next = stops[i];
        if (t <= next.stop) {
          start = stops[i - 1];
          end = next;
          break;
        }
      }

      const span = end.stop - start.stop || 1;
      const localT = (t - start.stop) / span;
      const r = start.r + (end.r - start.r) * localT;
      const g = start.g + (end.g - start.g) * localT;
      const b = start.b + (end.b - start.b) * localT;

      return (r + g + b) / (3 * 255);
    }

    function getAccentColor(x, y, alpha = 1) {
      if (alwaysWhite) {
        return `rgba(255, 255, 255, ${alpha})`;
      }
      const brightness = getHeroBrightness(x, y);
      const isDarkArea = brightness < 0.35;
      return isDarkArea ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
    }

    function drawLine(x1, y1, x2, y2, alpha) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance) {
        const strokeAlpha = alpha * (1 - dist / maxDistance);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.strokeStyle = getAccentColor(midX, midY, strokeAlpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      const active = mouseRef.current.active && now - mouseRef.current.lastMove < 140;

      if (!active) {
        mouseRef.current.fade = Math.max(0, mouseRef.current.fade - 0.05);
      } else {
        mouseRef.current.fade = Math.min(1, mouseRef.current.fade + 0.12);
      }

      if (mouseRef.current.fade <= 0) {
        particles = [];
        ctx.clearRect(0, 0, width, height);
        animationId = requestAnimationFrame(tick);
        return;
      }

      if (active && particles.length < particleCount) {
        particles.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 10,
          y: mouseRef.current.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * speed * 1.2,
          vy: (Math.random() - 0.5) * speed * 1.2,
          life: 1,
          decay: 0.012 + Math.random() * 0.006,
          seed: Math.random() * Math.PI * 2,
        });
      }

      for (const p of particles) {
        const drift = Math.sin(now * 0.0015 + p.seed) * 0.18;
        p.x += p.vx + drift * 0.12;
        p.y += p.vy + Math.cos(now * 0.001 + p.seed) * 0.16;
        p.life -= p.decay;
        p.vx *= 0.96;
        p.vy *= 0.96;
      }

      particles = particles.filter((p) => p.life > 0);

      ctx.globalAlpha = 1;

      for (let i = 0; i < particles.length; i += 1) {
        let connections = 0;

        for (let j = i + 1; j < particles.length && connections < 4; j += 1) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist >= maxDistance) continue;

          const alignment = Math.abs(particles[i].vx * particles[j].vx + particles[i].vy * particles[j].vy);
          const shouldDraw = connections < 2 || alignment < 0.16;

          if (!shouldDraw) continue;

          const alpha = Math.max(0, lineOpacity * (1 - dist / maxDistance) * mouseRef.current.fade);
          drawLine(particles[i].x, particles[i].y, particles[j].x, particles[j].y, alpha);
          connections += 1;
        }
      }

      for (const p of particles) {
        const size = dotRadius * (0.7 + p.life * 0.7);
        const alpha = Math.max(0, p.life * mouseRef.current.fade);
        const brightness = getHeroBrightness(p.x, p.y);
        const isDarkArea = brightness < 0.35;
        const colorStr = alwaysWhite ? 'rgba(255, 255, 255' : (isDarkArea ? 'rgba(255, 255, 255' : 'rgba(0, 0, 0');

        ctx.globalAlpha = 1;

        const auraRadius = size * 4.5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, auraRadius);
        grad.addColorStop(0, `${colorStr}, ${alpha * 0.35})`);
        grad.addColorStop(0.4, `${colorStr}, ${alpha * 0.12})`);
        grad.addColorStop(1, `${colorStr}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alpha;
        ctx.fillStyle = getAccentColor(p.x, p.y, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(tick);
    }

    function handleMouseMove(e) {
      const rect = host?.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
        lastMove: Date.now(),
        fade: mouseRef.current.fade,
      };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, active: false, lastMove: 0, fade: mouseRef.current.fade };
    }

    resize();
    tick();

    window.addEventListener('resize', resize);
    host?.addEventListener('mousemove', handleMouseMove);
    host?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      host?.removeEventListener('mousemove', handleMouseMove);
      host?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [particleCount, maxDistance, lineOpacity, dotColor, dotRadius, speed, alwaysWhite]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" style={{ pointerEvents: 'auto' }} />;
}

export default function Welcome({ canLogin, canRegister, auth }) {
  const [email, setEmail] = useState('');
  const cartCount = 0;
  const [showLogoText, setShowLogoText] = useState(false);
  
  const headerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const heroImageRef = useRef(null);
  const decorativeTextRef = useRef(null);
  const shopButtonRef = useRef(null);
  const collectionRef = useRef(null);
  const dealSectionRef = useRef(null);
  const mountainRef = useRef(null);
  const verticalTextRef = useRef(null);
  const topRightTextRef = useRef(null);
  const bottomRightTextRef = useRef(null);
  const spiderWebRef = useRef(null);
  const logoRef = useRef(null);
  const featuresRef = useRef(null);
  const featuredProductsRef = useRef(null);
  const brandPartnersRef = useRef(null);
  const instagramFeedRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: -50,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          delay: 0,
        });
      }

      // Logo animation - icon appears in center, slides left, text appears, icon disappears
      if (logoRef.current) {
        // First show icon in center immediately
        gsap.from(logoRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.5,
          onComplete: () => {
            // Show text immediately when logo starts sliding
            setShowLogoText(true);
            // Then slide icon to left and fade out
            gsap.to(logoRef.current, {
              x: -70,
              opacity: 0,
              duration: 1,
              ease: 'power2.inOut',
              delay: 0, // Start immediately after onComplete
            });
          },
        });
      }

      // Wordmark animation - starts big and lower, then slowly scales down and moves up
      if (wordmarkRef.current) {
        // Start at big size, lower position, and visible immediately
        gsap.set(wordmarkRef.current, { scale: 1.5, y: 200, opacity: 1 });
        
        // Slowly scale down to normal size and move up with smooth animation
        gsap.to(wordmarkRef.current, {
          scale: 1,
          y: -100,
          duration: 2.5,
          ease: 'power2.inOut',
          delay: 0.2,
        });
      }

      // Mountain appears immediately as background (no animation on start)
      // Then scales down after hero image appears

      // Hero image animation - floats up from very bottom, not visible at first
      if (heroImageRef.current) {
        gsap.set(heroImageRef.current, { y: 800 });
        gsap.to(heroImageRef.current, {
          y: 0,
          duration: 2,
          ease: 'power1.inOut',
          delay: 0.8,
        });
      }

      // Mountain animation - starts big, then slowly scales down to normal
      if (mountainRef.current) {
        // Start at big size and visible immediately
        gsap.set(mountainRef.current, { scale: 1.6, opacity: 1 });
        
        // Slowly scale down to normal size with smooth animation
        gsap.to(mountainRef.current, {
          scale: 1,
          duration: 2.5,
          ease: 'power2.inOut',
          delay: 0.3,
        });
      }

      // Decorative text animation
      if (decorativeTextRef.current) {
        gsap.from(decorativeTextRef.current, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.6,
        });
      }

      // Shop button animation
      if (shopButtonRef.current) {
        gsap.from(shopButtonRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.5)',
          delay: 0.8,
        });
      }

      // Parallax effects for hero elements
      // Wordmark scroll effect - scales down when scrolling down, reverses when scrolling up
      if (wordmarkRef.current) {
        gsap.fromTo(wordmarkRef.current,
          { scale: 1 },
          {
            scale: 0.85,
            scrollTrigger: {
              trigger: wordmarkRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      }



      // Hero image - scales down smoothly when scrolling
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          scale: 0.85,
          transformOrigin: "center center",
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      // Decorative text parallax - moves opposite direction
      if (decorativeTextRef.current) {
        gsap.to(decorativeTextRef.current, {
          y: 50,
          scrollTrigger: {
            trigger: decorativeTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      // Mountain parallax - scales up gradually when scrolling down, back to normal when scrolling up
      if (mountainRef.current) {
        gsap.fromTo(mountainRef.current,
          { scale: 1 },
          {
            scale: 1.15,
            scrollTrigger: {
              trigger: mountainRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: 6,
            },
          }
        );
      }

      // Vertical text parallax - moves faster
      if (verticalTextRef.current) {
        gsap.to(verticalTextRef.current, {
          y: -120,
          scrollTrigger: {
            trigger: verticalTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Top right decorative text parallax
      if (topRightTextRef.current) {
        gsap.to(topRightTextRef.current, {
          y: -60,
          scrollTrigger: {
            trigger: topRightTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        });
      }

      // Bottom right decorative text parallax
      if (bottomRightTextRef.current) {
        gsap.to(bottomRightTextRef.current, {
          y: 40,
          scrollTrigger: {
            trigger: bottomRightTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      // Shop button parallax
      if (shopButtonRef.current) {
        gsap.to(shopButtonRef.current, {
          y: 60,
          scrollTrigger: {
            trigger: shopButtonRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // SpiderWeb parallax - moves very slowly for depth effect
      if (spiderWebRef.current) {
        gsap.to(spiderWebRef.current, {
          y: -30,
          scrollTrigger: {
            trigger: spiderWebRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 3,
          },
        });
      }

      // Collection cards animation with optimized scroll trigger
      if (collectionRef.current) {
        gsap.from(collectionRef.current.children, {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: collectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Deal section animation
      if (dealSectionRef.current) {
        gsap.from(dealSectionRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: dealSectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Features section animation
      if (featuresRef.current) {
        gsap.from(featuresRef.current.children, {
          y: 40,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Featured Products section animation
      if (featuredProductsRef.current) {
        gsap.from(featuredProductsRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuredProductsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
        
        gsap.from(featuredProductsRef.current.querySelectorAll('a'), {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuredProductsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Brand Partners section animation
      if (brandPartnersRef.current) {
        gsap.from(brandPartnersRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: brandPartnersRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
        
        gsap.from(brandPartnersRef.current.querySelectorAll('div'), {
          scale: 0.8,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: brandPartnersRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Instagram Feed section animation
      if (instagramFeedRef.current) {
        gsap.from(instagramFeedRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: instagramFeedRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
        
        gsap.from(instagramFeedRef.current.querySelectorAll('a'), {
          scale: 0.9,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: instagramFeedRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .hero-slide-up {
          animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-slide-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-slide-left {
          animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cormorant-garamond {
          font-family: "Cormorant Garamond", serif;
          font-optical-sizing: auto;
          font-weight: 500;
          font-style: normal;
        }
      `}</style>
      <div className="min-h-screen bg-white text-black antialiased" style={{ fontFamily:"'Inter', sans-serif" }}>
      
      {/* ---------------- Header ---------------- */}
      <header ref={headerRef} className="relative z-50 bg-transparent">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-8 sm:py-6 relative">
          <nav className="hidden items-center gap-9 text-sm text-white md:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.authRequired && !auth?.user ? '/login' : item.href}
                className={
                  item.active
                    ? 'border-b border-white pb-1 text-white'
                    : 'pb-1 transition hover:text-white'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/welcome" className="relative">
              <div ref={logoRef} className="h-20 w-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <img src="/images/vesto-logo.png" alt="VESTO Logo" className="h-full w-full object-contain" />
              </div>
              <span 
                className={`text-lg font-black tracking-[0.3em] sm:text-xl text-white transition-all duration-1000 relative z-10 ${
                  showLogoText ? 'opacity-100' : 'opacity-0'
                }`}
              >
                VESTO
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-black sm:gap-6">
            <button aria-label="Search" className="hidden md:block">
              <Icon.Search className="h-[18px] w-[18px]" />
            </button>
            
            {auth?.user ? (
              // Authenticated user menu
              <div className="hidden md:flex items-center gap-4">
                <Link href="/home" className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
                  <Icon.User className="h-[18px] w-[18px]" />
                  <span className="text-sm">Account</span>
                </Link>
                <Link href={auth.user.role === 'admin' ? '/admin/dashboard' : '/buyer/dashboard'} className="text-sm hover:text-gray-700 transition-colors">
                  Dashboard
                </Link>
                <Link href="/logout" method="post" className="text-sm hover:text-gray-700 transition-colors">
                  Logout
                </Link>
              </div>
            ) : (
              // Guest user - show login/register
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="text-sm hover:text-gray-700 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm font-semibold hover:text-gray-700 transition-colors">
                  Create Account
                </Link>
              </div>
            )}
            
            <button aria-label="Cart" className="flex items-center gap-1.5">
              <Icon.Bag className="h-[18px] w-[18px]" />
              <span className="text-sm text-black">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative -mt-20 min-h-[640px] overflow-hidden border-b border-black/10 sm:min-h-[700px] lg:min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.92) 44%, rgba(0,0,0,0.25) 52%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,1) 100%)',
            }}
          />

          <div ref={spiderWebRef} className="absolute inset-0 z-[10] opacity-100">
            <SpiderWeb className="absolute inset-0" alwaysWhite={false} />
          </div>



          {/* ========== HERO 1 CONTAINER ========== */}
            <div className="relative z-[2] mx-auto mt-14 h-[520px] max-w-[1600px] px-4 sm:mt-6 sm:h-[620px] sm:px-8 md:mt-2 md:h-[769px] hero-slide-up">
                
              {/* giant wordmark, behind everything */}
              <h1
                ref={wordmarkRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-[5%] top-[55%] z-0 -translate-y-1/2 select-none whitespace-nowrap text-[28vw] font-black uppercase leading-none tracking-[-0.05em] text-white mix-blend-difference sm:left-[10%] sm:text-[22vw] md:left-[15%] md:text-[16vw]"
              >
                <span className="inline-block">F</span>
                <span className="inline-block">A</span>
                <span className="inline-block">S</span>
                <span className="inline-block">H</span>
                <span className="inline-block text-white">I</span>
                <span className="inline-block text-white">O</span>
                <span className="inline-block text-white">N</span>
              </h1>

              {/* Bottom left decorative text */}
              <div ref={decorativeTextRef} className="absolute left-4 bottom-0 z-10 hidden md:block md:left-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/70">
                  Premium Quality
                </p>
              </div>

              {/* Hero model image */}
              <div ref={heroImageRef} className="absolute bottom-[-250px] left-1/2 z-[50] pointer-events-none -translate-x-1/2 md:left-[430px] md:translate-x-0">
                <img
                  src="/images/hero-model.jpg"
                  alt="Model"
                  className="w-[240px] sm:w-[340px] md:w-[420px] lg:w-[620px]"
                />
                {/* Overlay untuk memblokir SpiderWeb di area gambar */}
                <div className="absolute inset-0 z-[60]" style={{ pointerEvents: 'auto' }} />
              </div>

              {/* Mountain Animation Section */}
              <div ref={mountainRef} className="absolute bottom-0 left-0 right-0 z-[10] pointer-events-none -mb-56 -ml-60">
                <MountainAnimation
                  imageSrc="/images/mountain-full.png"
                  bandCount={8}
                  staggerDelay={0.15}
                  containerHeight="800px"
                  containerWidth="120%"
                />
              </div>



              {/* Vertical text on the right */}
              <div ref={verticalTextRef} className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <p className="text-xs font-black uppercase text-black/70" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '2em' }}>
                  REDEFINE YOUR STYLE
                </p>
              </div>

              {/* Top right decorative text */}
              <div ref={topRightTextRef} className="absolute right-4 top-0 z-10 hidden sm:block md:right-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/40">
                  EST. 2026
                </p>
              </div>

              {/* Bottom right decorative text */}
              <div ref={bottomRightTextRef} className="absolute right-4 bottom-0 z-10 hidden md:block md:right-8">
                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-black/30" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60">
                    Limited Edition
                  </p>
                </div>
              </div>

              {/* Shop Now button */}
              <div ref={shopButtonRef} className="absolute left-4 bottom-6 z-20 sm:left-8 sm:bottom-8">
                <button
                  onClick={() => router.visit('/shop')}
                  className="inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-900 sm:px-6 sm:text-xs cursor-pointer"
                >
                  Shop Now
                  <Icon.ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>


          <div className="relative z-[2] mx-auto max-w-[1600px] px-4 pb-4 pt-2 sm:px-8">
            <p className="max-w-sm text-sm leading-6 text-gray-600">
              Timeless design. Premium quality. Made for everyday confidence.
            </p>
          </div>
        </section>

        {/* ---------------- New Section Below Hero ---------------- */}
        <section ref={featuresRef} className="relative py-24 bg-white">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                  <Icon.Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-[0.2em]">Free Shipping</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Enjoy complimentary shipping on all orders worldwide. No minimum purchase required.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                  <Icon.Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-[0.2em]">Secure Payment</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Shop with confidence using our encrypted payment system. Your data is always protected.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                  <Icon.Refresh className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-[0.2em]">Easy Returns</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Not satisfied? Return your items within 30 days for a full refund. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>

       {/* ---------------- Explore Collection ---------------- */}
<section id="collections" className="border-b border-black/10 py-24 bg-white">
  <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
    <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">
          Explore Collection
        </p>
        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">
          NEW
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-400">
            ARRIVALS
          </span>
        </h2>
      </div>
      <div className="max-w-md">
        <p className="text-gray-600 leading-relaxed">
          Explore our latest collection featuring contemporary designs crafted for the modern individual. Each piece tells a story of quality and style.
        </p>
      </div>
    </div>

    <div ref={collectionRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
      
      {/* Kartu 1: Men - Large card spanning 7 columns */}
      <div className="group relative lg:col-span-7 h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
          <div className="flex justify-between items-start">
            <span className="text-white/40 text-xs font-mono">01/03</span>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
              <Icon.ArrowRight className="h-5 w-5 text-white group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter">MEN</h3>
            <p className="text-white/70 text-lg max-w-sm">Redefining masculinity with contemporary elegance</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* Kartu 2: Women - Tall card spanning 5 columns */}
      <div className="group relative lg:col-span-5 h-[500px] md:h-[600px] overflow-hidden bg-rose-200">
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
          <div className="flex justify-between items-start">
            <span className="text-rose-900/40 text-xs font-mono">02/03</span>
            <div className="w-12 h-12 rounded-full border border-rose-900/20 flex items-center justify-center group-hover:bg-rose-900 group-hover:border-rose-900 transition-all duration-500">
              <Icon.ArrowRight className="h-5 w-5 text-rose-900 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-5xl md:text-7xl font-black text-rose-900 tracking-tighter">WOMEN</h3>
            <p className="text-rose-900/70 text-lg max-w-sm">Where elegance meets everyday sophistication</p>
          </div>
        </div>
      </div>

      {/* Kartu 3: Accessories - Wide card spanning full width */}
      <div className="group relative lg:col-span-12 h-[300px] md:h-[350px] overflow-hidden bg-amber-200">
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
          <div className="space-y-4 mb-8 md:mb-0">
            <span className="text-amber-900/40 text-xs font-mono">03/03</span>
            <h3 className="text-5xl md:text-7xl font-black text-amber-900 tracking-tighter">ACCESSORIES</h3>
            <p className="text-amber-900/70 text-lg max-w-md">Complete your look with carefully curated accessories that define your personal style</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-amber-900/60 text-sm mb-1">Starting from</p>
              <p className="text-3xl font-black text-amber-900">$29</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Icon.ArrowRight className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-4xl font-black text-gray-900">200+</p>
          <p className="text-gray-500 text-sm">New Items</p>
        </div>
        <div className="h-12 w-px bg-gray-300" />
        <div className="text-center">
          <p className="text-4xl font-black text-gray-900">50%</p>
          <p className="text-gray-500 text-sm">Limited Edition</p>
        </div>
      </div>
      <Link href="/shop" className="group inline-flex items-center gap-4 px-10 py-4 bg-black text-white font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all duration-300">
        SHOP ALL COLLECTIONS
        <Icon.ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  </div>
</section>

        {/* ---------------- Deal of the Month + Testimonial + Features ---------------- */}
        <section ref={dealSectionRef} className="border-b border-black/10 py-20">
          <div className="mx-auto grid max-w-[1600px] gap-4 px-4 sm:px-8 lg:grid-cols-[1fr_1fr_0.9fr]">
            {/*
             
          <img src="..." className="h-full w-full object-cover" />
            */}
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl">
             <img src="/images/vesto.png" className="h-full w-full object-cover" />
            </div>

            {/* copy */}
            <div className="flex flex-col justify-center gap-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                On Sale Items
              </p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">Deal of The Month</h2>
              <p className="max-w-sm text-sm leading-7 text-gray-600">
                Get 50% off your order from $100 and above. Check out our collection now.
              </p>
              <Link
                href="/shop"
                className="inline-flex w-fit items-center gap-3 rounded-full bg-black px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-900"
              >
                Discover Now
                <Icon.ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* testimonial + features */}
            <div className="flex flex-col justify-center gap-8 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  What Our Customer Say
                </p>
                <Icon.Quote className="mt-3 h-6 w-6 text-gray-300" />
                <p className="mt-2 text-sm leading-7 text-gray-700">
                  The quality is exceptional and the design is exactly what I was looking for.
                  Definitely coming back!
                </p>
                <div className="mt-4 flex items-center gap-3">
                  {/* Foto: avatar customer (bulat kecil) */}
                  <PhotoPlaceholder label="Foto" className="h-10 w-10 rounded-full text-[8px]" />
                  <div>
                    <p className="text-sm font-semibold">Dimas Aditya</p>
                    <p className="text-xs text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-black/10 pt-6 sm:grid-cols-3">
                {FEATURES.map(({ icon: FIcon, title, subtitle }) => (
                  <div key={title} className="flex flex-col items-start gap-2">
                    <FIcon className="h-5 w-5" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em]">{title}</p>
                    <p className="text-[11px] text-gray-500">{subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Newsletter ---------------- */}
        <section id="journal" className="py-16">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-4 sm:px-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Stay Updated
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-600">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-gray-300 bg-white px-5 py-3.5 text-sm text-gray-900 focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-black px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-900"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* ---------------- Featured Products ---------------- */}
        <section ref={featuredProductsRef} className="border-b border-black/10 py-20">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Featured Products
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Best Sellers</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <Link key={item} href="/shop" className="group">
                  <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-100">
                    <div className="aspect-[3/4] flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Product Image {item}</span>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Product Name {item}</h3>
                  <p className="text-sm text-gray-600">$99.00</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Brand Partners ---------------- */}
        <section ref={brandPartnersRef} className="py-16 bg-gray-50">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-8">
              Trusted by Leading Brands
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {[1, 2, 3, 4, 5].map((brand) => (
                <div key={brand} className="h-12 w-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Brand {brand}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Instagram Feed ---------------- */}
        <section ref={instagramFeedRef} className="border-b border-black/10 py-20">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Follow Us
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">@vesto_official</h2>
            </div>

            <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <a key={item} href="#" className="group relative aspect-square overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Instagram {item}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-black tracking-[0.3em]">VESTO</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
              Minimal fashion essentials with a quiet luxury attitude. Designed for a modern wardrobe.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Categories</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li><a href="/shop/men" className="hover:text-white">Men</a></li>
              <li><a href="/shop/women" className="hover:text-white">Women</a></li>
              <li><a href="/shop/accessories" className="hover:text-white">Accessories</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#journal" className="hover:text-white">Journal</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Support</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Shipping</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-6 text-center text-xs uppercase tracking-[0.25em] text-gray-500 sm:px-8">
          © 2026 VESTO. All rights reserved.
        </div>
      </footer>
    </div>
    </>
  );
}
