/**
 * background-utils.ts
 *
 * Deterministic pseudo-random helpers for the animated background.
 *
 * Nothing here uses Math.random() directly — everything is derived from a
 * seeded PRNG so the mesh curves and particle field are generated once at
 * import time and produce identical output on the server and the client
 * (no hydration mismatch), with no runtime generation cost on re-render.
 */

export type TopoCurve = {
  id: string;
  d: string;
  strokeWidth: number;
  opacity: number;
  /** Gradient stop coordinates so the stroke can fade in/out along its length. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Particle = {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // px
  baseOpacity: number;
  tone: "emerald" | "champagne" | "white";
  pulseDuration: number; // seconds
  pulseDelay: number; // seconds
};

/** Seedable PRNG (mulberry32). Returns a function producing floats in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates organic, Apple-WWDC-style topographic contour curves within a
 * 1440x900 viewBox.
 *
 * Each curve:
 *  - has a random length and diagonal drift, so it never spans edge-to-edge
 *  - is built from several cubic bezier segments with a random walk offset,
 *    so it curves naturally instead of tracing a simple sine wave
 *  - carries x1/y1/x2/y2 so the consumer can attach a gradient stroke that
 *    fades the line in and out at its ends, rather than clipping it hard
 */
export function generateTopoCurves(count = 22, seed = 11): TopoCurve[] {
  const rand = mulberry32(seed);
  const curves: TopoCurve[] = [];
  const viewW = 1440;
  const viewH = 900;

  for (let i = 0; i < count; i++) {
    // Random anchor + direction. Angle stays mostly gentle so curves read as
    // flowing contours, but varies enough that nothing looks like a stack
    // of horizontal lines.
    const angle = (rand() - 0.5) * 0.9; // radians, ~ -26deg..26deg
    const length = 260 + rand() * 820; // curves vary a lot in length
    const startX = rand() * viewW - 120;
    const startY = rand() * viewH;

    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const endX = startX + dirX * length;
    const endY = startY + dirY * length;

    // Perpendicular unit vector, used to bow the curve off its straight line.
    const perpX = -dirY;
    const perpY = dirX;

    const segments = 3 + Math.floor(rand() * 3); // 3-5 segments
    let d = `M ${startX.toFixed(1)},${startY.toFixed(1)}`;

    let prevX = startX;
    let prevY = startY;
    let drift = 0;

    for (let s = 1; s <= segments; s++) {
      const t = s / segments;
      const baseX = startX + (endX - startX) * t;
      const baseY = startY + (endY - startY) * t;

      // Smooth random-walk perpendicular offset for organic bowing.
      drift += (rand() - 0.5) * length * 0.22;
      const offset = drift * Math.sin(t * Math.PI); // taper offset toward ends

      const px = baseX + perpX * offset;
      const py = baseY + perpY * offset;

      // Control points placed between prev point and this point, nudged
      // along the perpendicular for a smooth cubic curve (no sine-wave look).
      const c1x = prevX + (px - prevX) * 0.33 + perpX * offset * 0.4;
      const c1y = prevY + (py - prevY) * 0.33 + perpY * offset * 0.4;
      const c2x = prevX + (px - prevX) * 0.66 + perpX * offset * 0.4;
      const c2y = prevY + (py - prevY) * 0.66 + perpY * offset * 0.4;

      d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`;

      prevX = px;
      prevY = py;
    }

    curves.push({
      id: `topo-${i}`,
      d,
      strokeWidth: +(0.4 + rand() * 1.6).toFixed(2),
      opacity: +(0.05 + rand() * 0.28).toFixed(2),
      x1: startX,
      y1: startY,
      x2: prevX,
      y2: prevY,
    });
  }

  return curves;
}

/**
 * Generates a static-position particle field. Particles never move, they
 * only pulse opacity (handled purely in CSS via per-particle duration/delay
 * custom properties so the pulses don't feel synchronized).
 */
export function generateParticles(count = 48, seed = 101): Particle[] {
  const rand = mulberry32(seed);
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const toneRoll = rand();
    const tone: Particle["tone"] =
      toneRoll < 0.4 ? "white" : toneRoll < 0.72 ? "emerald" : "champagne";

    particles.push({
      id: `particle-${i}`,
      x: +(rand() * 100).toFixed(2),
      y: +(rand() * 100).toFixed(2),
      size: +(0.8 + rand() * 2.4).toFixed(2),
      baseOpacity: +(0.12 + rand() * 0.5).toFixed(2),
      tone,
      pulseDuration: +(4 + rand() * 6).toFixed(1),
      pulseDelay: +(rand() * 8).toFixed(1),
    });
  }

  return particles;
}
