import * as THREE from 'three';

/**
 * ====================================================================
 * DATA BINTANG & RASI BINTANG (real, koordinat astronomi asli)
 * ====================================================================
 * ra  = Right Ascension, dalam JAM (0-24) — semacam "longitude" langit
 * dec = Declination, dalam DERAJAT (-90 sampai +90) — semacam "latitude" langit
 * mag = magnitude (kecerlangan). PENTING: makin KECIL angkanya, makin
 *       TERANG bintangnya (kebalik dari intuisi biasa). Sirius = -1.46
 *       (paling terang di langit), bintang paling redup ~+6.
 *
 * Catatan: nilai di bawah ini didekati dari memori, cukup akurat buat
 * visualisasi/edukasi, TAPI bukan presisi observatorium. Kalau nanti
 * butuh akurasi tinggi, ganti dengan katalog resmi (Hipparcos/Yale
 * Bright Star Catalogue) dalam format JSON.
 */

const STARS = {
  // ---------- Ursa Major (Big Dipper / Biduk) ----------
  dubhe:   { ra: 11.062, dec: 61.75,  mag: 1.79 },
  merak:   { ra: 11.031, dec: 56.38,  mag: 2.37 },
  phecda:  { ra: 11.897, dec: 53.69,  mag: 2.44 },
  megrez:  { ra: 12.257, dec: 57.03,  mag: 3.31 },
  alioth:  { ra: 12.900, dec: 55.96,  mag: 1.77 },
  mizar:   { ra: 13.398, dec: 54.93,  mag: 2.23 },
  alkaid:  { ra: 13.792, dec: 49.31,  mag: 1.86 },

  // ---------- Orion ----------
  betelgeuse: { ra: 5.919, dec: 7.41,   mag: 0.50 },
  bellatrix:  { ra: 5.418, dec: 6.35,   mag: 1.64 },
  mintaka:    { ra: 5.533, dec: -0.30,  mag: 2.23 },
  alnilam:    { ra: 5.604, dec: -1.20,  mag: 1.69 },
  alnitak:    { ra: 5.679, dec: -1.94,  mag: 1.74 },
  saiph:      { ra: 5.796, dec: -9.67,  mag: 2.06 },
  rigel:      { ra: 5.242, dec: -8.20,  mag: 0.13 },

  // ---------- Crux (Salib Selatan) ----------
  acrux:    { ra: 12.443, dec: -63.10, mag: 0.77 },
  mimosa:   { ra: 12.795, dec: -59.69, mag: 1.25 },
  gacrux:   { ra: 12.519, dec: -57.11, mag: 1.63 },
  deltaCru: { ra: 12.252, dec: -58.75, mag: 2.79 },

  // ---------- Cassiopeia (bentuk W) ----------
  schedar:  { ra: 0.675,  dec: 56.54,  mag: 2.24 },
  caph:     { ra: 0.153,  dec: 59.15,  mag: 2.28 },
  gammaCas: { ra: 0.945,  dec: 60.72,  mag: 2.47 },
  ruchbah:  { ra: 1.430,  dec: 60.24,  mag: 2.68 },
  segin:    { ra: 1.906,  dec: 63.67,  mag: 3.35 },

  // ---------- Cygnus (Salib Utara) ----------
  deneb:    { ra: 20.690, dec: 45.28,  mag: 1.25 },
  sadr:     { ra: 20.371, dec: 40.26,  mag: 2.23 },
  gienah:   { ra: 20.770, dec: 33.97,  mag: 2.46 },
  deltaCyg: { ra: 19.749, dec: 45.13,  mag: 2.87 },
  albireo:  { ra: 19.512, dec: 27.96,  mag: 3.18 },

  // ---------- Scorpius ----------
  antares:  { ra: 16.490, dec: -26.43, mag: 0.96 },
  dschubba: { ra: 16.006, dec: -22.62, mag: 2.29 },
  sargas:   { ra: 17.622, dec: -42.99, mag: 1.87 },
  shaula:   { ra: 17.560, dec: -37.10, mag: 1.63 },
  lesath:   { ra: 17.513, dec: -37.30, mag: 2.70 },
};

// pasangan bintang yang digaris buat bentuk rasi (stick figure)
const CONSTELLATION_LINES = {
  'Ursa Major': [
    ['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez'],
    ['megrez', 'dubhe'], ['megrez', 'alioth'], ['alioth', 'mizar'],
    ['mizar', 'alkaid'],
  ],
  Orion: [
    ['betelgeuse', 'bellatrix'], ['bellatrix', 'mintaka'],
    ['mintaka', 'alnilam'], ['alnilam', 'alnitak'],
    ['alnitak', 'saiph'], ['saiph', 'rigel'], ['rigel', 'mintaka'],
    ['betelgeuse', 'alnitak'],
  ],
  Crux: [
    ['acrux', 'gacrux'], ['mimosa', 'deltaCru'],
  ],
  Cassiopeia: [
    ['caph', 'schedar'], ['schedar', 'gammaCas'],
    ['gammaCas', 'ruchbah'], ['ruchbah', 'segin'],
  ],
  Cygnus: [
    ['deneb', 'sadr'], ['sadr', 'gienah'],
    ['sadr', 'deltaCyg'], ['deltaCyg', 'albireo'],
  ],
  Scorpius: [
    ['dschubba', 'antares'], ['antares', 'sargas'],
    ['sargas', 'shaula'], ['shaula', 'lesath'],
  ],
};

/**
 * Convert koordinat astronomi (RA jam, Dec derajat) jadi posisi 3D
 * di permukaan bola langit dengan radius tertentu.
 */
function raDecToVector3(raHours, decDeg, radius) {
  const raRad = (raHours / 24) * Math.PI * 2;
  const decRad = THREE.MathUtils.degToRad(decDeg);

  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

/**
 * Bikin seluruh sistem bintang + garis rasi, dikembalikan sebagai
 * satu THREE.Group biar gampang di-toggle show/hide atau dibuang
 * total (dispose) pas pindah mode/scene.
 *
 * @param {number} radius - jarak bintang dari pusat (harus JAUH lebih
 *   besar dari radius globe/bulan kita, biar gak numpuk sama objek lain)
 */
export function createStarSky(radius = 80) {
  const group = new THREE.Group();
  group.name = 'StarSky';

  // ---------- titik-titik bintang ----------
  const starNames = Object.keys(STARS);
  const positions = new Float32Array(starNames.length * 3);
  const sizes = new Float32Array(starNames.length);

  starNames.forEach((name, i) => {
    const star = STARS[name];
    const pos = raDecToVector3(star.ra, star.dec, radius);
    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;

    // magnitude kecil = terang = titik lebih besar. Rumus dibalik & di-skala.
    sizes[i] = THREE.MathUtils.mapLinear(star.mag, -1.5, 3.5, 3.5, 1.0);
  });

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // pakai shader sederhana biar tiap titik bisa beda ukuran (PointsMaterial
  // bawaan cuma bisa 1 ukuran buat semua titik)
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(0xffffff) } },
    vertexShader: `
      attribute float size;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        // bikin titik bulat lembut, bukan kotak
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(color, glow);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const starPoints = new THREE.Points(starGeometry, starMaterial);
  group.add(starPoints);

  // ---------- garis-garis rasi bintang ----------
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6fa8dc,
    transparent: true,
    opacity: 0.45,
  });

  Object.entries(CONSTELLATION_LINES).forEach(([constellationName, pairs]) => {
    const linePositions = [];
    pairs.forEach(([starA, starB]) => {
      const a = raDecToVector3(STARS[starA].ra, STARS[starA].dec, radius);
      const b = raDecToVector3(STARS[starB].ra, STARS[starB].dec, radius);
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    lineSegments.name = constellationName;
    group.add(lineSegments);
  });

  return group;
}

/**
 * Buang semua geometry/material dari star sky biar gak nyisa di GPU
 * memory pas mode-nya ditutup (WAJIB dipanggil pas pindah scene).
 */
export function disposeStarSky(group) {
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  });
}
