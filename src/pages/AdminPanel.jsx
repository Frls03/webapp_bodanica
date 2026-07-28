import { useEffect, useState } from 'react'
import PasswordGate from '../components/PasswordGate'
import GuestsTab from './GuestsTab'
import DashboardTab from './DashboardTab'
import TablesTab from './TablesTab'
import { clearAdminSession, coupleName, readAdminSession, saveAdminSession } from '../data/wedding'
import './Admin.css'

const TABS = [
  { id: 'guests',    label: 'Invitados',         icon: '👥' },
  { id: 'dashboard', label: 'Ver invitaciones',   icon: '📊' },
  { id: 'tables',    label: 'Mesas',              icon: '🪑' },
]

function AdminPanel() {
  const [isAuth, setIsAuth]       = useState(() => readAdminSession())
  const [activeTab, setActiveTab] = useState('guests')
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    document.title = `${coupleName} | Admin`
  }, [])

  function handleAuthenticated() {
    saveAdminSession()
    setIsAuth(true)
  }

  function handleLogout() {
    clearAdminSession()
    setIsAuth(false)
  }

  function handleTabChange(id) {
    setActiveTab(id)
    setMenuOpen(false)
  }

  if (!isAuth) {
    return <PasswordGate mode="admin" onAuthenticated={handleAuthenticated} />
  }

  const currentTab = TABS.find(t => t.id === activeTab)

  return (
    <div className="adm-layout">

      {/* ── Sidebar (desktop) ───────────────────────────────────────────── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-top">
          <p className="adm-logo-eyebrow">PANEL ADMIN</p>
          <h1 className="adm-logo-title">{coupleName}</h1>
        </div>

        <nav className="adm-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`adm-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="adm-nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          <button type="button" className="adm-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────────── */}
      <header className="adm-mobile-bar">
        <span className="adm-mobile-title">{currentTab?.icon} {currentTab?.label}</span>
        <button
          type="button"
          className="adm-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menú"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="adm-mobile-drawer">
          <div className="adm-mobile-brand">
            <p className="adm-logo-eyebrow">PANEL ADMIN</p>
            <p className="adm-logo-title">{coupleName}</p>
          </div>
          <nav className="adm-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`adm-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="adm-nav-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          <button type="button" className="adm-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="adm-main">
        {activeTab === 'guests'    && <GuestsTab />}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'tables'    && <TablesTab />}
      </main>
    </div>
  )
}

export default AdminPanel
