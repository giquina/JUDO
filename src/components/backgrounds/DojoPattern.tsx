/**
 * DojoBackgroundPattern Component
 *
 * A decorative tatami mat pattern background used across dashboard pages.
 * Provides a subtle Japanese dojo aesthetic.
 */

interface DojoPatternProps {
  /**
   * Optional unique ID suffix for the SVG pattern.
   * Useful when multiple instances exist on the same page to avoid ID conflicts.
   */
  patternId?: string;
}

export default function DojoBackgroundPattern({
  patternId = "tatami",
}: DojoPatternProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Tatami mat pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="60"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="60"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="30"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${patternId})`}
            className="text-primary"
          />
        </svg>
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Also export as named export for flexibility
export { DojoBackgroundPattern };
