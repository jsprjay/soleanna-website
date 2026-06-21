/**
 * Inline SVG sun-burst mark — a stand-in for the real logo so the site
 * looks complete out of the box. To use the official artwork instead,
 * drop it in `public/logo.png` and swap this for a <Logo /> image
 * (see the note in components/Logo.tsx).
 */
export default function SunLogo({
  className = "",
  rays = 12,
}: {
  className?: string;
  rays?: number;
}) {
  const cx = 50;
  const cy = 50;
  const coreR = 17;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Soleanna Run Club sun logo"
    >
      <g fill="currentColor">
        <circle cx={cx} cy={cy} r={coreR} />
        {Array.from({ length: rays }).map((_, i) => {
          const angle = (i / rays) * Math.PI * 2;
          const inner = coreR + 2;
          const outer = 44;
          const half = 0.16; // ray half-width in radians
          const tipX = cx + Math.cos(angle) * outer;
          const tipY = cy + Math.sin(angle) * outer;
          const baseX1 = cx + Math.cos(angle - half) * inner;
          const baseY1 = cy + Math.sin(angle - half) * inner;
          const baseX2 = cx + Math.cos(angle + half) * inner;
          const baseY2 = cy + Math.sin(angle + half) * inner;
          return (
            <path
              key={i}
              d={`M ${baseX1} ${baseY1} Q ${tipX} ${tipY} ${baseX2} ${baseY2} Z`}
            />
          );
        })}
      </g>
    </svg>
  );
}
