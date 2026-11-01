import { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import {
connecter,
SESSION_EXPIREE_EVENT,
type SessionUtilisateur,
} from './services/api'

function App() {
const [identifiant, setIdentifiant] = useState('')
const [motDePasse, setMotDePasse] = useState('')
const [token, setToken] = useState<string | null>(null)
const [utilisateur, setUtilisateur] =
useState<SessionUtilisateur | null>(null)
const [chargement, setChargement] = useState(false)
const [erreur, setErreur] = useState('')

function handleLogout(message = '') {
setToken(null)
setUtilisateur(null)
setIdentifiant('')
setMotDePasse('')
setErreur(message)
}

useEffect(() => {
function gererExpirationSession() {
handleLogout('Votre session a expiré. Veuillez vous reconnecter.')
}

window.addEventListener(
  SESSION_EXPIREE_EVENT,
  gererExpirationSession,
)

return () => {
  window.removeEventListener(
    SESSION_EXPIREE_EVENT,
    gererExpirationSession,
  )
}

}, [])

async function handleSubmit(
event: React.FormEvent<HTMLFormElement>,
) {
event.preventDefault()
setErreur('')

if (!identifiant.trim() || !motDePasse) {
  setErreur('Veuillez remplir tous les champs.')
  return
}

setChargement(true)

try {
  const resultat = await connecter(
    identifiant.trim(),
    motDePasse,
  )

  if (resultat.utilisateur.role !== 'DIRECTEUR_GENERAL') {
    setErreur(
      "Ce compte ne possède pas les droits de la Direction générale.",
    )
    setMotDePasse('')
    return
  }

  setToken(resultat.token)
  setUtilisateur(resultat.utilisateur)
  setMotDePasse('')
} catch (error) {
  setErreur(
    error instanceof Error
      ? error.message
      : 'Impossible de se connecter au serveur.',
  )
} finally {
  setChargement(false)
}

}

if (token && utilisateur) {
return (
<Dashboard
token={token}
utilisateur={utilisateur}
onLogout={() => handleLogout()}
/>
)
}

return (
<main className="flex min-h-screen flex-col bg-white md:flex-row">
<section className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 px-6 py-10 text-white md:min-h-screen md:w-1/2">
<div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
<div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />

    <div className="relative z-10 flex max-w-md flex-col items-center text-center">
      <img
        src="/images/logo-mapendo.png"
        alt="Logo MAPENDO+ TV"
        className="mb-6 h-28 w-auto rounded-xl object-contain md:h-40"
      />

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
        Votre télévision
      </p>

      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
        MAPENDO<span className="text-red-500">+</span> TV
      </h1>

      <p className="mt-5 max-w-sm text-sm leading-7 text-gray-300 md:text-base">
        Une plateforme de gestion et de supervision au service de
        l'excellence télévisuelle.
      </p>

      <div className="mt-8 h-1 w-16 rounded-full bg-red-500" />

      <p className="mt-5 text-xs tracking-wide text-gray-400">
        Excellence · Innovation · Information
      </p>
    </div>
  </section>

  <section className="flex flex-1 items-center justify-center px-6 py-12 md:px-12">
    <div className="w-full max-w-md">
      <div className="mb-9">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
          Espace sécurisé
        </p>

        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          Direction générale
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Connectez-vous pour accéder au système de gestion de
          MAPENDO+ TV.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="identifiant"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Identifiant
          </label>

          <input
            id="identifiant"
            type="text"
            required
            autoComplete="username"
            placeholder="Entrez votre identifiant"
            value={identifiant}
            onChange={(event) =>
              setIdentifiant(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
          />
        </div>

        <div>
          <label
            htmlFor="motDePasse"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Mot de passe
          </label>

          <input
            id="motDePasse"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Entrez votre mot de passe"
            value={motDePasse}
            onChange={(event) =>
              setMotDePasse(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
          />
        </div>

        {erreur && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {erreur}
          </div>
        )}

        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {chargement
            ? 'Connexion en cours...'
            : 'Se connecter →'}
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Accès réservé au personnel autorisé
      </div>

      <p className="mt-10 text-center text-xs text-gray-400">
        © 2026 MAPENDO+ TV · Tous droits réservés
      </p>
    </div>
  </section>
</main>

)
}

export default App