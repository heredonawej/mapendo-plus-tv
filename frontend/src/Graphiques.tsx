import { BarChart3, Users, Activity } from 'lucide-react'
import type { Statistiques } from './services/api'

type GraphiquesProps = {
statistiques: Statistiques
}

function Graphiques({ statistiques }: GraphiquesProps) {
const totalComptes =
statistiques.directeursActifs + statistiques.directeursInactifs

const maximumDepartement = Math.max(
statistiques.totalProgrammes,
statistiques.totalTechnique,
statistiques.totalFinance,
1,
)

const departements = [
{
nom: 'Programmes',
valeur: statistiques.totalProgrammes,
couleur: '#0284c7',
},
{
nom: 'Technique',
valeur: statistiques.totalTechnique,
couleur: '#6366f1',
},
{
nom: 'Finance',
valeur: statistiques.totalFinance,
couleur: '#059669',
},
]

const comptes = [
{
nom: 'Comptes actifs',
valeur: statistiques.directeursActifs,
couleur: '#059669',
},
{
nom: 'Comptes inactifs',
valeur: statistiques.directeursInactifs,
couleur: '#f59e0b',
},
]

return (
<section className="space-y-5">
<div>
<h3 className="text-lg font-bold text-slate-900">
Analyse et statistiques
</h3>
<p className="mt-1 text-sm text-slate-500">
Visualisation de la situation actuelle des départements.
</p>
</div>

  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <BarChart3 size={22} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">
            Répartition des directeurs
          </h4>
          <p className="text-xs text-slate-500">
            Comptes par département
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {departements.map((departement) => {
          const pourcentage =
            (departement.valeur / maximumDepartement) * 100

          return (
            <div key={departement.nom}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {departement.nom}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {departement.valeur}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: pourcentage + '%',
                    backgroundColor: departement.couleur,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">
          Total des directeurs
        </span>
        <span className="text-xl font-extrabold text-slate-900">
          {statistiques.totalDirecteurs}
        </span>
      </div>
    </article>

    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          <Activity size={22} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">
            État des comptes
          </h4>
          <p className="text-xs text-slate-500">
            Situation des accès utilisateurs
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {comptes.map((compte) => {
          const pourcentage =
            totalComptes > 0
              ? (compte.valeur / totalComptes) * 100
              : 0

          return (
            <div key={compte.nom}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {compte.nom}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {compte.valeur}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: pourcentage + '%',
                    backgroundColor: compte.couleur,
                  }}
                />
              </div>

              <p className="mt-1 text-right text-xs text-slate-400">
                {pourcentage.toFixed(1)} %
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="flex items-center gap-2 text-sm text-slate-500">
          <Users size={17} />
          Total des comptes
        </span>
        <span className="text-xl font-extrabold text-slate-900">
          {totalComptes}
        </span>
      </div>
    </article>
  </div>
</section>

)
}

export default Graphiques