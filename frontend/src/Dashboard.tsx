import { useEffect, useState } from 'react'
import {
LayoutDashboard,
Users,
Tv,
Wrench,
Wallet,
FileText,
Bell,
Search,
Menu,
ChevronDown,
TrendingUp,
TrendingDown,
CircleDollarSign,
Activity,
CalendarDays,
LogOut,
History,
RefreshCw,
} from 'lucide-react'

import Utilisateurs from './pages/Utilisateurs'
import Historique from './pages/Historique'
import Graphiques from './Graphiques'
import {
obtenirStatistiques,
type Statistiques,
} from './services/api'

type DashboardProps = {
token: string
utilisateur: {
id: number
nomComplet: string
identifiant: string
role: string
}
onLogout: () => void
}

type PageActive = 'accueil' | 'utilisateurs' | 'historique'

const services = [
{
name: 'Direction des programmes',
description: 'Émissions et programmation',
icon: Tv,
color: 'bg-blue-100 text-blue-700',
},
{
name: 'Direction technique',
description: 'Matériel et maintenance',
icon: Wrench,
color: 'bg-indigo-100 text-indigo-700',
},
{
name: 'Service des techniciens',
description: 'Interventions techniques',
icon: Users,
color: 'bg-amber-100 text-amber-700',
},
{
name: 'Finance et comptabilité',
description: 'Recettes et dépenses',
icon: Wallet,
color: 'bg-emerald-100 text-emerald-700',
},
]

function Dashboard({ token, utilisateur, onLogout }: DashboardProps) {
const [pageActive, setPageActive] = useState<PageActive>('accueil')
const [statistiques, setStatistiques] = useState<Statistiques | null>(null)
const [chargement, setChargement] = useState(true)
const [erreur, setErreur] = useState('')

async function chargerStatistiques() {
try {
setChargement(true)
setErreur('')

  const resultat = await obtenirStatistiques(token)
  setStatistiques(resultat)
} catch (error) {
  setErreur(
    error instanceof Error
      ? error.message
      : 'Impossible de charger les statistiques.',
  )
} finally {
  setChargement(false)
}

}

useEffect(() => {
chargerStatistiques()

const intervalle = window.setInterval(() => {
  chargerStatistiques()
}, 30000)

return () => window.clearInterval(intervalle)

}, [token])

const titrePage =
pageActive === 'accueil'
? 'Tableau de bord'
: pageActive === 'utilisateurs'
? 'Gestion des utilisateurs'
: 'Historique des activités'

const cartes = [
{
titre: 'Total des directeurs',
valeur: statistiques?.totalDirecteurs,
icone: Users,
couleur: 'bg-blue-50 text-blue-700',
description: 'Comptes des directeurs',
},
{
titre: 'Directeurs actifs',
valeur: statistiques?.directeursActifs,
icone: TrendingUp,
couleur: 'bg-emerald-50 text-emerald-700',
description: 'Comptes opérationnels',
},
{
titre: 'Directeurs inactifs',
valeur: statistiques?.directeursInactifs,
icone: TrendingDown,
couleur: 'bg-amber-50 text-amber-700',
description: 'Comptes désactivés',
},
{
titre: 'Activités enregistrées',
valeur: statistiques?.totalActivites,
icone: Activity,
couleur: 'bg-rose-50 text-rose-700',
description: 'Opérations dans le journal',
},
]

return (
<div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
<aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-slate-950 text-white md:flex">
<div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
<img src="/images/logo-mapendo.png" alt="Logo MAPENDO+ TV" className="h-14 w-14 rounded-xl bg-white object-contain p-1" />

      <div>
        <h1 className="text-lg font-extrabold tracking-wide">
          MAPENDO<span className="text-sky-400">+</span>
        </h1>
        <p className="text-xs text-slate-400">TV Management</p>
      </div>
    </div>

    <div className="px-4 py-6">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Menu principal
      </p>

      <nav className="space-y-1">
        <button
          type="button"
          onClick={() => setPageActive('accueil')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
            pageActive === 'accueil'
              ? 'bg-sky-500 font-semibold text-white'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard size={19} />
          Vue d'ensemble
        </button>

        <button
          type="button"
          onClick={() => setPageActive('utilisateurs')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
            pageActive === 'utilisateurs'
              ? 'bg-sky-500 font-semibold text-white'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Users size={19} />
          Gestion des utilisateurs
        </button>

        <button
          type="button"
          onClick={() => setPageActive('historique')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
            pageActive === 'historique'
              ? 'bg-sky-500 font-semibold text-white'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <History size={19} />
          Historique des activités
        </button>

        <button
          type="button"
          onClick={() => setPageActive('accueil')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Users size={19} />
          Services
        </button>

        <button
          type="button"
          onClick={() => setPageActive('accueil')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Tv size={19} />
          Programmes
        </button>

        <button
          type="button"
          onClick={() => setPageActive('accueil')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Wrench size={19} />
          Technique
        </button>

        <button
          type="button"
          onClick={() => setPageActive('accueil')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Wallet size={19} />
          Finance
        </button>

        <button
          type="button"
          onClick={() => setPageActive('accueil')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <FileText size={19} />
          Rapports
        </button>
      </nav>
    </div>

    <div className="mt-auto p-4">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={19} />
        Déconnexion
      </button>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-semibold">MAPENDO+ TV</p>
        <p className="mt-1 text-xs text-slate-400">
          Administration générale
        </p>
      </div>
    </div>
  </aside>

  <main className="min-w-0 flex-1">
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-xs text-slate-500">Administration</p>
          <h2 className="text-lg font-bold text-slate-900">
            {titrePage}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
          <Search size={17} className="text-slate-400" />
          <input
            type="search"
            placeholder="Rechercher..."
            aria-label="Rechercher"
            className="w-36 bg-transparent text-sm outline-none"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 md:pl-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            DG
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {utilisateur.nomComplet}
            </p>
            <p className="text-xs text-slate-500">
              Directeur général
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 sm:block"
          />
        </div>
      </div>
    </header>

    {pageActive === 'utilisateurs' ? (
      <Utilisateurs token={token} />
    ) : pageActive === 'historique' ? (
      <Historique token={token} />
    ) : (
      <div className="mx-auto max-w-[1600px] space-y-8 p-4 md:p-8">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white md:p-8">
          <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-12 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-200">
                <Activity size={14} />
                Espace de supervision
              </span>

              <h3 className="mt-5 text-2xl font-bold md:text-3xl">
                Bienvenue dans votre espace
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Supervisez les activités de MAPENDO+ TV et suivez les
                performances de chaque service depuis un seul endroit.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
              <CalendarDays size={22} className="text-sky-300" />
              <div>
                <p className="text-xs text-slate-300">
                  Espace administratif
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Direction générale
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Vue générale
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Indicateurs réels de la Direction générale
              </p>
            </div>

            <button
              type="button"
              onClick={chargerStatistiques}
              disabled={chargement}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Actualiser
            </button>
          </div>

          {erreur && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {erreur}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cartes.map((carte) => {
              const Icon = carte.icone

              return (
                <article
                  key={carte.titre}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${carte.couleur}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-medium text-emerald-600">
                      Données réelles
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    {carte.titre}
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {chargement
                      ? '...'
                      : erreur
                        ? '—'
                        : carte.valeur ?? 0}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {carte.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Répartition des directeurs
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Nombre de comptes par département
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[
              {
                titre: 'Programmes',
                valeur: statistiques?.totalProgrammes,
                icone: Tv,
                couleur: 'bg-blue-50 text-blue-700',
              },
              {
                titre: 'Technique',
                valeur: statistiques?.totalTechnique,
                icone: Wrench,
                couleur: 'bg-indigo-50 text-indigo-700',
              },
              {
                titre: 'Finance',
                valeur: statistiques?.totalFinance,
                icone: CircleDollarSign,
                couleur: 'bg-emerald-50 text-emerald-700',
              },
            ].map((service) => {
              const Icon = service.icone

              return (
                <article
                  key={service.titre}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Direction {service.titre.toLowerCase()}
                      </p>
                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {chargement ? '...' : service.valeur ?? 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Comptes enregistrés
                      </p>
                    </div>

                    <div className={`rounded-xl p-3 ${service.couleur}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {statistiques && (
          <Graphiques statistiques={statistiques} />
        )}

        <section>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Supervision des services
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Aperçu des départements de MAPENDO+ TV
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.name}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className={`rounded-xl p-3 ${service.color}`}>
                    <Icon size={23} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {service.name}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {service.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          © 2026 MAPENDO+ TV — Logiciel de la Direction générale
        </footer>
      </div>
    )}
  </main>
</div>

)
}

export default Dashboard