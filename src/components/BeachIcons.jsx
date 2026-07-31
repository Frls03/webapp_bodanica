// ─── Elegant line-art icon set for the coastal invitation theme ───────────────
// Stroke-based, currentColor — recolor via CSS `color`.

export function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="5" y="8" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 13.5H27" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 5.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 5.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="19.5" r="2.1" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function ClockIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 10V16.5L20.5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 27C16 27 24.5 18.7 24.5 12.6C24.5 7.9 20.7 4 16 4C11.3 4 7.5 7.9 7.5 12.6C7.5 18.7 16 27 16 27Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <circle cx="16" cy="12.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function RingsIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12.5" cy="18" r="7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19.5" cy="18" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.5 11.6L11 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M19.5 11.6L21 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function ShellIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 5C22 7 26.5 13 26 19.5C25.7 23.5 21.5 27 16 27C10.5 27 6.3 23.5 6 19.5C5.5 13 10 7 16 5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M16 6.5V26" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11.5 9.5C10 13.5 9.5 19 11 24.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M20.5 9.5C22 13.5 22.5 19 21 24.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export function StarfishIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 3.5C16.9 8.4 18.4 10.8 22.5 12.3C18.7 13.6 17 15.5 16.4 20C15.5 15.5 13.9 13.7 10 12.3C14 10.9 15.2 8.6 16 3.5Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      />
      <path
        d="M16 20C16.6 23 17.7 24.5 21 25.6C17.9 26.6 16.7 28 16.2 29.5C15.7 28 14.5 26.6 11.5 25.6C14.7 24.6 15.5 23.1 16 20Z"
        stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.7"
      />
      <circle cx="16" cy="13.5" r="1.1" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function SparkleIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 4V28" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      <path d="M4 16H28" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      <circle cx="16" cy="16" r="2.1" fill="currentColor" />
    </svg>
  )
}

export function WaveDivider({ className = '', flip = false }) {
  return (
    <svg
      className={`wave-divider ${className}`}
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path d="M0,32 C 220,78 420,4 720,28 C 1020,52 1220,6 1440,40 L1440,90 L0,90 Z" />
    </svg>
  )
}
