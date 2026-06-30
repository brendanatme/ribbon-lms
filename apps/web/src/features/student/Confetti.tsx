import { useMemo } from 'react';

const COLORS = ['#3a5a9b', '#e0b07f', '#9ece9a', '#e58fb0', '#7fb6e8', '#c9a3e0'];

/**
 * A lightweight, dependency-free confetti burst. Renders a fixed number of
 * pieces with randomised position/colour/delay that fall once and stop. The
 * `seed` prop forces a fresh burst when it changes (e.g. on re-completion);
 * honours prefers-reduced-motion via the global animation reset in index.css.
 */
export function Confetti({ count = 36, seed = 0 }: { count?: number; seed?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.4,
        duration: 1.4 + Math.random() * 0.8,
        rounded: Math.random() > 0.5,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, seed],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: p.rounded ? '9999px' : '2px',
          }}
        />
      ))}
    </div>
  );
}
