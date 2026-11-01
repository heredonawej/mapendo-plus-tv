import { useEffect, useState } from 'react'
import { Clock, RefreshCw, History, User, Activity } from 'lucide-react'
import { obtenirHistorique, type HistoriqueAction } from '../services/api'

type HistoriqueProps = {
token: string
}

function Historique({ token }: HistoriqueProps) {
const [actions, setActions] = useState<HistoriqueAction[]>([])
const [chargement, setChargement] = useState(true)
const [erreur, setErreur] = useState('')

async function chargerHistorique() {
try {
setChargement(true)
setErreur('')
const resultat = await obtenirHistorique(token)
setActions(resultat)
} catch (error) {
setErreur(
error instanceof Error
? error.message
: 'Impossible de charger l historique.',
)
} finally {
setChargement(false)
}
}

useEffect(() => {
chargerHistorique()
}, [token])

function formaterDate(date: string) {
return new Date(date).toLocaleString('fr-FR', {
day: '2-digit',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
})
}

return (
<div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-8">
<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
<div>
<div className="flex items-center gap-2">
<History className="text-sky-600" size={25} />
<h3 className="text-xl font-bold text-slate-900">
Historique des activités
</h3>
</div>
<p className="mt-2 text-sm text-slate-500">
Suivi des opérations effectuées dans MAPENDO+ TV.
</p>
</div>

    <button
      type="button"
      onClick={chargerHistorique}
      disabled={chargement}
      className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
    >
      <RefreshCw size={17} />
      Actualiser
    </button>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
          <Activity size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Activités enregistrées</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {actions.length}
          </p>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
          <Clock size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Dernières opérations</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {Math.min(actions.length, 100)}
          </p>
        </div>
      </div>
    </div>
  </div>

  {erreur && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {erreur}
    </div>
  )}

  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-4">
      <h4 className="font-bold text-slate-900">
        Journal des opérations
      </h4>
      <p className="mt-1 text-xs text-slate-500">
        Les 100 dernières activités enregistrées.
      </p>
    </div>

    {chargement ? (
      <div className="p-10 text-center text-sm text-slate-500">
        Chargement de l historique...
      </div>
    ) : actions.length === 0 ? (
      <div className="p-10 text-center">
        <History className="mx-auto text-slate-300" size={38} />
        <p className="mt-3 font-semibold text-slate-700">
          Aucune activité enregistrée
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Les prochaines opérations apparaîtront ici.
        </p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="rounded-xl bg-sky-50 p-3 text-sky-700">
                <User size={20} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {action.nom_complet || 'Utilisateur inconnu'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {action.description || action.action}
                </p>
                <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {action.action}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
              <Clock size={15} />
              {formaterDate(action.date_action)}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

)
}

export default Historique