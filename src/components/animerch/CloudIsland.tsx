/** Pixel-art cloud island with shop, drawn as inline SVG. */
export function CloudIsland({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 240"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label="A pixel-art floating cloud island with a tiny anime shop on top"
    >
      {/* Cloud base */}
      <g fill="#ffffff" stroke="#2c3e6b" strokeWidth="3">
        <rect x="40" y="160" width="240" height="20" />
        <rect x="60" y="150" width="200" height="10" />
        <rect x="80" y="140" width="160" height="10" />
        <rect x="50" y="180" width="220" height="20" />
        <rect x="70" y="200" width="180" height="14" />
      </g>
      {/* Shop body */}
      <rect x="120" y="80" width="80" height="60" fill="#ffcde8" stroke="#2c3e6b" strokeWidth="3" />
      {/* Roof */}
      <polygon points="110,80 210,80 200,60 120,60" fill="#ffe76a" stroke="#2c3e6b" strokeWidth="3" />
      {/* Door */}
      <rect x="148" y="105" width="24" height="35" fill="#89c4f4" stroke="#2c3e6b" strokeWidth="3" />
      <circle cx="166" cy="123" r="2" fill="#2c3e6b" />
      {/* Windows */}
      <rect x="128" y="92" width="14" height="10" fill="#ddf0ff" stroke="#2c3e6b" strokeWidth="2" />
      <rect x="178" y="92" width="14" height="10" fill="#ddf0ff" stroke="#2c3e6b" strokeWidth="2" />
      {/* Sign */}
      <rect x="135" y="68" width="50" height="10" fill="#ffffff" stroke="#2c3e6b" strokeWidth="2" />
      <text x="160" y="76" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="6" fill="#2c3e6b">SHOP</text>
      {/* Flag */}
      <rect x="158" y="42" width="2" height="20" fill="#2c3e6b" />
      <polygon points="160,42 174,46 160,50" fill="#ffcde8" stroke="#2c3e6b" strokeWidth="2" />
      {/* Small extra cloud */}
      <g fill="#ffffff" stroke="#2c3e6b" strokeWidth="2">
        <rect x="20" y="120" width="40" height="10" />
        <rect x="30" y="110" width="20" height="10" />
      </g>
      <g fill="#ffffff" stroke="#2c3e6b" strokeWidth="2">
        <rect x="260" y="100" width="40" height="10" />
        <rect x="270" y="90" width="20" height="10" />
      </g>
      {/* Stars */}
      <rect x="40" y="40" width="4" height="4" fill="#ffe76a" />
      <rect x="280" y="60" width="4" height="4" fill="#ffe76a" />
      <rect x="240" y="30" width="4" height="4" fill="#ffcde8" />
    </svg>
  );
}