import { useMemo } from 'react';

const GLYPHS = ['👻', '🕯️', '🥂', '🌙', '✨', '🦇'];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function SpectralOverlay({ count = 22 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        left: rand(0, 100),
        delay: rand(0, 2.5),
        duration: rand(4, 8),
        drift: rand(-120, 120),
        spin: rand(-40, 40),
        size: rand(20, 38),
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="spectral-particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--drift']: `${p.drift}px`,
            ['--spin']: `${p.spin}deg`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
