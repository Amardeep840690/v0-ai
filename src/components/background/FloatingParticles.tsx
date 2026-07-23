import { generateParticles } from "./background-utils";

// Generated once at module load: deterministic, so identical on server and
// client (no hydration mismatch). Particles never move — position is fixed,
// only opacity pulses, driven entirely by CSS keyframes.
const PARTICLES = generateParticles(48, 101);

export function FloatingParticles() {
  return (
    <div className="bg-particles" aria-hidden="true">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={`bg-particle bg-particle--${p.tone}`}
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.baseOpacity,
              "--base-opacity": p.baseOpacity,
              "--pulse-duration": `${p.pulseDuration}s`,
              "--pulse-delay": `${p.pulseDelay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
