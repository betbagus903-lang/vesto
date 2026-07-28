import React, { useState, useEffect, useRef } from "react";

/**
 * HydroSlimeMascot
 * Maskot slime 2D bergaya elemental (terinspirasi water/hydro slime).
 *
 * Animasi idle:
 *  - breathing/squish, kedip mata acak, mata melirik acak
 *
 * Interaksi normal (klik/tap):
 *  - kaget -> muncul teks kuning "!?" di atas + lompat kenyal
 *
 * Spam klik 5x (dalam ~3.5 detik):
 *  - slime NGAMBEK: muncul anger mark merah di kiri, badan lompat-lompat
 *    kesal terus-terusan, dia "membelakangi" user (mata disembunyikan)
 *    tapi sesekali mengintip lewat celah (muncul-hilang).
 *
 * Klik lagi saat ngambek:
 *  - dia balik badan ke tengah, lompat 2x, lalu tersenyum (mata jadi "^ ^",
 *    tanpa mulut) beberapa saat, baru kembali ke idle normal.
 *
 * Cara pakai:
 *   <HydroSlimeMascot size={160} />
 */
export default function HydroSlimeMascot({ size = 160, className = "", trackCursor = false }) {
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [startled, setStartled] = useState(false);
  const [jumping, setJumping] = useState(false);

  const blinkTimeoutRef = useRef(null);
  const lookTimeoutRef = useRef(null);
  const startledTimeoutRef = useRef(null);
  const slimeRef = useRef(null);

  const LOOK_RANGE_X = 6;
  const LOOK_RANGE_Y = 5;

  const LOOK_DIRECTIONS = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -0.7, y: -0.7 },
    { x: 0.7, y: -0.7 },
  ];

  // kedip mata acak
  useEffect(() => {
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 3500;
      blinkTimeoutRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        scheduleBlink();
      }, delay);
    }
    scheduleBlink();
    return () => clearTimeout(blinkTimeoutRef.current);
  }, []);

  // lirikan mata acak (nonaktif saat lompat atau trackCursor aktif)
  useEffect(() => {
    if (trackCursor) return; // Skip random look when tracking cursor
    
    function scheduleLook() {
      const delay = 2000 + Math.random() * 2500;
      lookTimeoutRef.current = setTimeout(() => {
        if (!jumping) {
          const dir = LOOK_DIRECTIONS[Math.floor(Math.random() * LOOK_DIRECTIONS.length)];
          setLook({ x: dir.x * LOOK_RANGE_X, y: dir.y * LOOK_RANGE_Y });
          setTimeout(() => setLook({ x: 0, y: 0 }), 550 + Math.random() * 500);
        }
        scheduleLook();
      }, delay);
    }
    scheduleLook();
    return () => clearTimeout(lookTimeoutRef.current);
  }, [jumping, trackCursor]);

  // Cursor tracking
  useEffect(() => {
    if (!trackCursor) return;

    const handleMouseMove = (e) => {
      if (jumping || !slimeRef.current) return;

      const slimeRect = slimeRef.current.getBoundingClientRect();
      const slimeCenterX = slimeRect.left + slimeRect.width / 2;
      const slimeCenterY = slimeRect.top + slimeRect.height / 2;

      const deltaX = e.clientX - slimeCenterX;
      const deltaY = e.clientY - slimeCenterY;

      // Calculate angle and distance
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 300; // Maximum distance for full eye movement

      // Normalize distance (0 to 1)
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      // Calculate eye movement based on cursor position
      const eyeX = (deltaX / distance) * normalizedDistance * 25;
      const eyeY = (deltaY / distance) * normalizedDistance * 25;

      setLook({ x: eyeX, y: eyeY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [trackCursor, jumping]);

  function handlePoke() {
    if (jumping) return;
    
    setLook({ x: 0, y: 0 });
    setStartled(true);
    setJumping(true);
    clearTimeout(startledTimeoutRef.current);
    startledTimeoutRef.current = setTimeout(() => setStartled(false), 750);
  }

  function handleJumpAnimationEnd() {
    setJumping(false);
  }

  return (
    <div
      ref={slimeRef}
      className={`relative inline-block select-none cursor-pointer ${className}`}
      style={{ width: size, height: size * 1.2, overflow: 'visible' }}
      onClick={handlePoke}
      role="button"
      aria-label="Hydro slime mascot"
    >
      <style>{`
        @keyframes slime-breathe {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          50% { transform: scaleX(1.05) scaleY(0.93); }
        }
        @keyframes slime-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3%); }
        }
        .slime-breathe-wrap { animation: slime-bob 3.2s ease-in-out infinite; }
        .slime-breathe-body {
          animation: slime-breathe 3.2s ease-in-out infinite;
          transform-origin: 50% 90%;
        }
        .slime-eye-group {
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slime-jump {
          0%   { transform: translateY(0) scaleX(1) scaleY(1); }
          8%   { transform: translateY(0) scaleX(1.22) scaleY(0.72); }
          22%  { transform: translateY(-38%) scaleX(0.85) scaleY(1.2); }
          34%  { transform: translateY(-42%) scaleX(0.9) scaleY(1.12); }
          46%  { transform: translateY(0) scaleX(1.25) scaleY(0.7); }
          56%  { transform: translateY(-16%) scaleX(0.92) scaleY(1.12); }
          66%  { transform: translateY(-18%) scaleX(0.94) scaleY(1.08); }
          76%  { transform: translateY(0) scaleX(1.15) scaleY(0.82); }
          88%  { transform: translateY(-5%) scaleX(0.97) scaleY(1.05); }
          100% { transform: translateY(0) scaleX(1) scaleY(1); }
        }
        .slime-jump-active {
          animation: slime-jump 0.9s cubic-bezier(0.33, 0, 0.2, 1) 1;
          transform-origin: 50% 100%;
        }

        @keyframes slime-bubble-pop {
          0%   { transform: translate(-50%, 0) scale(0); opacity: 0; }
          55%  { transform: translate(-50%, -6px) scale(1.15); opacity: 1; }
          75%  { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -4px) scale(0.9); opacity: 0; }
        }
        .slime-bubble { animation: slime-bubble-pop 0.75s ease-out 1; }
      `}</style>

      {/* teks kaget */}
      {startled && (
        <div
          className="slime-bubble absolute left-1/2 z-10 text-center"
          style={{
            top: -size * 0.12,
            fontSize: size * 0.15,
            fontWeight: 800,
            color: "#ffd23f",
            textShadow: "0 1px 3px rgba(0,0,0,0.25)",
            lineHeight: 1,
          }}
        >
          !
        </div>
      )}

      <div
        className={jumping ? "slime-jump-active" : ""}
        onAnimationEnd={handleJumpAnimationEnd}
      >
        <div className="slime-breathe-wrap w-full h-full">
        <svg
          viewBox="0 0 220 190"
          width={size}
          height={size * 0.85}
          className="slime-breathe-body"
        >
          <defs>
            <linearGradient id="hBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f7fa3" />
              <stop offset="40%" stopColor="#2f9fc0" />
              <stop offset="75%" stopColor="#3fc7e3" />
              <stop offset="100%" stopColor="#bff2fa" />
            </linearGradient>
            <linearGradient id="hRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdf9ea" />
              <stop offset="100%" stopColor="#eafcff" />
            </linearGradient>
            <radialGradient id="hShine" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <clipPath id="bodyClip">
              <path d="M110 12
                       C 165 12, 208 55, 208 105
                       C 208 150, 168 178, 110 178
                       C 52 178, 12 150, 12 105
                       C 12 55, 55 12, 110 12 Z" />
            </clipPath>
          </defs>

          {/* Badan */}
          <g
            className="slime-turn-away"
            style={{
              transform: "rotate(0deg) translate(0px, 0px)",
            }}
          >
            <ellipse cx="110" cy="183" rx="70" ry="7" fill="#0b3a52" opacity="0.15" />

            <path
              d="M110 4
                 C 170 4, 216 52, 216 105
                 C 216 154, 172 186, 110 186
                 C 48 186, 4 154, 4 105
                 C 4 52, 50 4, 110 4 Z"
              fill="url(#hRim)"
            />

            <path
              d="M110 12
                 C 165 12, 208 55, 208 105
                 C 208 150, 168 178, 110 178
                 C 52 178, 12 150, 12 105
                 C 12 55, 55 12, 110 12 Z"
              fill="url(#hBody)"
            />

            <g clipPath="url(#bodyClip)" opacity="0.55">
              <path d="M20 55 Q 55 20, 100 35 Q 130 15, 165 40 Q 190 55, 195 85 L 190 90 Q 150 60, 115 75 Q 80 50, 45 70 Q 20 75, 15 60 Z" fill="#2a5f7d" />
              <path d="M60 30 Q 90 10, 120 25 Q 100 40, 75 45 Z" fill="#1f4a63" opacity="0.7" />
              <path d="M140 25 Q 170 30, 180 55 Q 190 55, 150 45 Z" fill="#1f4a63" opacity="0.6" />
              <path d="M25 70 Q 45 60, 60 72 Q 45 85, 28 82 Z" fill="#2a5f7d" opacity="0.5" />
            </g>

            <ellipse cx="65" cy="55" rx="34" ry="22" fill="url(#hShine)" />

            <path
              d="M25 130 Q 65 145, 110 138 T 195 128"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              opacity="0.2"
              strokeLinecap="round"
            />

            {/* MATA versi normal / lirik */}
            <g
              className="slime-eye-group"
              style={{ transform: `translate(${look.x}px, ${look.y}px)` }}
            >
              <ellipse
                cx="83" cy="120"
                rx={startled ? 13 : 11}
                ry={blink ? 1.5 : startled ? 27 : 24}
                fill="#eafcff" stroke="#2f8fb0" strokeWidth="3"
              />
              <ellipse
                cx="137" cy="120"
                rx={startled ? 13 : 11}
                ry={blink ? 1.5 : startled ? 27 : 24}
                fill="#eafcff" stroke="#2f8fb0" strokeWidth="3"
              />
            </g>
          </g>
        </svg>
        </div>
      </div>
    </div>
  );
}
