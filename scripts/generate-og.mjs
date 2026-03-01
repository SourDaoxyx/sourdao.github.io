import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#000000"/>
      <stop offset="50%" stop-color="#0a0800"/>
      <stop offset="100%" stop-color="#080400"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="topLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0"/>
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="1"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sideLine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0"/>
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Border lines -->
  <rect x="0" y="0" width="${W}" height="3" fill="url(#topLine)"/>
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#topLine)"/>
  <rect x="60" y="0" width="1" height="${H}" fill="url(#sideLine)"/>
  <rect x="${W - 61}" y="0" width="1" height="${H}" fill="url(#sideLine)"/>

  <!-- Corner accents -->
  <rect x="60" y="0" width="40" height="1" fill="#D4AF37" opacity="0.25"/>
  <rect x="${W - 100}" y="0" width="40" height="1" fill="#D4AF37" opacity="0.25"/>
  <rect x="60" y="${H - 1}" width="40" height="1" fill="#D4AF37" opacity="0.25"/>
  <rect x="${W - 100}" y="${H - 1}" width="40" height="1" fill="#D4AF37" opacity="0.25"/>

  <!-- Grain overlay dots (sparse) -->
  ${Array.from({ length: 180 }, (_, i) => {
    const x = ((i * 137.5) % W).toFixed(1);
    const y = ((i * 89.3) % H).toFixed(1);
    const op = (0.02 + (i % 4) * 0.015).toFixed(3);
    return `<circle cx="${x}" cy="${y}" r="1" fill="#F5F5DC" opacity="${op}"/>`;
  }).join("\n  ")}

  <!-- Jar emoji substitute: a stylized jar icon -->
  <g transform="translate(530, 68)">
    <!-- Lid -->
    <rect x="10" y="0" width="120" height="18" rx="5" fill="#D4AF37" opacity="0.9"/>
    <rect x="20" y="4" width="100" height="10" rx="3" fill="#000" opacity="0.3"/>
    <!-- Body -->
    <path d="M5 22 Q0 30 0 55 L0 130 Q0 145 20 148 L120 148 Q140 145 140 130 L140 55 Q140 30 135 22 Z"
          fill="#D4AF37" opacity="0.12" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.4"/>
    <!-- Shine -->
    <path d="M18 35 Q25 28 35 34 L35 120 Q25 118 18 112 Z"
          fill="#F5F5DC" opacity="0.06"/>
    <!-- Label area -->
    <rect x="22" y="58" width="96" height="58" rx="4" fill="#D4AF37" opacity="0.08" stroke="#D4AF37" stroke-width="0.5" stroke-opacity="0.2"/>
    <!-- S on label -->
    <text x="70" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="900" fill="#D4AF37" opacity="0.7">$</text>
    <!-- Bubbles -->
    <circle cx="45" cy="45" r="4" fill="#D4AF37" opacity="0.15"/>
    <circle cx="95" cy="38" r="3" fill="#D4AF37" opacity="0.1"/>
    <circle cx="115" cy="50" r="2.5" fill="#D4AF37" opacity="0.12"/>
  </g>

  <!-- Badge pill -->
  <rect x="440" y="230" width="320" height="32" rx="16"
        fill="#D4AF37" fill-opacity="0.08" stroke="#D4AF37" stroke-opacity="0.35" stroke-width="1"/>
  <text x="600" y="252" text-anchor="middle"
        font-family="Georgia, serif" font-size="12" font-weight="400"
        letter-spacing="3.5" fill="#D4AF37" opacity="0.85">
    THE CIVILIZATION PROTOCOL
  </text>

  <!-- Main title $SOUR -->
  <text x="600" y="340" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="110" font-weight="900"
        letter-spacing="-2" fill="#D4AF37">
    $SOUR
  </text>

  <!-- Tagline -->
  <text x="600" y="390" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="20" font-weight="400"
        letter-spacing="2" fill="#F5F5DC" opacity="0.45">
    Modern finance went stale. We came to ferment.
  </text>

  <!-- Separator line -->
  <line x1="460" y1="420" x2="740" y2="420" stroke="#D4AF37" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Four pillars -->
  ${[
    { label: "Crust", x: 220 },
    { label: "Handshake", x: 420 },
    { label: "Harvest", x: 640 },
    { label: "Mill", x: 840 },
  ]
    .map(
      ({ label, x }) => `
  <rect x="${x}" y="438" width="${label.length * 11 + 32}" height="30" rx="6"
        fill="#D4AF37" fill-opacity="0.04" stroke="#D4AF37" stroke-opacity="0.18" stroke-width="1"/>
  <text x="${x + (label.length * 11 + 32) / 2}" y="459" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="14" fill="#F5F5DC" opacity="0.38" letter-spacing="1">
    ${label}
  </text>`
    )
    .join("")}

  <!-- Domain -->
  <text x="600" y="598" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="15" letter-spacing="4"
        fill="#D4AF37" opacity="0.3">
    sourdao.xyz
  </text>
</svg>
`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: { loadSystemFonts: false },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

const outPath = join(__dirname, "..", "public", "og-image.png");
writeFileSync(outPath, pngBuffer);
console.log(`✅ OG image generated: ${outPath} (${pngBuffer.length} bytes)`);
