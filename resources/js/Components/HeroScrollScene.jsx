import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * HeroScrollScene
 * Scroll-scrubbed image sequence untuk hero landing page VESTO.
 *
 * Cara pakai di LandingPage.jsx:
 *   import HeroScrollScene from "@/Components/HeroScrollScene";
 *   import photo1 from "@/assets/hero/cowo-jalan.jpg";
 *   import photo2 from "@/assets/hero/cewe-jalan.jpg";
 *   import photo3 from "@/assets/hero/cewe-jatuh-mulai.jpg";
 *   import photo4 from "@/assets/hero/cewe-jatuh-final.jpg";
 *
 *   <HeroScrollScene photo1={photo1} photo2={photo2} photo3={photo3} photo4={photo4} />
 *
 * Note: butuh `framer-motion` sudah terinstall (npm install framer-motion).
 */
export default function HeroScrollScene({ photo1, photo2, photo3, photo4 }) {
  const containerRef = useRef(null);

  // scrollYProgress: 0 saat section mulai masuk viewport, 1 saat section selesai discroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tiap foto punya rentang scroll sendiri, dengan overlap dikit biar crossfade-nya smooth
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const opacity2 = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.45, 0.55],
    [0, 1, 1, 0]
  );
  const opacity3 = useTransform(
    scrollYProgress,
    [0.45, 0.55, 0.7, 0.8],
    [0, 1, 1, 0]
  );
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);

  // Efek "kamera zoom in" ke pose jatuh final
  const scale4 = useTransform(scrollYProgress, [0.8, 1], [1, 1.15]);

  // Sedikit gerakan vertikal biar nggak statis (parallax halus)
  const y1 = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.55], [0, -40]);
  const y3 = useTransform(scrollYProgress, [0.45, 0.8], [0, -40]);

  return (
    // Tinggi 400vh = "ruang scroll" untuk 4 foto. Makin besar makin lambat transisinya.
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <motion.img
          src={photo1}
          alt="Cowo jalan"
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.img
          src={photo2}
          alt="Cewe jalan"
          style={{ opacity: opacity2, y: y2 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.img
          src={photo3}
          alt="Cewe mulai jatuh"
          style={{ opacity: opacity3, y: y3 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.img
          src={photo4}
          alt="Cewe pose jatuh final"
          style={{ opacity: opacity4, scale: scale4 }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay gradient bawah, biar teks/CTA di atas foto tetap kebaca */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    </div>
  );
}
