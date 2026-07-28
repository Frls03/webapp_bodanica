import { useState } from 'react'
import PasswordGate from '../components/PasswordGate'
import EnvelopeReveal from '../components/EnvelopeReveal'
import Invitation from './Invitation'
import { clearGuestSession, readGuestSession, saveGuestSession } from '../data/wedding'

function Invite() {
  const existing = readGuestSession()

  const [step, setStep] = useState(() => (existing?.guest ? 'invitation' : 'gate'))
  const [guest, setGuest] = useState(() => existing?.guest ?? null)

  function handleAuthenticated(authenticatedGuest) {
    setGuest(authenticatedGuest)
    setStep('envelope')
  }

  function handleEnvelopeOpen() {
    setStep('invitation')
  }

  function handleChangeGuest() {
    clearGuestSession()
    setGuest(null)
    setStep('gate')
  }

  function handleGuestUpdate(updatedGuest) {
    saveGuestSession(updatedGuest)
    setGuest(updatedGuest)
  }

  if (step === 'gate') {
    return <PasswordGate mode="invite" onAuthenticated={handleAuthenticated} />
  }

  if (step === 'envelope') {
    return (
      <EnvelopeReveal
        guestName={guest?.fullName ?? 'Invitado especial'}
        onOpen={handleEnvelopeOpen}
      />
    )
  }

  return (
    <Invitation
      guest={guest}
      onChangeGuest={handleChangeGuest}
      onGuestUpdate={handleGuestUpdate}
    />
  )
}

export default Invite
