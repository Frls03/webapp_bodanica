import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { coupleName, listMedia, readGuestSession, uploadMedia } from '../data/wedding'
import FloralCorner, { SectionSprig } from '../components/FloralCorner'
import '../pages/Invitation.css'
import './Gallery.css'

// Downscale + re-encode large photos client-side before upload (canvas, no deps).
// Skips small files and non-images — leaves videos untouched.
async function compressImage(file, { maxDim = 1920, quality = 0.75 } = {}) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.size < 1.5 * 1024 * 1024) {
    return file
  }
  try {
    const bitmap = await createImageBitmap(file)
    let { width, height } = bitmap
    if (width > maxDim || height > maxDim) {
      const scale = maxDim / Math.max(width, height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
  } catch {
    return file // compression is best-effort, upload original on any failure
  }
}

function Gallery() {
  const navigate = useNavigate()
  const session = readGuestSession()
  const guestName = session?.guest?.fullName ?? ''

  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function refresh() {
    listMedia().then(setMedia).catch(() => setError('No se pudo cargar la galería.')).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!session?.guest) { navigate('/invitacion'); return }
    document.title = `Fotos y videos | ${coupleName}`
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleFiles(e) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return

    setError('')
    setUploading(true)
    try {
      for (const file of files) {
        const toUpload = await compressImage(file)
        await uploadMedia(toUpload, guestName)
      }
      refresh()
    } catch {
      setError('No se pudo subir tu archivo. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  if (!session?.guest) return null

  return (
    <div className="inv-shell">
      <nav className="inv-nav">
        <div className="inv-nav-brand">{coupleName}</div>
        <a href="/invitacion" className="inv-nav-cta">← Volver a la invitación</a>
      </nav>

      <main>
        <div className="inv-ocean-band">
          <section className="inv-module scroll-reveal" id="galeria">
            <FloralCorner corner="top-right" size="sm" />
            <FloralCorner corner="bottom-left" size="sm" />
            <div className="inv-inner inv-narrow text-center">
              <SectionSprig />
              <h2>Fotos y Videos</h2>
              <div className="divider" />
              <p className="inv-section-copy">
                Comparte los momentos que capturaste de nuestra boda — se suben directo a nuestra galería.
              </p>

              <div className="gal-upload">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="gal-file-input"
                  onChange={handleFiles}
                />
                <button
                  type="button"
                  className="inv-rsvp-submit"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Subiendo…' : '📷 Subir fotos o videos'}
                </button>
                <p className="gal-hint">✦ Máximo 50MB por archivo</p>
                {error && <p className="inv-rsvp-error">{error}</p>}
              </div>
            </div>

            {loading ? (
              <p className="gal-empty">Cargando galería…</p>
            ) : media.length === 0 ? (
              <p className="gal-empty">Todavía no hay fotos ni videos. ¡Sé el primero!</p>
            ) : (
              <div className="gal-grid">
                {media.map(item => (
                  <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="gal-item">
                    {item.isVideo ? (
                      <video src={item.url} muted preload="metadata" />
                    ) : (
                      <img src={item.url} alt="" loading="lazy" />
                    )}
                    {item.isVideo && <span className="gal-play">▶</span>}
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="inv-footer">
        <FloralCorner corner="bottom-left" size="md" />
        <p className="inv-footer-brand">{coupleName}</p>
        <p className="inv-footer-copy">Gracias por guardar estos recuerdos con nosotros.</p>
      </footer>
    </div>
  )
}

export default Gallery
