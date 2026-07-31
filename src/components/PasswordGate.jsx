import { useState } from 'react'
import { clearGuestSession, loginAdmin, loginGuest, saveGuestSession } from '../data/wedding'
import FloralCorner from './FloralCorner'
import './PasswordGate.css'

function PasswordGate({ mode, onAuthenticated }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const isInvite = mode === 'invite'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const pwd = password.trim()

      if (isInvite) {
        const guest = await loginGuest(pwd)
        if (!guest) {
          clearGuestSession()
          setError('La contraseña no coincide con ninguna invitación.')
          return
        }
        saveGuestSession(guest)
        onAuthenticated(guest)
        setPassword('')
        return
      }

      await loginAdmin(username.trim(), pwd)
      onAuthenticated()
      setUsername('')
      setPassword('')
    } catch {
      setError(isInvite ? 'No se pudo verificar la contraseña.' : 'Correo o contraseña incorrectos.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`gate-shell ${isInvite ? 'gate-beach' : ''}`}>
      <div className="gate-bg-pattern" />
      {isInvite && (
        <>
          <FloralCorner corner="top-left" size="md" />
          <FloralCorner corner="bottom-right" size="md" />
        </>
      )}

      <div className="gate-card">
        <div className="gate-header">
          <p className="gate-eyebrow">{isInvite ? 'INVITACIÓN PRIVADA' : 'ACCESO ADMIN'}</p>

          {isInvite ? (
            <>
              <h1 className="gate-title">¡Nos casamos!</h1>
              <div className="gate-couple">
                <span>Jesica</span>
                <span className="gate-amp">&</span>
                <span>Fernando</span>
              </div>
            </>
          ) : (
            <>
              <h1 className="gate-title">Panel de administración</h1>
              <p className="gate-subtitle">
                Acceso reservado para la coordinación y organización del evento.
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="gate-form">
          {!isInvite && (
            <div className="gate-field">
              <label className="gate-label" htmlFor="gate-user">Correo</label>
              <input
                id="gate-user"
                type="email"
                className="gate-input"
                placeholder="Correo del administrador"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          )}

          <div className="gate-field">
            <label className="gate-label" htmlFor="gate-pwd">
              {isInvite ? 'Contraseña de invitación' : 'Contraseña'}
            </label>
            <div className="gate-input-row">
              <input
                id="gate-pwd"
                type={showPwd ? 'text' : 'password'}
                className="gate-input"
                placeholder={isInvite ? 'Ingresa tu contraseña' : 'Contraseña'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="gate-toggle-pwd"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <p className="gate-error" role="alert">{error}</p>}

          <button type="submit" className="gate-submit" disabled={loading}>
            {loading ? 'Verificando…' : isInvite ? 'Ver mi invitación' : 'Ingresar'}
          </button>
        </form>

        <p className="gate-hint">
          {isInvite
            ? 'Si no tienes tu contraseña, revisa el mensaje que te llegó.'
            : 'Solo los coordinadores del evento tienen acceso.'}
        </p>
      </div>
    </div>
  )
}

export default PasswordGate
