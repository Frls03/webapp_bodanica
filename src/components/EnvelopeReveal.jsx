import { useState } from 'react'
import FloralCorner from './FloralCorner'
import { RingsIcon } from './BeachIcons'
import './EnvelopeReveal.css'

function EnvelopeReveal({ guestName, onOpen }) {
  const [state, setState] = useState('idle') // 'idle' | 'opening' | 'done'

  function handleClick() {
    if (state !== 'idle') return
    setState('opening')
    // after animation completes, call onOpen
    setTimeout(onOpen, 1100)
  }

  return (
    <div className="env-shell">
      <div className="env-bg-pattern" />
      <FloralCorner corner="top-left" size="md" />
      <FloralCorner corner="bottom-right" size="md" />

      <div className="env-content">
        <RingsIcon className="env-rings-icon" aria-hidden="true" />
        <p className="env-eyebrow">TIENES UNA INVITACIÓN</p>

        <button
          type="button"
          className={`envelope ${state}`}
          onClick={handleClick}
          aria-label="Abrir invitación"
        >
          {/* Back of envelope (body) */}
          <div className="env-body" />

          {/* Side diagonal folds */}
          <div className="env-fold-left" />
          <div className="env-fold-right" />

          {/* Bottom V fold */}
          <div className="env-fold-bottom" />

          {/* Top flap (opens on click) */}
          <div className="env-flap" />

          {/* Wax seal */}
          <div className="env-seal" aria-hidden="true">
            <span className="env-seal-text">F&J</span>
          </div>

          {/* Guest name */}
          <div className="env-name" aria-hidden="true">
            Para: <strong>{guestName}</strong>
          </div>
        </button>

        <div className="env-cta-area">
          {state === 'idle' && (
            <p className="env-hint">
              <span className="env-hint-pulse">✦</span>
              Toca el sobre para abrir tu invitación
            </p>
          )}
          {state === 'opening' && (
            <p className="env-hint env-hint--loading">Abriendo…</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnvelopeReveal
