import { useCallback, useEffect, useState } from 'react'
import {
Search,
Plus,
Users,
UserRound,
ShieldCheck,
ShieldOff,
RefreshCw,
X,
LoaderCircle,
} from 'lucide-react'

import {
obtenirUtilisateurs,
creerUtilisateur,
modifierStatutUtilisateur,
type Utilisateur,
type RoleUtilisateur,
} from '../services/api'

type UtilisateursProps = {
token: string
}

const ROLES: { valeur: RoleUtilisateur; label: string }[] = [
{
valeur: 'DIRECTEUR_PROGRAMMES',
label: 'Directeur des programmes',
},
{
valeur: 'DIRECTEUR_TECHNIQUE',
label: 'Directeur technique',
},
{
valeur: 'DIRECTEUR_FINANCIER',
label: 'Directeur financier',
},
]

const ROLE_LABELS: Record<string, string> = {
DIRECTEUR_GENERAL: 'Directeur général',
DIRECTEUR_PROGRAMMES: 'Directeur des programmes',
DIRECTEUR_TECHNIQUE: 'Directeur technique',
DIRECTEUR_FINANCIER: 'Directeur financier',
}

const FORMULAIRE_INITIAL = {
nomComplet: '',
identifiant: '',
motDePasse: '',
role: 'DIRECTEUR_PROGRAMMES' as RoleUtilisateur,
}

export default function Utilisateurs({ token }: UtilisateursProps) {
const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
const [recherche, setRecherche] = useState('')
const [chargement, setChargement] = useState(true)
const [enregistrement, setEnregistrement] = useState(false)
const [modalOuverte, setModalOuverte] = useState(false)
const [erreur, setErreur] = useState('')
const [message, setMessage] = useState('')
const [formulaire, setFormulaire] = useState(FORMULAIRE_INITIAL)

const chargerUtilisateurs = useCallback(async () => {
setChargement(true)
setErreur('')

try {
  const resultat = await obtenirUtilisateurs(token)
  setUtilisateurs(resultat)
} catch (error) {
  setErreur(
    error instanceof Error
      ? error.message
      : 'Impossible de charger les utilisateurs.',
  )
} finally {
  setChargement(false)
}

}, [token])

useEffect(() => {
void chargerUtilisateurs()
}, [chargerUtilisateurs])

const utilisateursFiltres = utilisateurs.filter((utilisateur) => {
const terme = recherche.trim().toLowerCase()

return (
  utilisateur.nom_complet.toLowerCase().includes(terme) ||
  utilisateur.identifiant.toLowerCase().includes(terme) ||
  (ROLE_LABELS[utilisateur.role] || utilisateur.role)
    .toLowerCase()
    .includes(terme)
)

})

async function handleCreation(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault()
setErreur('')
setMessage('')

if (
  !formulaire.nomComplet.trim() ||
  !formulaire.identifiant.trim() ||
  !formulaire.motDePasse
) {
  setErreur('Veuillez remplir tous les champs.')
  return
}

if (formulaire.motDePasse.length < 12) {
  setErreur('Le mot de passe doit contenir au moins 12 caractères.')
  return
}

setEnregistrement(true)

try {
  await creerUtilisateur(token, {
    nomComplet: formulaire.nomComplet.trim(),
    identifiant: formulaire.identifiant.trim(),
    motDePasse: formulaire.motDePasse,
    role: formulaire.role,
  })

  setFormulaire(FORMULAIRE_INITIAL)
  setModalOuverte(false)
  setMessage('Le compte a été créé avec succès.')

  await chargerUtilisateurs()
} catch (error) {
  setErreur(
    error instanceof Error
      ? error.message
      : 'Impossible de créer le compte.',
  )
} finally {
  setEnregistrement(false)
}

}

async function handleChangementStatut(utilisateur: Utilisateur) {
const action = utilisateur.actif ? 'désactiver' : 'activer'

if (
  !window.confirm(
    `Voulez-vous vraiment ${action} le compte de ${utilisateur.nom_complet} ?`,
  )
) {
  return
}

setErreur('')
setMessage('')

try {
  await modifierStatutUtilisateur(
    token,
    utilisateur.id,
    !utilisateur.actif,
  )

  setMessage(
    utilisateur.actif
      ? 'Le compte a été désactivé.'
      : 'Le compte a été activé.',
  )

  await chargerUtilisateurs()
} catch (error) {
  setErreur(
    error instanceof Error
      ? error.message
      : 'Impossible de modifier le statut.',
  )
}

}

const nombreActifs = utilisateurs.filter((u) => u.actif).length
const nombreInactifs = utilisateurs.filter((u) => !u.actif).length

return ( <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8"> <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
Administration </p>

      <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        Gestion des utilisateurs
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Gérez les comptes des responsables de MAPENDO+ TV.
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        setErreur('')
        setMessage('')
        setModalOuverte(true)
      }}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700"
    >
      <Plus size={19} />
      Ajouter un directeur
    </button>
  </header>

  {erreur && (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <p>{erreur}</p>
      <button
        type="button"
        onClick={() => setErreur('')}
        aria-label="Fermer le message"
      >
        <X size={18} />
      </button>
    </div>
  )}

  {message && (
    <div
      role="status"
      className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={() => setMessage('')}
        aria-label="Fermer le message"
      >
        <X size={18} />
      </button>
    </div>
  )}

  <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Total des comptes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {utilisateurs.length}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Users size={24} />
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Comptes actifs</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {nombreActifs}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-3 text-green-600">
          <ShieldCheck size={24} />
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Comptes désactivés</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {nombreInactifs}
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
          <ShieldOff size={24} />
        </div>
      </div>
    </div>
  </section>

  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h2 className="font-bold text-slate-900">Comptes enregistrés</h2>
        <p className="mt-1 text-sm text-slate-500">
          Liste issue de la base de données.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher..."
            aria-label="Rechercher un utilisateur"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500 sm:w-64"
          />
        </div>

        <button
          type="button"
          onClick={() => void chargerUtilisateurs()}
          disabled={chargement}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Utilisateur</th>
            <th className="px-5 py-4 font-semibold">Identifiant</th>
            <th className="px-5 py-4 font-semibold">Rôle</th>
            <th className="px-5 py-4 font-semibold">Statut</th>
            <th className="px-5 py-4 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {chargement ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center">
                <LoaderCircle
                  size={24}
                  className="mx-auto animate-spin text-red-600"
                />
                <p className="mt-3 text-slate-500">
                  Chargement des utilisateurs...
                </p>
              </td>
            </tr>
          ) : utilisateursFiltres.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center">
                <UserRound
                  size={32}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-3 font-medium text-slate-700">
                  Aucun utilisateur trouvé
                </p>
                <p className="mt-1 text-slate-500">
                  Modifiez votre recherche ou créez un compte.
                </p>
              </td>
            </tr>
          ) : (
            utilisateursFiltres.map((utilisateur) => (
              <tr key={utilisateur.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">
                    {utilisateur.nom_complet}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    ID : {utilisateur.id}
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {utilisateur.identifiant}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {ROLE_LABELS[utilisateur.role] || utilisateur.role}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      utilisateur.actif
                        ? 'bg-green-50 text-green-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {utilisateur.actif ? 'Actif' : 'Désactivé'}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  {utilisateur.role === 'DIRECTEUR_GENERAL' ? (
                    <span className="text-xs text-slate-400">
                      Compte principal
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        void handleChangementStatut(utilisateur)
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        utilisateur.actif
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {utilisateur.actif ? 'Désactiver' : 'Activer'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
      {utilisateursFiltres.length} compte(s) affiché(s)
    </div>
  </section>

  {modalOuverte && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !enregistrement) {
          setModalOuverte(false)
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-modal"
        className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2
              id="titre-modal"
              className="text-xl font-bold text-slate-900"
            >
              Ajouter un directeur
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Créez un accès pour un responsable.
            </p>
          </div>

          <button
            type="button"
            disabled={enregistrement}
            onClick={() => setModalOuverte(false)}
            aria-label="Fermer le formulaire"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreation} className="space-y-5 p-5">
          <div>
            <label
              htmlFor="nomComplet"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nom complet
            </label>

            <input
              id="nomComplet"
              type="text"
              required
              maxLength={150}
              value={formulaire.nomComplet}
              onChange={(event) =>
                setFormulaire({
                  ...formulaire,
                  nomComplet: event.target.value,
                })
              }
              placeholder="Ex. : Jean Mukendi"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="identifiant"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Identifiant de connexion
            </label>

            <input
              id="identifiant"
              type="text"
              required
              maxLength={80}
              autoComplete="off"
              value={formulaire.identifiant}
              onChange={(event) =>
                setFormulaire({
                  ...formulaire,
                  identifiant: event.target.value,
                })
              }
              placeholder="Ex. : directeur_programmes"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Service
            </label>

            <select
              id="role"
              value={formulaire.role}
              onChange={(event) =>
                setFormulaire({
                  ...formulaire,
                  role: event.target.value as RoleUtilisateur,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            >
              {ROLES.map((role) => (
                <option key={role.valeur} value={role.valeur}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="motDePasse"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Mot de passe initial
            </label>

            <input
              id="motDePasse"
              type="password"
              required
              minLength={12}
              autoComplete="new-password"
              value={formulaire.motDePasse}
              onChange={(event) =>
                setFormulaire({
                  ...formulaire,
                  motDePasse: event.target.value,
                })
              }
              placeholder="Au moins 12 caractères"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />

            <p className="mt-2 text-xs text-slate-500">
              Le mot de passe sera haché avant son enregistrement.
            </p>
          </div>

          {erreur && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {erreur}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={enregistrement}
              onClick={() => setModalOuverte(false)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={enregistrement}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enregistrement && (
                <LoaderCircle size={17} className="animate-spin" />
              )}
              {enregistrement ? 'Création...' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

)
}
