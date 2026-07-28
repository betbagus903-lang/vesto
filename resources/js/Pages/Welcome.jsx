import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

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
      <path d="M4.5 20c1.6-3.6 4.6-5.5 7.5-5.5s5.9 1s9 7.5 5.5" strokeLinecap="round" />
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
};

const Stars = ({ className = 'h-3 w-3' }) => (
  <div className="flex gap-0.5 text-black">
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon.Star key={i} className={className} />
    ))}
  </div>
);

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
  { label: 'Shop', href: '/shop' },
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
  const [slide, setSlide] = useState(1);
  const [email, setEmail] = useState('');
  const cartCount = 0;

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
      <div className="min-h-screen bg-white text-black antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ---------------- Header ---------------- */}
      <header className="sticky top-0 z-50 bg-transparent">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3">
            <Link href="/welcome" className="text-lg font-black tracking-[0.3em] sm:text-xl">
              VESTO
            </Link>
            <Link href="/earthwell" className="rounded-full border border-black/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-700 transition hover:border-black hover:text-black sm:text-[11px]">
              Earth Well
            </Link>
          </div>

          <nav className="hidden items-center gap-9 text-sm text-gray-600 md:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={
                  item.active
                    ? 'border-b border-black pb-1 text-black'
                    : 'pb-1 transition hover:text-black'
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-black sm:gap-6">
            <button aria-label="Search" className="hidden md:block">
              <Icon.Search className="h-[18px] w-[18px]" />
            </button>
            <button aria-label="Account" className="hidden md:block">
              <Icon.User className="h-[18px] w-[18px]" />
            </button>
            <button aria-label="Cart" className="flex items-center gap-1.5">
              <Icon.Bag className="h-[18px] w-[18px]" />
              <span className="text-sm text-gray-500">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative -mt-20 min-h-[640px] overflow-hidden border-b border-black/10 sm:min-h-[700px] lg:min-h-screen">
          {slide === 1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.92) 44%, rgba(0,0,0,0.25) 52%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,1) 100%)',
              }}
            />
          )}

          <SpiderWeb className="absolute inset-0 z-[10] opacity-100" alwaysWhite={slide === 2} />

          {slide === 1 && (
            <div className="relative z-[2] mx-auto max-w-[1600px] px-4 pt-10 sm:px-8">
             
            </div>
          )}

          {slide === 2 && (
            <div className="relative z-[2] mx-auto max-w-[1600px] px-4 pt-10 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
            
              </p>
            </div>
          )}

          {/* ========== SHARED CONTROLS RIGHT RAIL ========== */}
          <div className="absolute right-0 top-0 z-20 hidden h-[700px] w-16 flex-col items-center justify-between py-2 lg:flex">
            <div className="flex flex-col items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gray-400">
              <span className={slide === 1 ? 'text-black' : ''}>01</span>
              <div className="h-14 w-px bg-gray-300" />
              <span className={slide === 2 ? 'text-black' : ''}>02</span>
              <span className={slide === 3 ? 'text-black' : ''}>03</span>
            </div>

            <p className="w-24 text-center text-[11px] leading-5 text-gray-500">
             
            </p>

            <div className="flex flex-col gap-2">
              <button
                aria-label="Previous"
                onClick={() => setSlide((s) => (s === 1 ? 3 : s - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:border-black"
              >
                <Icon.ArrowLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next"
                onClick={() => setSlide((s) => (s === 3 ? 1 : s + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
              >
                <Icon.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ========== HERO 1 CONTAINER ========== */}
          {slide === 1 && (
            <div key="hero-1" className="relative z-[2] mx-auto mt-14 h-[520px] max-w-[1600px] px-4 sm:mt-6 sm:h-[620px] sm:px-8 md:mt-2 md:h-[769px] hero-slide-up">
                
              {/* giant wordmark, behind everything */}
              <h1
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[48%] z-0 -translate-y-1/2 select-none whitespace-nowrap text-[28vw] font-black uppercase leading-none tracking-[-0.05em] text-white mix-blend-difference sm:inset-x-4 sm:text-[22vw] md:inset-x-8 md:text-[16vw]"
              >
                <span className="inline-block">V</span>
                <span className="inline-block">E</span>
                <span className="inline-block">S</span>
                <span className="inline-block">T</span>
                <span className="inline-block text-black/70 mix-blend-normal">O</span>
              </h1>

              {/* Top left decorative text */}
              <div className="absolute left-4 top-0 z-10 hidden sm:block md:left-8">
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
                New Collection 2026
              </p>
              </div>

              {/* Bottom left decorative text */}
              <div className="absolute left-4 bottom-0 z-10 hidden md:block md:left-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/70">
                  Premium Quality
                </p>
              </div>

              {/* Hero model image */}
              <div className="absolute bottom-0 left-1/2 z-[40] pointer-events-none -translate-x-1/2 md:left-[430px] md:translate-x-0 md:translate-y-[140px]">
                <img
                  src="/images/hero-model.jpg"
                  alt="Model"
                  className="w-[240px] sm:w-[340px] md:w-[420px] lg:w-[620px]"
                />
                {/* Overlay untuk memblokir SpiderWeb di area gambar */}
                <div className="absolute inset-0 z-[60]" style={{ pointerEvents: 'auto' }} />
              </div>

              {/* floating product card — top left of image */}
              <div className="absolute left-[6%] top-[8%] z-20 hidden w-64 items-center gap-3 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur md:flex">
                <PhotoPlaceholder label="Foto: Essential Tee" className="h-14 w-14 rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Essential Tee</p>
                  <p className="text-xs text-gray-500">IDR 249.000</p>
                  <Stars className="mt-1 h-2.5 w-2.5" />
                </div>
                <button
                  aria-label="Add Essential Tee to cart"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
                >
                  <Icon.Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* floating product card — bottom right of image */}
              <div className="absolute bottom-[30%] right-[2%] z-20 hidden w-64 items-center gap-3 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur md:flex">
                <div className="flex-1">
                  <p className="text-sm font-semibold">Relaxed Pants</p>
                  <p className="text-xs text-gray-500">IDR 399.000</p>
                  <Stars className="mt-1 h-2.5 w-2.5" />
                </div>
                <button
                  aria-label="Add Relaxed Pants to cart"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
                >
                  <Icon.Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Vertical text on the right */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <p className="text-xs font-black uppercase text-black/70" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '2em' }}>
                  REDEFINE YOUR STYLE
                </p>
              </div>

              {/* Top right decorative text */}
              <div className="absolute right-4 top-0 z-10 hidden sm:block md:right-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/40">
                  EST. 2026
                </p>
              </div>

              {/* Bottom right decorative text */}
              <div className="absolute right-4 bottom-0 z-10 hidden md:block md:right-8">
                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-black/30" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60">
                    Limited Edition
                  </p>
                </div>
              </div>

              {/* Shop Now button */}
              <div className="absolute left-4 bottom-6 z-20 sm:left-8 sm:bottom-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-900 sm:px-6 sm:text-xs"
                >
                  Shop Now
                  <Icon.ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* ========== HERO 2 CONTAINER ========== */}
          {slide === 2 && (
            <div key="hero-2" className="relative z-[2] h-[calc(99vh-0px)] -mt-20 overflow-hidden sm:overflow-visible hero-slide-right">
              {/* Background image - FULL WIDTH */}
              <div
                className="pointer-events-none absolute inset-0 z-0 w-full h-full"
                style={{
                  backgroundImage: 'url(/images/hero-2-bg.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  backgroundRepeat: 'no-repeat',
                  height: '120%',
                  top: '-5%',
                }}
              />

              {/* Content wrapper */}
              <div className="relative mx-auto h-full max-w-[1600px] px-4 sm:px-8">
                {/* Label di atas */}
                <div className="absolute left-4 top-6 z-10 sm:left-12">
                  <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-gray-500 sm:text-xs">
                    New Collection 2026
                  </p>
                </div>

                {/* ELEGANCE - serif heading */}
                <h2
                  className="pointer-events-none absolute left-4 top-16 z-10 select-none text-[40px] leading-none text-black sm:left-12 sm:top-24 sm:text-[64px] md:text-[80px] lg:text-[100px]"
                  style={{ fontFamily: 'Georgia, Garamond, serif', fontWeight: '400', letterSpacing: '-0.03em' }}
                >
                  ELEGANCE
                </h2>

                {/* Divider line */}
                <div className="pointer-events-none absolute left-4 top-[120px] z-10 h-px w-12 bg-black sm:left-12 sm:top-56 sm:w-24" />

                {/* NEW ARRIVAL - label */}
                <p className="pointer-events-none absolute left-4 top-[136px] z-10 text-[10px] font-semibold uppercase tracking-widest text-gray-800 sm:left-12 sm:top-64 sm:text-[11px]">
                  New Arrival
                </p>

                {/* Description text */}
                <p className="pointer-events-none absolute left-4 top-[160px] z-10 max-w-[12rem] text-[11px] leading-relaxed text-gray-700 sm:left-12 sm:top-72 sm:max-w-xs sm:text-[14px]">
                  Timeless pieces. Modern silhouettes.<br />
                  Designed to elevate your everyday.
                </p>

                {/* Explore Collection button */}
                <button className="absolute bottom-20 left-4 z-10 border-2 border-black bg-black px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-gray-900 sm:bottom-32 sm:left-12 sm:px-8 sm:py-3 sm:text-[11px]">
                  Explore Collection →
                </button>
              </div>
            </div>
          )}

 {/* ========== HERO 3 CONTAINER ========== */}
          {slide === 3 && (
            <div key="hero-3" className="relative z-[2] min-h-[calc(100vh-0px)] overflow-hidden hero-slide-left" style={{ backgroundColor: '#D5D5D3' }}>
              {/* Background image */}
              <div
                className="pointer-events-none absolute inset-0 z-0 w-full"
                style={{
                  backgroundImage: 'url(/images/hero-3-bg.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  backgroundRepeat: 'no-repeat',
                  height: '111%',
                  top: '-5%',
                }}
              />

              {/* Sorotan Cahaya Terang Miring */}
              <div
                className="pointer-events-none absolute -left-20 top-20 z-10 h-[800px] w-[200px] sm:h-[1500px] sm:w-[300px]"
                style={{
                  background: 'linear-gradient(65deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 40%, transparent 80%)',
                  transform: 'rotate(-40deg)',
                  transformOrigin: 'top right',
                  mixBlendMode: 'screen',
                  filter: 'blur(10px)',
                }}
              />

              {/* Content wrapper */}
              <div className="relative mx-auto h-full max-w-[1600px] px-4 sm:px-8">
                {/* Label */}
                <div className="absolute top-16 left-4 z-20 sm:left-12 md:top-[90px] md:left-[90px]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#6B7280] sm:text-[12px] sm:tracking-[0.45em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    SPRING / SUMMER 2026
                  </p>
                </div>

                {/* Title */}
                <div className="absolute top-28 left-4 z-20 sm:left-12 sm:top-32 md:top-[350px] md:left-[90px]">
                  <h2 className="text-[48px] font-medium leading-[0.95] tracking-[-0.03em] text-black sm:text-[72px] md:text-[100px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', Times, serif" }}>
                    Define<br />
                    <em>Your  </em>
                     Edge.
                  </h2>
                </div>

                {/* Thin line below title */}
                <div className="absolute top-[200px] left-4 z-20 sm:left-12 sm:top-[310px] md:top-[560px] md:left-[90px]">
                  <div className="h-[1px] w-[40px] bg-[#1F1F1F] sm:w-[50px]" />
                </div>

                {/* Description */}
                <div className="absolute top-[220px] left-4 z-20 max-w-[14rem] sm:left-12 sm:top-[340px] sm:max-w-md md:top-[590px] md:left-[90px]">
                  <p className="text-[14px] font-normal leading-relaxed text-[#666] sm:text-[16px] md:text-[18px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Modern essentials. <br />
                  Designed to move with you.
                  </p>
                </div>

                {/* Button */}
                <div className="absolute left-4 bottom-16 z-20 sm:left-12 sm:bottom-24 md:left-[90px] md:bottom-32">
                  <button className="text-[10px] font-semibold uppercase tracking-widest text-black border-b border-black pb-1 transition hover:text-gray-700 sm:text-[11px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    EXPLORE COLLECTION →
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="relative z-[2] mx-auto max-w-[1600px] px-4 pb-4 pt-2 sm:px-8">
            {slide === 1 && (
              <p className="max-w-sm text-sm leading-6 text-gray-600">
                Timeless design. Premium quality. Made for everyday confidence.
              </p>
            )}
          </div>
        </section>

       {/* ---------------- Explore Collection ---------------- */}
<section id="collections" className="border-b border-black/10 py-20">
  <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
        Explore Collection
      </p>
      <Link href="/shop" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-black">
        View all collections
        <Icon.ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      
      {/* Kartu 1: Men */}
      <Link href="/shop/men" className="group relative flex h-56 items-end overflow-hidden bg-gray-100 sm:h-64">
        <img src="/images/mens.png" alt="Men's Wear" className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-90" />
        <div className="relative z-10 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-xl font-black tracking-tight sm:text-2xl">Men's Wear</p>
          <span className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-700">
            Shop Now
            <Icon.ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>

      {/* Kartu 2: Women */}
      <Link href="/shop/women" className="group relative flex h-56 items-end overflow-hidden bg-gray-100 sm:h-64">
        <img src="/images/womens.png" alt="Women's Wear" className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-90" />
        <div className="relative z-10 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-xl font-black tracking-tight sm:text-2xl">Women's Wear</p>
          <span className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-700">
            Shop Now
            <Icon.ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>

      {/* Kartu 3: Accessories */}
      <Link href="/shop/accessories" className="group relative flex h-56 items-end overflow-hidden bg-gray-100 sm:h-64">
        <img src="/images/akso.png" alt="Accessories" className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-90" />
        <div className="relative z-10 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-xl font-black tracking-tight sm:text-2xl">Accessories</p>
          <span className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-700">
            Shop Now
            <Icon.ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>

    </div>
  </div>
</section>

        {/* ---------------- Deal of the Month + Testimonial + Features ---------------- */}
        <section className="border-b border-black/10 py-20">
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
