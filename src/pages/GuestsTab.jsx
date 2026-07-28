import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import {
  createGuest,
  deleteGuestFromList,
  EXCEL_TEMPLATE_HEADERS,
  formatDate,
  parseExcelRows,
  readGuests,
  saveGuests,
  updateGuestInList,
} from '../data/wedding'
import './GuestsTab.css'

const EMPTY_FORM = {
  fullName: '',
  password: '',
  maxAttendees: '1',
  notes: '',
  attendance: 'pending',
}

const ATTENDANCE_LABELS = {
  confirmed: 'Confirmado',
  declined:  'No asistirá',
  pending:   'Pendiente',
}

function GuestsTab() {
  const [guests, setGuests]         = useState(readGuests)
  const [search, setSearch]         = useState('')
  const [filter, setFilter]         = useState('all')
  const [modal, setModal]           = useState(null) // null | { mode: 'add'|'edit', guest }
  const [form, setForm]             = useState(EMPTY_FORM)
  const [formError, setFormError]   = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null) // guestId
  const [excelPreview, setExcelPreview]  = useState(null) // array of guests to import
  const fileRef = useRef(null)

  function persist(next) {
    setGuests(next)
    saveGuests(next)
  }

  // ── Filtering ────────────────────────────────────────────────────────────
  const visible = guests.filter(g => {
    const matchSearch = g.fullName.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'confirmed' && g.attendance === 'confirmed') ||
      (filter === 'pending'   && g.attendance === 'pending')   ||
      (filter === 'declined'  && g.attendance === 'declined')
    return matchSearch && matchFilter
  })

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setForm(EMPTY_FORM)
    setFormError('')
    setModal({ mode: 'add' })
  }

  function openEdit(guest) {
    setForm({
      fullName:    guest.fullName,
      password:    guest.password,
      maxAttendees: String(guest.maxAttendees),
      notes:       guest.notes ?? '',
      attendance:  guest.attendance,
    })
    setFormError('')
    setModal({ mode: 'edit', guest })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
  }

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.fullName.trim()) { setFormError('El nombre es obligatorio.'); return }
    if (!form.password.trim()) { setFormError('La contraseña es obligatoria.'); return }

    const passwordExists = guests.some(
      g => g.password === form.password.trim() &&
           (modal.mode === 'add' || g.id !== modal.guest.id)
    )
    if (passwordExists) { setFormError('Esta contraseña ya está en uso.'); return }

    if (modal.mode === 'add') {
      persist([createGuest(form), ...guests])
    } else {
      persist(
        updateGuestInList(guests, modal.guest.id, {
          fullName:    form.fullName.trim(),
          password:    form.password.trim(),
          maxAttendees: Math.max(1, Number(form.maxAttendees) || 1),
          notes:       form.notes.trim(),
          attendance:  form.attendance,
        })
      )
    }
    closeModal()
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function handleDelete(id) {
    persist(deleteGuestFromList(guests, id))
    setConfirmDelete(null)
  }

  // ── Excel download template ───────────────────────────────────────────────
  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([
      EXCEL_TEMPLATE_HEADERS,
      ['María García', 'boda-001', '2', 'Vegetariana'],
      ['Juan Pérez',   'boda-002', '4', ''],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Invitados')
    XLSX.writeFile(wb, 'plantilla_invitados.xlsx')
  }

  // ── Excel upload ──────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const data = new Uint8Array(ev.target.result)
      const wb   = XLSX.read(data, { type: 'array' })
      const ws   = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws)
      setExcelPreview(parseExcelRows(rows))
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  function confirmExcelImport() {
    if (!excelPreview) return
    const existingPasswords = new Set(guests.map(g => g.password))
    const toAdd = excelPreview.filter(g => !existingPasswords.has(g.password))
    persist([...toAdd, ...guests])
    setExcelPreview(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="gt-root">
      <div className="gt-header">
        <div>
          <h2 className="adm-section-title">Invitados</h2>
          <p className="adm-section-subtitle">{guests.length} invitados registrados</p>
        </div>
        <div className="gt-header-actions">
          <button type="button" className="gt-btn-secondary" onClick={downloadTemplate}>
            📥 Plantilla Excel
          </button>
          <button type="button" className="gt-btn-secondary" onClick={() => fileRef.current?.click()}>
            📂 Cargar Excel
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="gt-hidden-input"
            onChange={handleFileChange}
          />
          <button type="button" className="gt-btn-primary" onClick={openAdd}>
            + Agregar invitado
          </button>
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="gt-filters">
        <input
          type="search"
          className="gt-search"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="gt-filter-pills">
          {['all', 'confirmed', 'pending', 'declined'].map(f => (
            <button
              key={f}
              type="button"
              className={`gt-filter-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all'       ? 'Todos'        : ''}
              {f === 'confirmed' ? '✅ Confirmados' : ''}
              {f === 'pending'   ? '⏳ Pendientes'  : ''}
              {f === 'declined'  ? '❌ No asistirán': ''}
            </button>
          ))}
        </div>
      </div>

      {/* ── Excel preview ─────────────────────────────────────────────────── */}
      {excelPreview && (
        <div className="gt-excel-preview adm-card">
          <p className="gt-excel-title">
            📊 Se encontraron <strong>{excelPreview.length}</strong> invitados en el archivo.
          </p>
          <p className="gt-excel-sub">
            Se agregarán los que no tengan contraseñas duplicadas con los existentes.
          </p>
          <div className="gt-excel-actions">
            <button type="button" className="gt-btn-primary" onClick={confirmExcelImport}>
              Confirmar importación
            </button>
            <button type="button" className="gt-btn-ghost" onClick={() => setExcelPreview(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Guests table ──────────────────────────────────────────────────── */}
      <div className="adm-card gt-table-wrap">
        {visible.length === 0 ? (
          <p className="gt-empty">No se encontraron invitados con ese filtro.</p>
        ) : (
          <table className="gt-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contraseña</th>
                <th>Máx.</th>
                <th>Estado</th>
                <th>Mesa</th>
                <th>Fecha creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(guest => (
                <tr key={guest.id}>
                  <td className="gt-td-name">{guest.fullName}</td>
                  <td>
                    <code className="gt-password-chip">{guest.password}</code>
                  </td>
                  <td className="gt-td-center">{guest.maxAttendees}</td>
                  <td>
                    <span className={`gt-status-badge gt-status-${guest.attendance}`}>
                      {ATTENDANCE_LABELS[guest.attendance] ?? guest.attendance}
                    </span>
                  </td>
                  <td className="gt-td-center">{guest.tableId || '—'}</td>
                  <td className="gt-td-date">{formatDate(guest.createdAt)}</td>
                  <td>
                    <div className="gt-row-actions">
                      <button
                        type="button"
                        className="gt-action-btn edit"
                        onClick={() => openEdit(guest)}
                        aria-label="Editar"
                      >
                        ✏️
                      </button>
                      {confirmDelete === guest.id ? (
                        <>
                          <button
                            type="button"
                            className="gt-action-btn confirm-del"
                            onClick={() => handleDelete(guest.id)}
                          >
                            Sí, eliminar
                          </button>
                          <button
                            type="button"
                            className="gt-action-btn cancel-del"
                            onClick={() => setConfirmDelete(null)}
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="gt-action-btn delete"
                          onClick={() => setConfirmDelete(guest.id)}
                          aria-label="Eliminar"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modal && (
        <div className="gt-modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="gt-modal" role="dialog" aria-modal="true">
            <div className="gt-modal-header">
              <h3>{modal.mode === 'add' ? 'Agregar invitado' : 'Editar invitado'}</h3>
              <button type="button" className="gt-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="gt-modal-body">
              <div className="gt-field">
                <label className="gt-label" htmlFor="gf-name">Nombre completo *</label>
                <input
                  id="gf-name"
                  type="text"
                  className="gt-input"
                  value={form.fullName}
                  onChange={e => handleFormChange('fullName', e.target.value)}
                  placeholder="Ej: María García"
                />
              </div>

              <div className="gt-field">
                <label className="gt-label" htmlFor="gf-pwd">Contraseña de acceso *</label>
                <input
                  id="gf-pwd"
                  type="text"
                  className="gt-input"
                  value={form.password}
                  onChange={e => handleFormChange('password', e.target.value)}
                  placeholder="Ej: boda-garcia-01"
                />
              </div>

              <div className="gt-field-row">
                <div className="gt-field">
                  <label className="gt-label" htmlFor="gf-max">Máx. personas</label>
                  <input
                    id="gf-max"
                    type="number"
                    className="gt-input"
                    min={1}
                    max={20}
                    value={form.maxAttendees}
                    onChange={e => handleFormChange('maxAttendees', e.target.value)}
                  />
                </div>

                {modal.mode === 'edit' && (
                  <div className="gt-field">
                    <label className="gt-label" htmlFor="gf-status">Estado</label>
                    <select
                      id="gf-status"
                      className="gt-input"
                      value={form.attendance}
                      onChange={e => handleFormChange('attendance', e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="declined">No asistirá</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="gt-field">
                <label className="gt-label" htmlFor="gf-notes">Notas / Restricciones</label>
                <textarea
                  id="gf-notes"
                  className="gt-input gt-textarea"
                  rows={3}
                  value={form.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                  placeholder="Ej: Vegetariana, alergia a nueces…"
                />
              </div>

              {formError && <p className="gt-form-error">{formError}</p>}
            </div>

            <div className="gt-modal-footer">
              <button type="button" className="gt-btn-ghost" onClick={closeModal}>Cancelar</button>
              <button type="button" className="gt-btn-primary" onClick={handleSave}>
                {modal.mode === 'add' ? 'Agregar' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestsTab
