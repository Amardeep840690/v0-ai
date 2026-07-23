import { generateTopoCurves } from "./background-utils";

// Generated once at module load: deterministic, so identical on server and
// client (no hydration mismatch), and never recomputed on re-render.
const CURVES = generateTopoCurves(22, 11);

export function MeshOverlay() {
  return (
    <div className="bg-mesh" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          {CURVES.map((curve) => (
            <linearGradient
              key={`grad-${curve.id}`}
              id={`bg-mesh-${curve.id}`}
              gradientUnits="userSpaceOnUse"
              x1={curve.x1}
              y1={curve.y1}
              x2={curve.x2}
              y2={curve.y2}
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="18%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="82%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {CURVES.map((curve) => (
          <path
            key={curve.id}
            d={curve.d}
            stroke={`url(#bg-mesh-${curve.id})`}
            strokeWidth={curve.strokeWidth}
            opacity={curve.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
