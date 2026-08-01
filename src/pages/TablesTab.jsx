import { useEffect, useState } from 'react'
import {
  assignGuestToTable,
  createTable,
  deleteTableFromList,
  deleteTableRemote,
  fetchGuests,
  fetchTables,
  saveGuests,
  saveTables,
  updateTableInList,
} from '../data/wedding'
import './TablesTab.css'

// ─── Table modal ──────────────────────────────────────────────────────────────
function TableModal({ mode, table, onSave, onClose }) {
  const [name, setName]         = useState(table?.name ?? '')
  const [area, setArea]         = useState(table?.area ?? '')
  const [capacity, setCapacity] = useState(String(table?.capacity ?? '8'))

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ name: name.trim(), area: area.trim(), capacity: Number(capacity) })
  }

  return (
    <div className="tt-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="tt-modal">
        <div className="tt-modal-header">
          <h2>{mode === 'add' ? 'Nueva Mesa' : 'Editar Mesa'}</h2>
          <button className="tt-modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="tt-modal-body" onSubmit={handleSubmit}>
          <div className="tt-form-field">
            <label>Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Mesa Principal" required autoFocus />
          </div>
          <div className="tt-form-field">
            <label>Zona / Área</label>
            <input type="text" value={area} onChange={e => setArea(e.target.value)}
              placeholder="Familia, Amigos, VIP…" />
          </div>
          <div className="tt-form-field">
            <label>Capacidad de sillas</label>
            <input type="number" value={capacity} min="2" max="30"
              onChange={e => setCapacity(e.target.value)} required />
          </div>
          <div className="tt-modal-actions">
            <button type="button" className="tt-btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="tt-btn-save">
              {mode === 'add' ? 'Agregar mesa' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TablesTab() {
  const [guests, setGuests] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(null)   // null | { mode, table }
  const [confirmDel, setConfirmDel] = useState(null) // table id | null

  useEffect(() => {
    Promise.all([fetchGuests(), fetchTables()])
      .then(([g, t]) => { setGuests(g); setTables(t) })
      .finally(() => setLoading(false))
  }, [])

  const confirmed = guests.filter(g => g.attendance === 'confirmed')
  const unassignedCount = confirmed.filter(g => !g.tableId).length
  const totalPersons = confirmed.reduce((s, g) => s + g.attendanceCount, 0)

  function occupancy(tableId) {
    return confirmed
      .filter(g => g.tableId === tableId)
      .reduce((s, g) => s + g.attendanceCount, 0)
  }

  // ── Assign guest to table (picker) ─────────────────────────────────────────
  async function handleAssign(guest, tableId) {
    const next = assignGuestToTable(guests, guest.id, tableId)
    setGuests(next)
    try {
      await saveGuests(next)
    } catch (err) {
      alert(`No se pudo guardar: ${err.message}`)
    }
  }

  // ── Table CRUD ───────────────────────────────────────────────────────────
  async function handleSaveTable(formData) {
    let nextTables

    if (modal.mode === 'add') {
      nextTables = [...tables, createTable(formData)]
    } else {
      const tableId = modal.table.id
      const newCap  = Math.max(2, Math.min(30, Number(formData.capacity) || modal.table.capacity))
      nextTables = updateTableInList(tables, tableId, { ...formData, capacity: newCap })

      // Unassign guests who no longer fit under the new (smaller) capacity
      if (occupancy(tableId) > newCap) {
        const nextGuests = guests.map(g =>
          g.tableId === tableId ? { ...g, tableId: '', updatedAt: new Date().toISOString() } : g
        )
        setGuests(nextGuests)
        saveGuests(nextGuests)
      }
    }

    setTables(nextTables); setModal(null)
    try {
      await saveTables(nextTables)
    } catch (err) {
      alert(`No se pudo guardar la mesa: ${err.message}`)
    }
  }

  async function handleDeleteTable(tableId) {
    const nextTables = deleteTableFromList(tables, tableId)
    const nextGuests = guests.map(g =>
      g.tableId === tableId ? { ...g, tableId: '', updatedAt: new Date().toISOString() } : g
    )
    setTables(nextTables)
    setGuests(nextGuests); saveGuests(nextGuests)
    setConfirmDel(null)
    try {
      await deleteTableRemote(tableId)
    } catch (err) {
      alert(`No se pudo eliminar la mesa: ${err.message}`)
    }
  }

  if (loading) return <p className="tt-empty">Cargando mesas…</p>

  return (
    <div className="tt-root">
      <div className="tt-page-header">
        <div>
          <h2 className="adm-section-title">Mesas</h2>
          <p className="adm-section-subtitle">
            Elige la mesa de cada invitado confirmado desde la lista — el cupo se valida solo.
          </p>
        </div>
        <button className="tt-btn-add-table" onClick={() => setModal({ mode: 'add', table: null })}>
          + Nueva Mesa
        </button>
      </div>

      <div className="tt-summary adm-card">
        <div className="tt-sum-item">
          <span className="tt-sum-num">{confirmed.length}</span>
          <span className="tt-sum-label">Invitaciones</span>
        </div>
        <div className="tt-sum-sep" />
        <div className="tt-sum-item">
          <span className="tt-sum-num">{totalPersons}</span>
          <span className="tt-sum-label">Personas</span>
        </div>
        <div className="tt-sum-sep" />
        <div className="tt-sum-item">
          <span className={`tt-sum-num ${unassignedCount > 0 ? 'warn' : 'ok'}`}>
            {unassignedCount}
          </span>
          <span className="tt-sum-label">Sin mesa</span>
        </div>
        <div className="tt-sum-sep" />
        <div className="tt-sum-item">
          <span className="tt-sum-num">{tables.length}</span>
          <span className="tt-sum-label">Mesas</span>
        </div>
      </div>

      {/* ── Table cards (read-only roster) ─────────────────────────────────── */}
      <div className="tt-tables-grid">
        {tables.map(t => {
          const used = occupancy(t.id)
          const isFull = used >= t.capacity
          const tableGuests = confirmed.filter(g => g.tableId === t.id)
          return (
            <div className="tt-table-card" key={t.id}>
              <div className="tt-table-card-header">
                <div className="tt-table-card-info">
                  <h3 className="tt-table-card-name">{t.name}</h3>
                  <p className="tt-table-card-area">{t.area}</p>
                </div>
                <div className="tt-table-card-actions">
                  <span className={`tt-seat-badge ${isFull ? 'full' : ''}`}>{used}/{t.capacity}</span>
                  <button className="tt-icon-btn" title="Editar mesa" onClick={() => setModal({ mode: 'edit', table: t })}>✏</button>
                  <button className="tt-icon-btn danger" title="Eliminar mesa" onClick={() => setConfirmDel(t.id)}>🗑</button>
                </div>
              </div>

              {confirmDel === t.id && (
                <div className="tt-confirm-del">
                  <p>¿Eliminar <strong>{t.name}</strong>? Los invitados asignados quedarán sin mesa.</p>
                  <div className="tt-confirm-del-btns">
                    <button className="tt-btn-cancel" onClick={() => setConfirmDel(null)}>Cancelar</button>
                    <button className="tt-btn-del-confirm" onClick={() => handleDeleteTable(t.id)}>Eliminar</button>
                  </div>
                </div>
              )}

              <ul className="tt-roster">
                {tableGuests.length === 0
                  ? <li className="tt-roster-empty">Sin invitados asignados</li>
                  : tableGuests.map(g => (
                      <li key={g.id}>
                        {g.fullName}
                        {g.attendanceCount > 1 && <em> · {g.attendanceCount}p</em>}
                      </li>
                    ))
                }
              </ul>
            </div>
          )
        })}

        <button className="tt-add-card" onClick={() => setModal({ mode: 'add', table: null })}>
          <span className="tt-add-icon">+</span>
          <span>Nueva Mesa</span>
        </button>
      </div>

      {/* ── Assignment list — one picker per confirmed guest ─────────────────── */}
      <div className="adm-card tt-assign-card">
        <h3 className="tt-assign-title">Asignar invitados</h3>
        {confirmed.length === 0 ? (
          <p className="tt-empty">Todavía no hay invitados confirmados.</p>
        ) : (
          <div className="tt-assign-list">
            {confirmed.map(g => (
              <div className="tt-assign-row" key={g.id}>
                <span className="tt-assign-name">
                  {g.fullName}
                  {g.attendanceCount > 1 && <em> · {g.attendanceCount}p</em>}
                </span>
                <select
                  className="tt-assign-select"
                  value={g.tableId || ''}
                  onChange={e => handleAssign(g, e.target.value)}
                >
                  <option value="">Sin mesa</option>
                  {tables.map(t => (
                    <option
                      key={t.id}
                      value={t.id}
                      disabled={t.id !== g.tableId && occupancy(t.id) + g.attendanceCount > t.capacity}
                    >
                      {t.name} ({occupancy(t.id)}/{t.capacity})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <TableModal
          mode={modal.mode}
          table={modal.table}
          onSave={handleSaveTable}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
