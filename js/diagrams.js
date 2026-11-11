// Generates vector schematic diagrams for Fan (left) and Idol/Oshi (right) stances.

export function renderPoseDiagram(diagramType, mode = "cute") {
  const accentColor =
    mode === "fun" ? "#F59E0B" : mode === "meme" ? "#A78BFA" : "#F43F5E";

  const svgOpen = `<svg viewBox="0 0 320 240" class="pose-svg" role="img" aria-label="Skema posisi Fan dan Oshi" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#60A5FA" />
        <stop offset="100%" stop-color="#2563EB" />
      </linearGradient>
      <linearGradient id="idolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#F472B6" />
        <stop offset="100%" stop-color="#DB2777" />
      </linearGradient>
    </defs>
    <rect x="12" y="12" width="296" height="216" rx="4" fill="#18181B" stroke="rgba(255,255,255,0.14)" stroke-width="1" />
    <path d="M 24 36 L 24 24 L 36 24 M 284 24 L 296 24 L 296 36 M 24 204 L 24 216 L 36 216 M 284 216 L 296 216 L 296 204" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="none" />
    <ellipse cx="160" cy="186" rx="118" ry="12" fill="rgba(255,255,255,0.05)" />
    <line x1="160" y1="42" x2="160" y2="182" stroke="rgba(255,255,255,0.16)" stroke-width="1" stroke-dasharray="4 4" />
    <text x="160" y="32" font-size="8" letter-spacing="1.5" text-anchor="middle" fill="#A1A1AA" font-family="monospace">VIEWFINDER // SKEMA POSISI</text>
  `;

  const svgClose = `
    <rect x="38" y="192" width="84" height="20" rx="3" fill="rgba(37,99,235,0.22)" stroke="#3B82F6" stroke-width="1" />
    <text x="80" y="205" font-size="9" text-anchor="middle" font-weight="700" fill="#93C5FD" font-family="sans-serif">KAMU (FAN)</text>
    <rect x="198" y="192" width="84" height="20" rx="3" fill="rgba(219,39,119,0.22)" stroke="#EC4899" stroke-width="1" />
    <text x="240" y="205" font-size="9" text-anchor="middle" font-weight="700" fill="#F9A8D4" font-family="sans-serif">OSHI (IDOL)</text>
  </svg>`;

  const heartVector = `<path d="M 160 88 C 160 74 145 64 135 74 C 122 88 160 114 160 114 C 160 114 198 88 185 74 C 175 64 160 74 160 88 Z" fill="${accentColor}" opacity="0.9" />`;

  let content = "";

  switch (diagramType) {
    case "half-heart":
      content = `
        ${heartVector}
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <path d="M 100 130 Q 125 84 148 96" stroke="#60A5FA" stroke-width="7" stroke-linecap="round" fill="none" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
        <path d="M 220 130 Q 195 84 172 96" stroke="#F472B6" stroke-width="7" stroke-linecap="round" fill="none" />
      `;
      break;

    case "bunny-ears":
      content = `
        <line x1="80" y1="72" x2="74" y2="48" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <line x1="90" y1="72" x2="96" y2="48" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <line x1="230" y1="72" x2="224" y2="48" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
        <line x1="240" y1="72" x2="246" y2="48" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "chin-flower":
      content = `
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <path d="M 70 136 Q 82 114 82 110" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M 100 136 Q 88 114 88 110" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" fill="none" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
        <path d="M 220 136 Q 232 114 232 110" stroke="#F472B6" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M 250 136 Q 238 114 238 110" stroke="#F472B6" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "gyaru-peace":
      content = `
        <rect x="132" y="70" width="56" height="42" rx="3" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="6 3" />
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <line x1="98" y1="130" x2="128" y2="96" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
        <line x1="222" y1="130" x2="192" y2="108" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "big-heart":
      content = `
        <path d="M 90 100 Q 95 42 160 58 Q 225 42 230 100" stroke="${accentColor}" stroke-width="4" fill="none" stroke-dasharray="6 4" />
        ${heartVector}
        <circle cx="85" cy="102" r="18" fill="url(#fanGrad)" />
        <path d="M 63 168 C 63 130 107 130 107 168 Z" fill="url(#fanGrad)" />
        <path d="M 95 130 Q 120 76 146 62" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" fill="none" />
        <circle cx="235" cy="102" r="18" fill="url(#idolGrad)" />
        <path d="M 213 168 C 213 130 257 130 257 168 Z" fill="url(#idolGrad)" />
        <path d="M 225 130 Q 200 76 174 62" stroke="#F472B6" stroke-width="6" stroke-linecap="round" fill="none" />
      `;
      break;

    case "bodyguard":
      content = `
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <rect x="73" y="87" width="24" height="7" rx="2" fill="#09090B" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <path d="M 98 134 L 138 112" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
        <path d="M 218 130 L 182 104" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case "arm-wrestling":
      content = `
        <circle cx="115" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 93 166 C 93 124 137 124 137 166 Z" fill="url(#fanGrad)" />
        <line x1="100" y1="130" x2="66" y2="112" stroke="#60A5FA" stroke-width="7" stroke-linecap="round" />
        <circle cx="205" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 183 166 C 183 124 227 124 227 166 Z" fill="url(#idolGrad)" />
        <line x1="220" y1="130" x2="254" y2="112" stroke="#F472B6" stroke-width="7" stroke-linecap="round" />
      `;
      break;

    case "pinky-promise":
      content = `
        <line x1="102" y1="126" x2="156" y2="118" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <line x1="218" y1="126" x2="164" y2="118" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
        <circle cx="160" cy="118" r="6" fill="${accentColor}" />
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "jojo":
      content = `
        <text x="44" y="74" font-size="18" font-weight="800" fill="${accentColor}">ゴゴ</text>
        <text x="248" y="74" font-size="18" font-weight="800" fill="${accentColor}">ゴゴ</text>
        <g transform="rotate(-8 85 110)">
          <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
          <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
          <line x1="95" y1="126" x2="84" y2="82" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        </g>
        <g transform="rotate(8 235 110)">
          <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
          <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
          <line x1="225" y1="126" x2="236" y2="82" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
        </g>
      `;
      break;

    case "kamehameha":
      content = `
        <circle cx="160" cy="112" r="12" fill="${accentColor}" opacity="0.85" />
        <line x1="102" y1="120" x2="152" y2="112" stroke="#60A5FA" stroke-width="7" stroke-linecap="round" />
        <line x1="218" y1="120" x2="168" y2="112" stroke="#F472B6" stroke-width="7" stroke-linecap="round" />
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
      `;
      break;

    case "crying-fan":
      content = `
        <circle cx="85" cy="108" r="18" fill="url(#fanGrad)" />
        <path d="M 63 170 C 63 134 107 134 107 170 Z" fill="url(#fanGrad)" />
        <line x1="95" y1="142" x2="116" y2="118" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="90" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
        <line x1="216" y1="124" x2="220" y2="92" stroke="#F472B6" stroke-width="5" stroke-linecap="round" />
        <line x1="254" y1="124" x2="250" y2="92" stroke="#F472B6" stroke-width="5" stroke-linecap="round" />
      `;
      break;

    case "spiderman":
      content = `
        <circle cx="85" cy="96" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 126 107 126 107 166 Z" fill="url(#fanGrad)" />
        <line x1="98" y1="128" x2="148" y2="112" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="96" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 126 257 126 257 166 Z" fill="url(#idolGrad)" />
        <line x1="222" y1="128" x2="172" y2="112" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    default:
      content = `
        <circle cx="85" cy="92" r="18" fill="url(#fanGrad)" />
        <path d="M 63 166 C 63 124 107 124 107 166 Z" fill="url(#fanGrad)" />
        <line x1="98" y1="130" x2="132" y2="104" stroke="#60A5FA" stroke-width="6" stroke-linecap="round" />
        <circle cx="235" cy="92" r="18" fill="url(#idolGrad)" />
        <path d="M 213 166 C 213 124 257 124 257 166 Z" fill="url(#idolGrad)" />
        <line x1="222" y1="130" x2="188" y2="104" stroke="#F472B6" stroke-width="6" stroke-linecap="round" />
      `;
      break;
  }

  return svgOpen + content + svgClose;
}
