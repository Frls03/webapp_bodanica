// ─── Wedding constants ────────────────────────────────────────────────────────
export const coupleName = 'Fernando & Jesica'
export const eventDateLabel = '14 de noviembre de 2026'
export const eventDateISO = '2026-11-14T17:00:00'
export const eventTimeLabel = '17:00 p.m.'
export const eventLocation = 'Aldea el Conacaste, Casa de Playa Asunción'
export const eventMapsLink = 'https://maps.app.goo.gl/hRLyHZ1qtPaQCys46'
export const eventWazeLink = 'https://ul.waze.com/ul?place=ChIJEWHbhCb1iIURwoaDRfFWEwU&ll=13.93003500%2C-90.66018380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location'
export const adminUsername = 'admin'
export const adminPassword = 'fj2026'

// ─── Storage keys ─────────────────────────────────────────────────────────────
const GUEST_SESSION_KEY = 'bodanica.invite.session.v1'
const ADMIN_SESSION_KEY = 'bodanica.admin.session.v1'
const GUESTS_KEY = 'bodanica.guests.v1'
const TABLES_KEY = 'bodanica.tables.v1'

// ─── Table catalog (default seed) ─────────────────────────────────────────────
export const tableCatalog = [
  { id: 'mesa-1', name: 'Mesa 1', capacity: 8,  area: 'Familia cercana' },
  { id: 'mesa-2', name: 'Mesa 2', capacity: 8,  area: 'Amistades' },
  { id: 'mesa-3', name: 'Mesa 3', capacity: 10, area: 'Colegas' },
  { id: 'mesa-4', name: 'Mesa 4', capacity: 6,  area: 'VIP' },
  { id: 'mesa-5', name: 'Mesa 5', capacity: 10, area: 'Flexible' },
]

// ─── Table CRUD ───────────────────────────────────────────────────────────────
export function readTables() {
  try {
    const raw = localStorage.getItem(TABLES_KEY)
    if (!raw) return [...tableCatalog]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...tableCatalog]
  } catch {
    return [...tableCatalog]
  }
}

export function saveTables(tables) {
  localStorage.setItem(TABLES_KEY, JSON.stringify(tables))
}

export function createTable(data) {
  return {
    id: `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    name: String(data.name ?? '').trim(),
    area: String(data.area ?? '').trim(),
    capacity: Math.max(2, Math.min(30, Number(data.capacity) || 8)),
  }
}

export function updateTableInList(tables, id, changes) {
  return tables.map(t => t.id === id ? { ...t, ...changes, capacity: Math.max(2, Math.min(30, Number(changes.capacity) || t.capacity)) } : t)
}

export function deleteTableFromList(tables, id) {
  return tables.filter(t => t.id !== id)
}

// ─── Static invitation content ────────────────────────────────────────────────
export const timeline = [
  { time: '2:00 p.m.', title: 'LLEGADA', detail: 'Recepción de invitados.' },
  { time: '3:00 p.m.', title: 'CEREMONIA', detail: 'Unión en la Capilla.' },
  { time: '4:00 p.m.', title: 'FOTOS CON LOS INVITADOS', detail: 'Sonrisas hoy, recuerdos para toda la vida.' },
  { time: '5:00 p.m.', title: 'BANQUETE', detail: 'Buena comida, grandes amigos y una tarde inolvidable en la casa de playa.' },
  { time: '6:00 p.m.', title: 'CELEBRACIÓN', detail: 'Baile y recuerdos hasta el amanecer.' },
]

export const dressCode = {
  palette: ['#FFFFFF', '#F8F5EE', '#F1E4C9'],
  men: 'Ropa fresca de color blanco.',
  women: 'Vestido o conjunto blanco.',
  notes: ['Estilo Playero · Casual', 'El uso del color blanco es indispensable.'],
}

export const gifts = [
  { title: 'LLUVIA DE SOBRES', detail: 'Contaremos con un buzón el día del evento.' },
  { title: 'TRANSFERENCIA', detail: 'Cuenta: 0120334552 · Banco Industrial · Monetaria BI' },
]

export const practicalAdvice = [
  'El evento es al aire libre, considera llevar algo para cubrirte.',
  'Sugerimos calzado cómodo.',
  'Contamos con espacio para parqueo.',
]

// ─── Seed guests ──────────────────────────────────────────────────────────────
const SEED_GUESTS = [
  {
    id: 'g-001',
    password: 'jasmin-101',
    fullName: 'Alicia Pérez',
    names: ['Alicia Pérez'],
    notes: 'Sin mariscos',
    attendance: 'confirmed',
    attendanceCount: 2,
    maxAttendees: 2,
    tableId: 'mesa-1',
    seatNumbers: [1, 2],
    createdAt: '2026-06-01T10:15:00.000Z',
    updatedAt: '2026-06-01T10:15:00.000Z',
  },
  {
    id: 'g-002',
    password: 'jasmin-202',
    fullName: 'Carlos Méndez',
    names: ['Carlos Méndez'],
    notes: 'Vegetariano para una persona',
    attendance: 'pending',
    attendanceCount: 0,
    maxAttendees: 4,
    tableId: '',
    createdAt: '2026-06-03T19:45:00.000Z',
    updatedAt: '2026-06-03T19:45:00.000Z',
  },
  {
    id: 'g-003',
    password: 'jasmin-303',
    fullName: 'Sofía Ramírez',
    names: ['Sofía Ramírez'],
    notes: 'Alergia a nueces',
    attendance: 'confirmed',
    attendanceCount: 3,
    maxAttendees: 3,
    tableId: 'mesa-3',
    seatNumbers: [1, 2, 3],
    createdAt: '2026-06-06T13:30:00.000Z',
    updatedAt: '2026-06-06T13:30:00.000Z',
  },
  {
    id: 'g-004',
    password: 'jasmin-404',
    fullName: 'Javier Torres',
    names: ['Javier Torres'],
    notes: '',
    attendance: 'declined',
    attendanceCount: 0,
    maxAttendees: 2,
    tableId: '',
    createdAt: '2026-06-07T08:00:00.000Z',
    updatedAt: '2026-06-07T08:00:00.000Z',
  },
  {
    id: 'g-005',
    password: 'jasmin-505',
    fullName: 'Valentina Cruz',
    names: ['Valentina Cruz'],
    notes: 'Celíaca',
    attendance: 'confirmed',
    attendanceCount: 2,
    maxAttendees: 2,
    tableId: '',
    createdAt: '2026-06-08T09:00:00.000Z',
    updatedAt: '2026-06-08T09:00:00.000Z',
  },
]

// ─── Guest CRUD ───────────────────────────────────────────────────────────────
export function generateId() {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function readGuests() {
  try {
    const raw = localStorage.getItem(GUESTS_KEY)
    if (!raw) return [...SEED_GUESTS]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_GUESTS]
  } catch {
    return [...SEED_GUESTS]
  }
}

export function saveGuests(guests) {
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests))
}

// Searches ALL saved guests (including those added via admin)
export function findGuestByPassword(password) {
  const safePassword = password.trim().toLowerCase()
  return readGuests().find(g => g.password.toLowerCase() === safePassword) ?? null
}

export function createGuest(data) {
  const now = new Date().toISOString()
  const fullName = String(data.fullName ?? '').trim()
  return {
    id: generateId(),
    password: String(data.password ?? '').trim(),
    fullName,
    names: [fullName],
    notes: String(data.notes ?? '').trim(),
    attendance: 'pending',
    attendanceCount: 0,
    maxAttendees: Math.max(1, Number(data.maxAttendees) || 1),
    tableId: '',
    seatNumbers: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function assignGuestToSeats(guests, guestId, tableId, startSeat, tables) {
  const dragged = guests.find(g => g.id === guestId)
  if (!dragged) return guests

  const now = new Date().toISOString()

  if (!tableId || startSeat == null) {
    return guests.map(g =>
      g.id === guestId ? { ...g, tableId: '', seatNumbers: [], updatedAt: now } : g
    )
  }

  // Use the live tables list (with user edits) falling back to the static catalog
  const tableList = Array.isArray(tables) && tables.length ? tables : tableCatalog
  const table = tableList.find(t => t.id === tableId)
  if (!table) return guests

  const cap   = table.capacity
  const count = Math.min(dragged.attendanceCount || 1, cap)
  // Clamp start so the group never wraps past the last seat
  const adjustedStart = Math.max(1, Math.min(startSeat, cap - count + 1))
  const targetSeats = Array.from({ length: count }, (_, i) => adjustedStart + i)

  // If any target seat is already taken by another guest → reject drop entirely
  const hasConflict = guests.some(g =>
    g.id !== guestId &&
    g.tableId === tableId &&
    (g.seatNumbers ?? []).some(sn => targetSeats.includes(sn))
  )
  if (hasConflict) return guests

  return guests.map(g => {
    if (g.id === guestId) return { ...g, tableId, seatNumbers: targetSeats, updatedAt: now }
    return g
  })
}

export function updateGuestInList(guests, id, changes) {
  return guests.map(g => {
    if (g.id !== id) return g
    const fullName = changes.fullName ?? g.fullName
    return { ...g, ...changes, fullName, names: [fullName], updatedAt: new Date().toISOString() }
  })
}

export function deleteGuestFromList(guests, id) {
  return guests.filter(g => g.id !== id)
}

export function upsertGuest(guests, updatedGuest) {
  const idx = guests.findIndex(g => g.id === updatedGuest.id)
  if (idx === -1) return [updatedGuest, ...guests]
  const next = [...guests]
  next[idx] = { ...updatedGuest, updatedAt: new Date().toISOString() }
  return next
}

export function assignGuestToTable(guests, guestId, tableId) {
  return guests.map(g =>
    g.id === guestId
      ? { ...g, tableId: tableId ?? '', updatedAt: new Date().toISOString() }
      : g
  )
}

// ─── Session management ────────────────────────────────────────────────────────
export function readGuestSession() {
  try {
    const raw = sessionStorage.getItem(GUEST_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.guest ? parsed : null
  } catch {
    return null
  }
}

export function saveGuestSession(guest) {
  sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify({ guest, lastActive: Date.now() }))
}

export function clearGuestSession() {
  sessionStorage.removeItem(GUEST_SESSION_KEY)
}

export function readAdminSession() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

export function saveAdminSession() {
  localStorage.setItem(ADMIN_SESSION_KEY, 'true')
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

// ─── Guest type ───────────────────────────────────────────────────────────────
export function getGuestType(guest) {
  const names = (guest.names ?? [guest.fullName]).filter(n => String(n ?? '').trim())
  const max = guest.maxAttendees ?? 1
  if (max >= 3) return 'family'
  if (max === 2 && names.length >= 2) return 'couple'
  if (max === 2) return 'plusone'
  return 'single'
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function buildStats(guests) {
  const confirmed = guests.filter(g => g.attendance === 'confirmed')
  const declined = guests.filter(g => g.attendance === 'declined')
  const pending = guests.filter(g => g.attendance === 'pending')
  const totalAttendees = confirmed.reduce((s, g) => s + g.attendanceCount, 0)

  return {
    total: guests.length,
    confirmed: confirmed.length,
    declined: declined.length,
    pending: pending.length,
    totalAttendees,
  }
}

// ─── Formatting ────────────────────────────────────────────────────────────────
export function formatDate(isoDate) {
  if (!isoDate) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoDate))
}

export function getInvitedName() {
  const params = new URLSearchParams(window.location.search)
  return params.get('invitado')?.trim() ?? 'Invitado especial'
}

// ─── Excel import/export ──────────────────────────────────────────────────────
export const EXCEL_TEMPLATE_HEADERS = ['Nombre Completo', 'Contraseña', 'Máx. Invitados', 'Notas']

export function parseExcelRows(rows) {
  return rows
    .filter(row => String(row['Nombre Completo'] ?? '').trim())
    .map(row =>
      createGuest({
        fullName: String(row['Nombre Completo'] ?? '').trim(),
        password: String(row['Contraseña'] ?? '').trim(),
        maxAttendees: Number(row['Máx. Invitados']) || 1,
        notes: String(row['Notas'] ?? '').trim(),
      })
    )
}
