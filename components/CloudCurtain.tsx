type NoiseProps = {
  id: string;
  seed: number;
  /** Lower = larger, softer cloud masses. Higher = fine wisps. */
  frequency: number;
  octaves?: number;
  /**
   * Alpha ramp: `alpha = contrast * noise - cutoff`.
   *
   * fractalNoise clusters tightly around 0.5, so feeding it straight into
   * alpha gives flat, even fog. Amplifying with `contrast` before subtracting
   * `cutoff` pushes the tails apart, which is what separates the sheet into
   * distinct banks with clear sky between them.
   */
  contrast?: number;
  cutoff?: number;
  blur?: number;
  className?: string;
};

/**
 * A full-bleed sheet of procedural cloud.
 *
 * feTurbulence gives fractal noise; the feColorMatrix then throws away the
 * noise's colour and pipes its red channel into alpha, leaving pure white
 * cloud whose density follows the noise field.
 */
function CloudNoise({
  id,
  seed,
  frequency,
  octaves = 4,
  contrast = 3,
  cutoff = 1.15,
  blur = 6,
  className,
}: NoiseProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <filter id={id} x="-6%" y="-6%" width="112%" height="112%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          seed={seed}
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values={`0 0 0 0 1
                   0 0 0 0 1
                   0 0 0 0 1
                   ${contrast} 0 0 0 ${-cutoff}`}
          result="tinted"
        />
        <feGaussianBlur in="tinted" stdDeviation={blur} />
      </filter>
      <rect width="1440" height="900" filter={`url(#${id})`} />
    </svg>
  );
}

/**
 * The clouds that sit over the scene on load and then clear.
 *
 * All motion is CSS keyframes with `fill-mode: forwards`, so this stays a
 * server component and the animation begins on first paint rather than
 * waiting for hydration. Only `opacity` and `transform` are animated, which
 * keeps the expensive turbulence raster off the per-frame path.
 */
export default function CloudCurtain() {
  return (
    <div
      className="cloud-curtain pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Valley haze. Weighted to the lower half so the peaks stay readable
          through it — the scene reads as partly clouded, not whited out. */}
      <div className="cloud-veil absolute inset-0" />

      {/* Bank drifting left-and-out */}
      <div className="cloud-bank cloud-bank--left">
        <CloudNoise
          id="cloudNoiseLeft"
          seed={7}
          frequency={0.015}
          contrast={3.4}
          cutoff={1.28}
          blur={9}
          className="absolute inset-0 h-full w-full"
        />
        <div className="cloud-puff cloud-puff--a" />
        <div className="cloud-puff cloud-puff--b" />
      </div>

      {/* Bank drifting right-and-out */}
      <div className="cloud-bank cloud-bank--right">
        <CloudNoise
          id="cloudNoiseRight"
          seed={23}
          frequency={0.024}
          contrast={3.1}
          cutoff={1.24}
          blur={7}
          className="absolute inset-0 h-full w-full"
        />
        <div className="cloud-puff cloud-puff--c" />
        <div className="cloud-puff cloud-puff--d" />
      </div>

      {/* Fine wisps lifting straight up — clears last, so the peaks emerge
          from a thinning haze rather than snapping into view. */}
      <div className="cloud-bank cloud-bank--rise">
        <CloudNoise
          id="cloudNoiseRise"
          seed={41}
          frequency={0.038}
          octaves={5}
          contrast={2.6}
          cutoff={1.16}
          blur={5}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
