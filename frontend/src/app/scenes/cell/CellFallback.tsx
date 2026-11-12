/* Static stand-in for the living cell on low-tier devices and browsers without WebGL. */
export default function CellFallback() {
  return <div aria-hidden className="cs-cell-fallback" />;
}
