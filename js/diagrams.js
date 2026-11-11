/**
 * Procedural & Curated SVG Diagram Visualizer
 * Menghasilkan visualisasi siluet estetik Fan (Biru) & Idol/Oshi (Pink)
 * Sangat ringan, vector murni, tanpa dependensi gambar eksternal.
 */

export function renderPoseDiagram(diagramType, mode = "cute") {
  const fanColor = "#4A7CFF";
  const idolColor = "#FF5D8F";
  const accentColor = mode === "fun" ? "#FF9A3C" : (mode === "meme" ? "#9C27B0" : "#FF4081");

  // Base SVG wrapper
  const svgOpen = `<svg viewBox="0 0 320 200" class="pose-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#60A5FA" />
        <stop offset="100%" stop-color="#2563EB" />
      </linearGradient>
      <linearGradient id="idolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#F472B6" />
        <stop offset="100%" stop-color="#DB2777" />
      </linearGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <!-- Background stage platform -->
    <ellipse cx="160" cy="180" rx="130" ry="14" fill="rgba(0,0,0,0.06)" />
    <!-- Center divider subtle indicator (simulasi SOP/jarak) -->
    <line x1="160" y1="50" x2="160" y2="175" stroke="rgba(0,0,0,0.08)" stroke-width="1.5" stroke-dasharray="4 4" />
    <text x="160" y="42" font-size="9" text-anchor="middle" fill="#9CA3AF" font-family="sans-serif">AREA CHEKI</text>
  `;

  const svgClose = `
    <!-- Label Kiri (Fan) & Kanan (Oshi) -->
    <rect x="35" y="172" width="60" height="18" rx="9" fill="rgba(59,130,246,0.12)" />
    <text x="65" y="184" font-size="10" text-anchor="middle" font-weight="bold" fill="#2563EB" font-family="sans-serif">YOU (FAN)</text>
    
    <rect x="225" y="172" width="60" height="18" rx="9" fill="rgba(236,72,153,0.12)" />
    <text x="255" y="184" font-size="10" text-anchor="middle" font-weight="bold" fill="#DB2777" font-family="sans-serif">OSHI (IDOL)</text>
  </svg>`;

  let content = "";

  switch (diagramType) {
    case "half-heart":
      content = `
        <!-- Floating central heart complete -->
        <path d="M 160 85 C 160 70 145 60 135 70 C 120 85 160 115 160 115 C 160 115 200 85 185 70 C 175 60 160 70 160 85 Z" fill="#FF4081" opacity="0.85" filter="url(#softGlow)" />
        <text x="160" y="75" font-size="16" text-anchor="middle">💖</text>
        <!-- Fan (Left) making half heart -->
        <circle cx="85" cy="80" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <path d="M 100 115 Q 125 75 148 88" stroke="#2563EB" stroke-width="7" stroke-linecap="round" fill="none" />
        <circle cx="150" cy="88" r="5" fill="#2563EB" />
        
        <!-- Idol (Right) completing half heart -->
        <circle cx="235" cy="80" r="18" fill="url(#idolGrad)" />
        <!-- Idol hair twin ribbons -->
        <path d="M 215 75 Q 210 95 214 110" stroke="#DB2777" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M 255 75 Q 260 95 256 110" stroke="#DB2777" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <path d="M 220 115 Q 195 75 172 88" stroke="#DB2777" stroke-width="7" stroke-linecap="round" fill="none" />
        <circle cx="170" cy="88" r="5" fill="#DB2777" />
      `;
      break;

    case "cat-paws":
      content = `
        <!-- Floating paws sparkles -->
        <text x="160" y="80" font-size="20" text-anchor="middle">🐾</text>
        <text x="100" y="60" font-size="14">✨</text>
        <text x="220" y="60" font-size="14">✨</text>
        <!-- Fan with paws -->
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <path d="M 75 120 Q 80 100 88 100" stroke="#2563EB" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M 95 120 Q 90 100 82 100" stroke="#2563EB" stroke-width="6" stroke-linecap="round" fill="none" />
        <circle cx="85" cy="98" r="7" fill="#60A5FA" />
        <text x="85" y="102" font-size="8" text-anchor="middle">🐾</text>
        <!-- Idol with paws + neko ears -->
        <path d="M 222 72 L 227 60 L 233 72 Z" fill="#DB2777" />
        <path d="M 237 72 L 243 60 L 248 72 Z" fill="#DB2777" />
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <circle cx="225" cy="98" r="7" fill="#F472B6" />
        <circle cx="245" cy="98" r="7" fill="#F472B6" />
        <text x="225" y="102" font-size="8" text-anchor="middle">🐾</text>
        <text x="245" y="102" font-size="8" text-anchor="middle">🐾</text>
      `;
      break;

    case "cheek-poke":
      content = `
        <text x="160" y="90" font-size="18" text-anchor="middle">👉 🥟 👈</text>
        <!-- Fan poking own cheek -->
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <path d="M 100 125 Q 102 95 95 90" stroke="#2563EB" stroke-width="6" stroke-linecap="round" fill="none" />
        <!-- Idol poking own cheek -->
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <path d="M 220 125 Q 218 95 225 90" stroke="#DB2777" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "bunny-ears":
      content = `
        <!-- Fan Bunny ears -->
        <line x1="80" y1="67" x2="75" y2="45" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        <line x1="90" y1="67" x2="95" y2="45" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        
        <!-- Idol Bunny ears -->
        <line x1="230" y1="67" x2="225" y2="45" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
        <line x1="240" y1="67" x2="245" y2="45" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <text x="160" y="80" font-size="22" text-anchor="middle">🐰</text>
      `;
      break;

    case "gyaru-peace":
      content = `
        <text x="160" y="85" font-size="20" text-anchor="middle">✌️</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <line x1="95" y1="120" x2="115" y2="125" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <line x1="225" y1="120" x2="205" y2="125" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "chin-flower":
      content = `
        <text x="160" y="70" font-size="22" text-anchor="middle">🌸</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <path d="M 75 125 Q 85 105 85 103" stroke="#2563EB" stroke-width="6" stroke-linecap="round" fill="none" />
        
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <path d="M 225 125 Q 235 105 235 103" stroke="#DB2777" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "finger-heart":
      content = `
        <text x="110" y="90" font-size="16">🫰</text>
        <text x="200" y="90" font-size="16">🫰</text>
        <text x="160" y="75" font-size="16" text-anchor="middle">💕</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <line x1="95" y1="125" x2="110" y2="105" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <line x1="225" y1="125" x2="210" y2="105" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "big-heart":
      content = `
        <!-- Big Arch Heart over head -->
        <path d="M 90 90 Q 95 35 160 50 Q 225 35 230 90" stroke="#FF4081" stroke-width="6" fill="none" stroke-dasharray="6 3" />
        <text x="160" y="52" font-size="20" text-anchor="middle">❤️</text>
        <circle cx="85" cy="95" r="18" fill="url(#fanGrad)" />
        <path d="M 65 150 C 65 115 105 115 105 150 Z" fill="url(#fanGrad)" />
        <path d="M 95 120 Q 120 70 145 55" stroke="#2563EB" stroke-width="6" stroke-linecap="round" fill="none" />
        
        <circle cx="235" cy="95" r="18" fill="url(#idolGrad)" />
        <path d="M 215 150 C 215 115 255 115 255 150 Z" fill="url(#idolGrad)" />
        <path d="M 225 120 Q 200 70 175 55" stroke="#DB2777" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "bodyguard":
      content = `
        <!-- Fan Bodyguard pose -->
        <circle cx="85" cy="80" r="18" fill="url(#fanGrad)" />
        <!-- Sunglasses on fan -->
        <rect x="75" y="77" width="20" height="7" rx="3" fill="#111827" />
        <path d="M 65 145 C 65 105 105 105 105 145 Z" fill="url(#fanGrad)" />
        <!-- Hand to ear earpiece -->
        <path d="M 95 120 Q 105 90 98 80" stroke="#2563EB" stroke-width="6" stroke-linecap="round" fill="none" />
        <text x="85" y="60" font-size="12" text-anchor="middle">🕶️ 🔒</text>
        
        <!-- Idol VIP waving -->
        <circle cx="235" cy="80" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 105 255 105 255 145 Z" fill="url(#idolGrad)" />
        <path d="M 245 120 Q 265 95 260 80" stroke="#DB2777" stroke-width="6" stroke-linecap="round" fill="none" />
        <text x="245" y="60" font-size="14" text-anchor="middle">👑 ✨</text>
      `;
      break;

    case "arm-wrestling":
      content = `
        <!-- Table -->
        <rect x="120" y="125" width="80" height="10" rx="3" fill="#4B5563" />
        <!-- Arms locked in wrestle -->
        <line x1="145" y1="125" x2="155" y2="105" stroke="#2563EB" stroke-width="7" stroke-linecap="round" />
        <line x1="175" y1="125" x2="165" y2="105" stroke="#DB2777" stroke-width="7" stroke-linecap="round" />
        <circle cx="160" cy="105" r="7" fill="#F59E0B" />
        <text x="160" y="90" font-size="16" text-anchor="middle">💥</text>
        
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "pinky-promise":
      content = `
        <!-- Extended Pinkies -->
        <line x1="100" y1="110" x2="150" y2="105" stroke="#2563EB" stroke-width="5" stroke-linecap="round" />
        <line x1="220" y1="110" x2="170" y2="105" stroke="#DB2777" stroke-width="5" stroke-linecap="round" />
        <text x="160" y="95" font-size="18" text-anchor="middle">🤙✨🤙</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "lightstick-cross":
      content = `
        <!-- Glowing Lightsticks in X -->
        <line x1="120" y1="135" x2="190" y2="75" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" filter="url(#softGlow)" />
        <line x1="200" y1="135" x2="130" y2="75" stroke="#F472B6" stroke-width="6" stroke-linecap="round" filter="url(#softGlow)" />
        <text x="160" y="70" font-size="18" text-anchor="middle">⚔️</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "jojo":
      content = `
        <!-- JoJo Menacing kanji ゴゴゴ -->
        <text x="40" y="65" font-size="20" font-weight="bold" fill="#7E57C2">ゴ</text>
        <text x="60" y="50" font-size="24" font-weight="bold" fill="#7E57C2">ゴ</text>
        <text x="260" y="65" font-size="20" font-weight="bold" fill="#7E57C2">ゴ</text>
        <text x="280" y="50" font-size="24" font-weight="bold" fill="#7E57C2">ゴ</text>
        <!-- Dramatic tilted pose -->
        <g transform="rotate(-10 85 100)">
          <circle cx="85" cy="80" r="18" fill="url(#fanGrad)" />
          <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
          <line x1="95" y1="110" x2="85" y2="75" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        </g>
        <g transform="rotate(10 235 100)">
          <circle cx="235" cy="80" r="18" fill="url(#idolGrad)" />
          <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
          <line x1="225" y1="110" x2="235" y2="75" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
        </g>
      `;
      break;

    case "kamehameha":
      content = `
        <!-- Energy blasts meeting -->
        <circle cx="160" cy="100" r="14" fill="#FBBF24" filter="url(#softGlow)" />
        <line x1="100" y1="105" x2="155" y2="100" stroke="#60A5FA" stroke-width="8" stroke-linecap="round" />
        <line x1="220" y1="105" x2="165" y2="100" stroke="#F472B6" stroke-width="8" stroke-linecap="round" />
        <text x="160" y="80" font-size="16" text-anchor="middle">💥</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "crying-fan":
      content = `
        <!-- Fan praying / sobbing in happiness -->
        <text x="95" y="70" font-size="16">😭🙏</text>
        <circle cx="85" cy="95" r="18" fill="url(#fanGrad)" />
        <path d="M 65 150 C 65 120 105 120 105 150 Z" fill="url(#fanGrad)" />
        <path d="M 85 125 L 85 110" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        
        <!-- Idol smug / hands on hips -->
        <text x="235" y="60" font-size="16" text-anchor="middle">😏✨</text>
        <circle cx="235" cy="80" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 105 255 105 255 145 Z" fill="url(#idolGrad)" />
        <path d="M 218 115 L 208 125" stroke="#DB2777" stroke-width="5" stroke-linecap="round" />
        <path d="M 252 115 L 262 125" stroke="#DB2777" stroke-width="5" stroke-linecap="round" />
      `;
      break;

    case "spiderman":
      content = `
        <!-- Spiderman pointing at each other -->
        <text x="160" y="85" font-size="22" text-anchor="middle">👉 👈</text>
        <circle cx="85" cy="90" r="18" fill="url(#fanGrad)" />
        <path d="M 65 150 C 65 115 105 115 105 150 Z" fill="url(#fanGrad)" />
        <line x1="95" y1="120" x2="145" y2="105" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        
        <circle cx="235" cy="90" r="18" fill="url(#idolGrad)" />
        <path d="M 215 150 C 215 115 255 115 255 150 Z" fill="url(#idolGrad)" />
        <line x1="225" y1="120" x2="175" y2="105" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "kabedon":
      content = `
        <!-- Acrylic barrier in middle -->
        <rect x="155" y="30" width="10" height="145" rx="3" fill="rgba(56,189,248,0.25)" stroke="#38BDF8" stroke-width="1.5" />
        <text x="160" y="24" font-size="8" text-anchor="middle" fill="#0284C7">PARTISI AKRILIK</text>
        <!-- Fan hand on acrylic -->
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <line x1="95" y1="110" x2="155" y2="85" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        <text x="140" y="75" font-size="12">💥ドン!</text>
        <!-- Idol blushing against acrylic -->
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <text x="235" y="70" font-size="14" text-anchor="middle">😳💓</text>
      `;
      break;

    default:
      // Default cute synchronized pose
      content = `
        <text x="160" y="75" font-size="20" text-anchor="middle">⭐</text>
        <circle cx="85" cy="85" r="18" fill="url(#fanGrad)" />
        <path d="M 65 145 C 65 110 105 110 105 145 Z" fill="url(#fanGrad)" />
        <line x1="95" y1="120" x2="120" y2="100" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
        
        <circle cx="235" cy="85" r="18" fill="url(#idolGrad)" />
        <path d="M 215 145 C 215 110 255 110 255 145 Z" fill="url(#idolGrad)" />
        <line x1="225" y1="120" x2="200" y2="100" stroke="#DB2777" stroke-width="6" stroke-linecap="round" />
      `;
      break;
  }

  return svgOpen + content + svgClose;
}
