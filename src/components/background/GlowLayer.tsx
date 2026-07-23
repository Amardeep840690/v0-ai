export function GlowLayer() {
  return (
    <div className="bg-glow-layer" aria-hidden="true">
      {/* Layer 1: large emerald glow, left side */}
      <div className="bg-glow bg-glow--emerald-primary" />
      {/* Depth accent riding alongside layer 1 */}
      <div className="bg-glow bg-glow--emerald-accent" />
      {/* Layer 2: large champagne glow, opposite corner */}
      <div className="bg-glow bg-glow--champagne-primary" />
      {/* Depth accent for the champagne corner */}
      <div className="bg-glow bg-glow--champagne-accent" />
    </div>
  );
}
