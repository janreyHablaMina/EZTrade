export function BrandLogo({ className = "", size = 96 }: { className?: string, size?: number }) {
  const cx = 50;
  const cy = 50;
  const r = 38;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="40%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="hexFill" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#1e0b45" />
          <stop offset="100%" stopColor="#0a041c" />
        </linearGradient>
        <linearGradient id="markFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
      </defs>

      <polygon
        points={hex}
        fill="url(#hexFill)"
        stroke="url(#hexStroke)"
        strokeWidth={5}
      />

      <path
        d="M31 29 L69 29 L69 39 L48 39 L69 58 L69 71 L31 71 L31 61 L52 61 L31 42 Z"
        fill="url(#markFill)"
      />
    </svg>
  );
}
