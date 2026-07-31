import './FloralCorner.css'

// ─── Small building blocks (hand-drawn watercolor-style botanicals) ───────────
function BlueFlower({ x, y, r = 1, rot = 0, tone = 1 }) {
  const petals = [0, 72, 144, 216, 288]
  const fill = tone === 1 ? 'var(--floral-blue)' : 'var(--floral-blue-deep)'
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      {petals.map(a => (
        <ellipse
          key={a}
          cx="0" cy="-7.5" rx="4.4" ry="7.2"
          transform={`rotate(${a})`}
          fill={fill}
          opacity="0.88"
        />
      ))}
      <circle r="2.1" fill="var(--gold)" opacity="0.95" />
    </g>
  )
}

function TanFlower({ x, y, r = 1, rot = 0 }) {
  const petals = [0, 60, 120, 180, 240, 300]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      {petals.map((a, i) => (
        <ellipse
          key={a}
          cx="0" cy="-8" rx="5.2" ry="8.4"
          transform={`rotate(${a})`}
          fill="var(--floral-tan)"
          opacity={i % 2 === 0 ? 0.92 : 0.78}
        />
      ))}
      <circle r="3" fill="var(--floral-tan-deep)" />
    </g>
  )
}

function BabyBreath({ x, y, r = 1, rot = 0 }) {
  const stems = [
    [0, 0, 10, -14], [0, 0, -12, -10], [0, 0, 4, -18],
    [0, 0, -6, -18], [0, 0, 14, -4], [0, 0, -14, 2],
  ]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      {stems.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--leaf)" strokeWidth="0.7" opacity="0.6" />
          <circle cx={x2} cy={y2} r="2.1" fill="var(--paper)" stroke="var(--floral-blue)" strokeWidth="0.4" opacity="0.9" />
        </g>
      ))}
    </g>
  )
}

function FernLeaf({ x, y, r = 1, rot = 0, flip = false }) {
  const s = flip ? -1 : 1
  const leaflets = [16, 30, 44, 58, 72, 84]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      <path d="M0,92 C -3,64 4,36 0,6" stroke="var(--leaf-deep)" strokeWidth="1.3" fill="none" opacity="0.75" />
      {leaflets.map((ly, i) => (
        <ellipse
          key={ly}
          cx={(i % 2 === 0 ? 1 : -1) * s * (6 + i * 0.6)}
          cy={92 - ly}
          rx="5.6" ry="2.1"
          transform={`rotate(${(i % 2 === 0 ? -1 : 1) * s * 34} ${(i % 2 === 0 ? 1 : -1) * s * (6 + i * 0.6)} ${92 - ly})`}
          fill="var(--leaf)"
          opacity="0.8"
        />
      ))}
    </g>
  )
}

function SingleLeaf({ x, y, r = 1, rot = 0 }) {
  return (
    <path
      d="M0,-19 C 7.5,-11 7.5,11 0,19 C -7.5,11 -7.5,-11 0,-19 Z"
      fill="var(--leaf)"
      opacity="0.82"
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}
    />
  )
}

function Sparkle({ x, y, r = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`} opacity="0.75">
      <line x1="0" y1="-6" x2="0" y2="6" stroke="var(--gold)" strokeWidth="0.9" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke="var(--gold)" strokeWidth="0.9" />
      <circle r="1" fill="var(--gold)" />
    </g>
  )
}

// ─── The composed corner bouquet ───────────────────────────────────────────────
// Authored anchored to the TOP-LEFT corner; other corners are produced with CSS
// mirroring (scaleX/scaleY) via the wrapper classes in FloralCorner.css.
function Bouquet() {
  return (
    <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <FernLeaf x={18} y={4} rot={-12} r={1.25} />
      <FernLeaf x={64} y={-10} rot={22} r={1} flip />
      <FernLeaf x={4} y={58} rot={-58} r={0.85} />
      <SingleLeaf x={92} y={12} rot={35} r={0.9} />
      <SingleLeaf x={34} y={88} rot={-20} r={0.8} />

      <BlueFlower x={38} y={46} r={1.5} rot={8} tone={1} />
      <BlueFlower x={78} y={22} r={1.05} rot={-20} tone={2} />
      <BlueFlower x={104} y={58} r={0.75} rot={30} tone={1} />
      <BlueFlower x={18} y={98} r={0.8} rot={4} tone={2} />
      <BlueFlower x={140} y={16} r={0.6} rot={-10} tone={1} />

      <TanFlower x={58} y={78} r={1.15} rot={-4} />

      <BabyBreath x={94} y={92} r={1} rot={10} />
      <BabyBreath x={10} y={22} r={0.85} rot={-30} />
      <BabyBreath x={134} y={34} r={0.9} rot={20} />
      <BabyBreath x={150} y={72} r={0.7} rot={-8} />

      <Sparkle x={156} y={10} r={1.1} rot={12} />
      <Sparkle x={178} y={42} r={0.85} rot={-8} />
      <Sparkle x={142} y={74} r={0.7} rot={30} />
      <Sparkle x={6} y={140} r={0.8} rot={0} />
    </svg>
  )
}

/**
 * Decorative watercolor-style floral corner ornament (cornflower blue, ivory
 * baby's breath, sandy dahlia, sage fern, gold flecks) — reused across the
 * invitation flow via CSS mirroring instead of four separate drawings.
 */
function FloralCorner({ corner = 'top-left', size = 'lg', className = '' }) {
  return (
    <div className={`floral-corner floral-corner--${corner} floral-corner--${size} ${className}`}>
      <Bouquet />
    </div>
  )
}

/**
 * Small horizontal sprig (leaf – flower – sprig – leaf) used as a recurring
 * botanical accent above section titles, so the coastal theme reads through
 * every module of the invitation, not just the hero and footer.
 */
export function SectionSprig({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 34"
      className={`section-sprig ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <SingleLeaf x={14} y={20} r={0.55} rot={-38} />
      <BlueFlower x={40} y={15} r={0.85} rot={-6} tone={1} />
      <BabyBreath x={58} y={9} r={0.55} rot={20} />
      <BlueFlower x={72} y={17} r={0.55} rot={16} tone={2} />
      <SingleLeaf x={87} y={21} r={0.5} rot={40} />
    </svg>
  )
}

export default FloralCorner
