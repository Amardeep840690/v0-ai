import "./background.css";

import { GlowLayer } from "./GlowLayer";
import { MeshOverlay } from "./MeshOverlay";
import { FloatingParticles } from "./FloatingParticles";
import { NoiseOverlay } from "./NoiseOverlay";

/**
 * AnimatedBackground
 *
 * Fixed, full-viewport premium ambient background modeled on the visual
 * language of Linear, Cursor, Raycast, and Apple's WWDC keyart: a slow
 * emerald glow from the left, a slow champagne glow from the opposite
 * corner, an organic topographic contour mesh that fades in and out along
 * each curve, a static particle field that only pulses opacity, faint
 * grain, and a soft vignette.
 *
 * Layer order (z-index handled in background.css):
 *   1. base color
 *   2. GlowLayer      — 4 stacked glows for depth (2 primary + 2 accents)
 *   3. MeshOverlay     — organic contour curves, gradient-faded
 *   4. FloatingParticles — static dots, opacity-only pulse
 *   5. NoiseOverlay    — ~1% CSS grain
 *   6. vignette
 *
 * Only transform / opacity / scale are ever animated — never gradients,
 * never SVG path data — so every layer stays on the GPU compositor.
 * Colors are CSS variables with a dedicated (not inverted) dark palette.
 */
export function AnimatedBackground() {
  return (
    <div className="bg-root" aria-hidden="true">
      <GlowLayer />
      <MeshOverlay />
      <FloatingParticles />
      <NoiseOverlay />
      <div className="bg-vignette" />
    </div>
  );
}
