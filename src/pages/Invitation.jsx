import { useEffect, useRef, useState } from 'react'
import {
  coupleName,
  dressCode,
  eventDateISO,
  eventDateLabel,
  eventLocation,
  eventTimeLabel,
  getGuestType,
  gifts,
  practicalAdvice,
  readGuests,
  saveGuests,
  timeline,
  upsertGuest,
} from '../data/wedding'
import './Invitation.css'

// ─── Countdown hook ────────────────────────────────────────────────────────────
function calcTimeLeft(isoDate) {
  const diff = new Date(isoDate) - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
}

function useCountdown(isoDate) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(isoDate))
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(isoDate)), 1000)
    return () => clearInterval(id)
  }, [isoDate])
  return timeLeft
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─── Guest type callout ───────────────────────────────────────────────────────
function GuestTypeCallout({ guest }) {
  const type = getGuestType(guest)
  const max  = guest?.maxAttendees ?? 1

  const msgs = {
    plusone: 'Tu invitación incluye un lugar para un acompañante a tu elección.',
    couple:  'La invitación es para los dos.',
    family:  `Tu invitación es para ${max} personas (grupo familiar).`,
  }

  const msg = msgs[type]
  if (!msg) return null

  const icons = { plusone: '👤+1', couple: '👫', family: '👨‍👩‍👧' }

  return (
    <div className="inv-type-callout">
      <span className="inv-type-icon">{icons[type]}</span>
      <p>{msg}</p>
    </div>
  )
}

// ─── Countdown unit ───────────────────────────────────────────────────────────
function CountUnit({ value, label }) {
  return (
    <div className="inv-count-unit">
      <span className="inv-count-num">{String(value).padStart(2, '0')}</span>
      <span className="inv-count-label">{label}</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function Invitation({ guest, onChangeGuest, onGuestUpdate }) {
  useScrollReveal()
  const timeLeft = useCountdown(eventDateISO)

  const [attendance, setAttendance] = useState(guest?.attendance === 'confirmed' ? 'yes' : 'yes')
  const [guestCount, setGuestCount] = useState(String(guest?.attendanceCount || 1))
  const [notes, setNotes] = useState(guest?.notes ?? '')
  const [submitted, setSubmitted] = useState(guest?.attendance !== 'pending')
  const navRef = useRef(null)

  const guestName = guest?.fullName ?? 'Invitado especial'
  const maxAttendees = guest?.maxAttendees ?? 1

  useEffect(() => {
    document.title = `${coupleName} | Nuestra Boda`
  }, [])

  function handleRSVP(e) {
    e.preventDefault()
    const confirmed = attendance === 'yes'
    const count = Math.min(Math.max(Number(guestCount) || 1, 1), maxAttendees)

    const updated = {
      ...guest,
      attendance: confirmed ? 'confirmed' : 'declined',
      attendanceCount: confirmed ? count : 0,
      notes: notes.trim() || guest.notes,
      updatedAt: new Date().toISOString(),
    }

    const guests = readGuests()
    const nextGuests = upsertGuest(guests, updated)
    saveGuests(nextGuests)
    onGuestUpdate(updated)
    setSubmitted(true)
  }

  return (
    <div className="inv-shell">
      {/* ── Sticky navbar ───────────────────────────────────────────────── */}
      <nav className="inv-nav" ref={navRef}>
        <div className="inv-nav-brand">{coupleName}</div>
        <div className="inv-nav-links">
          <a href="#detalles">Detalles</a>
          <a href="#cronograma">Cronograma</a>
          <a href="#rsvp">RSVP</a>
        </div>
        <a href="#rsvp" className="inv-nav-cta">Confirmar</a>
      </nav>

      <main>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* MODULE 1 · Hero                                                  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="inv-module inv-hero scroll-reveal visible" id="inicio">
          <div className="inv-hero-overlay" />
          <div className="inv-hero-content">
            <p className="inv-eyebrow">Con la bendición de Dios y junto con nuestras familias</p>
            <h1 className="inv-couple-title">{coupleName}</h1>
            <div className="divider" />
            <p className="inv-guest-label">Nos complace invitar a</p>
            <h2 className="inv-guest-name">{guestName}</h2>
            <blockquote className="inv-quote">
              <p>"Ponme como un sello sobre tu corazón, como un sello sobre tu brazo; porque fuerte como la muerte es el amor."</p>
              <footer>— Cantares 8:6 NBLA</footer>
            </blockquote>
            <button type="button" className="inv-change-btn" onClick={onChangeGuest}>
              ¿No eres tú? Cambiar contraseña
            </button>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* MODULE 2 · Event details + countdown                            */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="inv-module inv-soft scroll-reveal" id="detalles">
          <div className="inv-inner">
            <div className="inv-section-head text-center">
              <p className="inv-section-copy" style={{ marginBottom: '0.5rem' }}>
                Nos complace invitarlos a la celebración de nuestro matrimonio que se celebra el día
              </p>
              <h2 className="inv-big-date">01 | 02 | 2027</h2>
              <div className="divider" />
            </div>

            <div className="inv-event-cards">
              <div className="inv-event-card">
                <div className="inv-event-icon">📅</div>
                <h3>Fecha</h3>
                <p>{eventDateLabel}</p>
              </div>
              <div className="inv-event-card">
                <div className="inv-event-icon">🕐</div>
                <h3>Hora</h3>
                <p>{eventTimeLabel}</p>
              </div>
              <div className="inv-event-card">
                <div className="inv-event-icon">📍</div>
                <h3>Lugar</h3>
                <p>{eventLocation}</p>
              </div>
            </div>

            <div className="inv-countdown">
              <p className="inv-countdown-label">TIEMPO PARA EL GRAN DÍA</p>
              <div className="inv-countdown-row">
                <CountUnit value={timeLeft.days}    label="Días"     />
                <span className="inv-count-sep">:</span>
                <CountUnit value={timeLeft.hours}   label="Horas"    />
                <span className="inv-count-sep">:</span>
                <CountUnit value={timeLeft.minutes} label="Minutos"  />
                <span className="inv-count-sep">:</span>
                <CountUnit value={timeLeft.seconds} label="Segundos" />
              </div>
            </div>

            <div className="inv-map-row">
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(eventLocation)}&navigate=yes`}
                target="_blank"
                rel="noreferrer"
                className="inv-map-btn"
              >
                Ver en Waze
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`}
                target="_blank"
                rel="noreferrer"
                className="inv-map-btn"
              >
                Ver en Google Maps
              </a>
            </div>

            <div className="inv-advice-list">
              {practicalAdvice.map(item => (
                <div className="inv-advice-item" key={item}>
                  <span className="inv-advice-dot">✦</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* MODULE 3 · Cronograma                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="inv-module scroll-reveal" id="cronograma">
          <div className="inv-inner inv-narrow">
            <div className="inv-section-head text-center">
              <h2>Cronograma del día</h2>
              <div className="divider" />
            </div>

            <div className="inv-timeline">
              {timeline.map((item, i) => (
                <div className="inv-timeline-item" key={item.time}>
                  <div className="inv-tl-time">{item.time}</div>
                  <div className="inv-tl-line">
                    <div className="inv-tl-dot" />
                    {i < timeline.length - 1 && <div className="inv-tl-connector" />}
                  </div>
                  <div className="inv-tl-body">
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* MODULE 4 · Dress code                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="inv-module inv-soft scroll-reveal" id="vestimenta">
          <div className="inv-inner">
            <div className="inv-section-head text-center">
              <h2>Código de Vestimenta</h2>
              <div className="divider" />
              <p className="inv-section-copy">
                Nos encantaría verte lucir tu mejor gala para esta noche tan especial.
              </p>
            </div>

            <div className="inv-dress-cards">
              <div className="inv-dress-card">
                <div className="inv-dress-icon">♂</div>
                <h3>Ellos</h3>
                <p>{dressCode.men}</p>
              </div>
              <div className="inv-dress-badge">FORMAL · GALA</div>
              <div className="inv-dress-card">
                <div className="inv-dress-icon">♀</div>
                <h3>Ellas</h3>
                <p>{dressCode.women}</p>
              </div>
            </div>

            <div className="inv-palette">
              {dressCode.palette.map(color => (
                <span
                  key={color}
                  className="inv-color-swatch"
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="inv-dress-notes">
              {dressCode.notes.map(note => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* MODULE 5 · Gifts                                                */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="inv-module scroll-reveal" id="regalos">
          <div className="inv-inner text-center">
            <div className="inv-gift-icon" aria-hidden="true">✦</div>
            <h2>Mesa de Regalos</h2>
            <div className="divider" />
            <p className="inv-section-copy">
              Vuestra presencia es nuestro mayor regalo. Sin embargo, si desean
              contribuir a nuestra nueva vida juntos, agradecemos su detalle a través de:
            </p>
            <div className="inv-gift-cards">
              {gifts.map(gift => (
                <div className="inv-gift-card" key={gift.title}>
                  <h3>{gift.title}</h3>
                  <p>{gift.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* MODULE 6 · RSVP                                                 */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="inv-module inv-soft scroll-reveal" id="rsvp">
          <div className="inv-inner inv-narrow">
            <div className="inv-section-head text-center">
              <h2>R.S.V.P</h2>
              <div className="divider" />
              <p className="inv-section-copy">
                Confirma tu asistencia antes del 20 de abril de 2026.
              </p>
            </div>

            <div className="inv-rsvp-card">
              {submitted ? (
                <div className="inv-rsvp-success">
                  <div className="inv-success-icon">✓</div>
                  <h3>
                    {guest?.attendance === 'confirmed'
                      ? '¡Nos alegra que vengas!'
                      : 'Gracias por avisarnos'}
                  </h3>
                  <p>
                    {guest?.attendance === 'confirmed'
                      ? `Te esperamos el ${eventDateLabel}. ¡Va a ser una noche increíble!`
                      : 'Lamentamos que no puedas acompañarnos. ¡Te mandamos un abrazo!'}
                  </p>
                  <button
                    type="button"
                    className="inv-rsvp-edit-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Modificar respuesta
                  </button>
                </div>
              ) : (
                <form className="inv-rsvp-form" onSubmit={handleRSVP}>
                  <div className="inv-rsvp-field">
                    <label className="inv-rsvp-label">Invitado</label>
                    <div className="inv-rsvp-name-display">{guestName}</div>
                  </div>

                  <GuestTypeCallout guest={guest} />

                  <div className="inv-rsvp-field">
                    <label className="inv-rsvp-label">¿Asistirás a la boda?</label>
                    <div className="inv-attendance-btns">
                      <button
                        type="button"
                        className={`inv-att-btn ${attendance === 'yes' ? 'active' : ''}`}
                        onClick={() => setAttendance('yes')}
                      >
                        Sí, con mucho gusto 🎉
                      </button>
                      <button
                        type="button"
                        className={`inv-att-btn ${attendance === 'no' ? 'active decline' : ''}`}
                        onClick={() => setAttendance('no')}
                      >
                        Lamentablemente no podré
                      </button>
                    </div>
                  </div>

                  {attendance === 'yes' && maxAttendees > 1 && (
                    <div className="inv-rsvp-field">
                      <label className="inv-rsvp-label" htmlFor="rsvp-count">
                        Número de personas (máx. {maxAttendees})
                      </label>
                      <input
                        id="rsvp-count"
                        type="number"
                        className="inv-rsvp-input"
                        min={1}
                        max={maxAttendees}
                        value={guestCount}
                        onChange={e => setGuestCount(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="inv-rsvp-field">
                    <label className="inv-rsvp-label" htmlFor="rsvp-notes">
                      Restricciones alimentarias u otras notas
                    </label>
                    <textarea
                      id="rsvp-notes"
                      className="inv-rsvp-input inv-rsvp-textarea"
                      rows={3}
                      placeholder="Ej: Vegetariano, alergia a nueces…"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="inv-rsvp-submit">
                    Enviar confirmación
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      <footer className="inv-footer">
        <p className="inv-footer-brand">{coupleName}</p>
        <p className="inv-footer-copy">Hecho con amor para nuestro día especial.</p>
        <nav className="inv-footer-links">
          <a href="#inicio">Inicio</a>
          <a href="#detalles">Detalles</a>
          <a href="#rsvp">RSVP</a>
        </nav>
      </footer>
    </div>
  )
}

export default Invitation
