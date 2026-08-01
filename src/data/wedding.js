import { supabase } from '../lib/supabaseClient'

// ─── Wedding constants ────────────────────────────────────────────────────────
export const coupleName = 'Fernando & Jesica'
export const eventDateLabel = '14 de noviembre de 2026'
export const eventDateISO = '2026-11-14T14:00:00'
export const eventTimeLabel = '2:00 p.m.'
export const eventLocation = 'Aldea el Conacaste, Casa de Playa Asunción'
export const eventMapsLink = 'https://maps.app.goo.gl/hRLyHZ1qtPaQCys46'
export const eventWazeLink = 'https://ul.waze.com/ul?place=ChIJEWHbhCb1iIURwoaDRfFWEwU&ll=13.93003500%2C-90.66018380&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location'
export const hospedajeMessage = 'Para quienes quieran seguir disfrutando de la celebración, hemos preparado hospedaje cercano por Q160 por persona, ideal para reponer energías tras una noche especial.\nRecuerda que la confirmación del hospedaje es independiente al de la ceremonia, puedes realizarla directamente con nosotros.'

// ─── Storage keys (client-side session convenience only — no credentials) ─────
const GUEST_SESSION_KEY = 'bodanica.invite.session.v1'

// ─── Static invitation content ────────────────────────────────────────────────
export const timeline = [
  { time: '14:00', title: 'LLEGADA', detail: 'Recepción de invitados.' },
  { time: '15:00', title: 'CEREMONIA', detail: 'Unión en la Capilla.' },
  { time: '16:00', title: 'FOTOS CON LOS INVITADOS', detail: 'Sonrisas hoy, recuerdos para toda la vida.' },
  { time: '17:00', title: 'BANQUETE', detail: 'Buena comida, grandes amigos y una tarde inolvidable en la casa de playa.' },
  { time: '18:00', title: 'CELEBRACIÓN', detail: 'Baile y recuerdos hasta el amanecer.' },
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

// ─── DB row <-> app object mapping ─────────────────────────────────────────────
function fromDbGuest(row) {
  return {
    id: row.id,
    password: row.password,
    fullName: row.full_name,
    names: row.names?.length ? row.names : [row.full_name],
    phone: row.phone ?? '',
    notes: row.notes ?? '',
    attendance: row.attendance,
    attendanceCount: row.attendance_count,
    maxAttendees: row.max_attendees,
    tableId: row.table_id ?? '',
    hospedajeFee: row.hospedaje_fee ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toDbGuest(g) {
  return {
    id: g.id,
    password: g.password,
    full_name: g.fullName,
    names: g.names?.length ? g.names : [g.fullName],
    phone: g.phone ?? '',
    notes: g.notes ?? '',
    attendance: g.attendance,
    attendance_count: g.attendanceCount,
    max_attendees: g.maxAttendees,
    table_id: g.tableId ?? '',
    hospedaje_fee: g.hospedajeFee ?? null,
    updated_at: new Date().toISOString(),
  }
}

// ─── Guest CRUD (admin — requires an authenticated Supabase session) ──────────
export function generateId() {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export async function fetchGuests() {
  const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromDbGuest)
}

export async function saveGuests(guests) {
  const { error } = await supabase.from('guests').upsert(guests.map(toDbGuest))
  if (error) throw error
}

export async function deleteGuestRemote(id) {
  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) throw error
}

export function createGuest(data) {
  const now = new Date().toISOString()
  const fullName = String(data.fullName ?? '').trim()
  return {
    id: generateId(),
    password: String(data.password ?? '').trim(),
    fullName,
    names: [fullName],
    phone: '',
    notes: String(data.notes ?? '').trim(),
    attendance: 'pending',
    attendanceCount: 0,
    maxAttendees: Math.max(1, Number(data.maxAttendees) || 1),
    tableId: '',
    hospedajeFee: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function assignGuestToTable(guests, guestId, tableId) {
  return guests.map(g =>
    g.id === guestId
      ? { ...g, tableId: tableId ?? '', updatedAt: new Date().toISOString() }
      : g
  )
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

// ─── Table CRUD (admin) ─────────────────────────────────────────────────────
export async function fetchTables() {
  const { data, error } = await supabase.from('tables').select('*').order('name')
  if (error) throw error
  return data
}

export async function saveTables(tables) {
  const { error } = await supabase.from('tables').upsert(tables)
  if (error) throw error
}

export async function deleteTableRemote(id) {
  const { error } = await supabase.from('tables').delete().eq('id', id)
  if (error) throw error
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

// ─── Guest-facing auth + RSVP (password-gated Postgres RPCs, no direct table access) ─
export async function loginGuest(password) {
  const { data, error } = await supabase.rpc('login_guest', { p_password: password })
  if (error) throw error
  return data?.[0] ? fromDbGuest(data[0]) : null
}

export async function submitRsvp(guest, { attendance, attendanceCount, notes }) {
  const { data, error } = await supabase.rpc('submit_rsvp', {
    p_guest_id: guest.id,
    p_password: guest.password,
    p_attendance: attendance,
    p_attendance_count: attendanceCount,
    p_notes: notes,
  })
  if (error) throw error
  if (!data?.[0]) throw new Error('No se pudo actualizar la confirmación.')
  return fromDbGuest(data[0])
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

// Admin session lives in Supabase Auth itself (no local credential storage).
export async function readAdminSession() {
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function logoutAdmin() {
  await supabase.auth.signOut()
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

// ─── Invitation message (for the admin "copy" button) ──────────────────────────
export function buildInvitationMessage(guest) {
  const firstName = (guest.names?.[0] ?? guest.fullName).split(' ')[0]
  const link = 'https://bodafj.site/invitacion'
  return `Querido/a ${firstName}, es un honor invitarte a nuestra boda civil. Aquí tienes el link para tu invitación con su contraseña:\n${link}\nContraseña: ${guest.password}`
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
