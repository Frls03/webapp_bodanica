import { useMemo, useState } from 'react'
import { buildStats, formatDate, readGuests } from '../data/wedding'
import './DashboardTab.css'

const STATUS_FILTER = [
  { key: 'all',       label: 'Todos'       },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'pending',   label: 'Pendientes'  },
  { key: 'declined',  label: 'No asistirán'},
]

function StatCard({ label, value, accent, pct }) {
  return (
    <div className={`dt-stat-card ${accent}`}>
      <p className="dt-stat-label">{label}</p>
      <p className="dt-stat-value">{value}</p>
      {pct !== undefined && (
        <div className="dt-stat-bar-track">
          <div className="dt-stat-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}

function DashboardTab() {
  const [guests]   = useState(readGuests)
  const [filter, setFilter] = useState('all')
  const stats = useMemo(() => buildStats(guests), [guests])

  const pctConfirmed = stats.total ? Math.round((stats.confirmed / stats.total) * 100) : 0
  const pctDeclined  = stats.total ? Math.round((stats.declined  / stats.total) * 100) : 0
  const pctPending   = stats.total ? Math.round((stats.pending   / stats.total) * 100) : 0

  const visible = guests.filter(g =>
    filter === 'all' || g.attendance === filter
  )

  return (
    <div className="dt-root">
      <div>
        <h2 className="adm-section-title">Ver invitaciones</h2>
        <p className="adm-section-subtitle">Resumen de respuestas y estado de los invitados</p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="dt-stats-grid">
        <StatCard label="Total invitados"    value={stats.total}        accent="neutral" />
        <StatCard label="Confirmados"        value={stats.confirmed}    accent="green"   pct={pctConfirmed} />
        <StatCard label="No asistirán"       value={stats.declined}     accent="red"     pct={pctDeclined}  />
        <StatCard label="Pendientes"         value={stats.pending}      accent="amber"   pct={pctPending}   />
        <StatCard label="Personas asistiendo" value={stats.totalAttendees} accent="blue" />
      </div>

      {/* ── Donut-style summary ────────────────────────────────────────────── */}
      <div className="adm-card dt-progress-section">
        <h3 className="dt-progress-title">Progreso de respuestas</h3>
        <div className="dt-progress-bars">
          <ProgressBar label="Confirmados" value={stats.confirmed} total={stats.total} color="var(--confirmed-color)" />
          <ProgressBar label="Pendientes"  value={stats.pending}   total={stats.total} color="var(--pending-color)"  />
          <ProgressBar label="No asistirán" value={stats.declined} total={stats.total} color="var(--declined-color)" />
        </div>
      </div>

      {/* ── Guests list ───────────────────────────────────────────────────── */}
      <div>
        <div className="dt-list-header">
          <h3 className="dt-list-title">Detalle por invitado</h3>
          <div className="dt-filter-tabs">
            {STATUS_FILTER.map(f => (
              <button
                key={f.key}
                type="button"
                className={`dt-filter-tab ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="dt-tab-count">
                  {f.key === 'all'
                    ? guests.length
                    : guests.filter(g => g.attendance === f.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="dt-guest-list">
          {visible.length === 0 && (
            <p className="dt-empty">No hay invitados en este estado.</p>
          )}
          {visible.map(guest => (
            <div key={guest.id} className={`dt-guest-row adm-card dt-status-${guest.attendance}`}>
              <div className="dt-guest-info">
                <p className="dt-guest-name">{guest.fullName}</p>
                {guest.notes && (
                  <p className="dt-guest-note">💬 {guest.notes}</p>
                )}
              </div>
              <div className="dt-guest-meta">
                {guest.attendance === 'confirmed' && (
                  <span className="dt-persons-badge">
                    👥 {guest.attendanceCount} {guest.attendanceCount === 1 ? 'persona' : 'personas'}
                  </span>
                )}
                <span className={`dt-badge dt-badge-${guest.attendance}`}>
                  {guest.attendance === 'confirmed' && '✅ Confirmado'}
                  {guest.attendance === 'pending'   && '⏳ Pendiente'}
                  {guest.attendance === 'declined'  && '❌ No asistirá'}
                </span>
                <span className="dt-guest-date">{formatDate(guest.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="dt-prog-row">
      <div className="dt-prog-info">
        <span className="dt-prog-label">{label}</span>
        <span className="dt-prog-nums">{value} / {total} · {pct}%</span>
      </div>
      <div className="dt-prog-track">
        <div
          className="dt-prog-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default DashboardTab
