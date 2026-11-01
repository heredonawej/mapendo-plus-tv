const API_URL = 'http://localhost:5000/api'

export type Utilisateur = {
id: number
nom_complet: string
identifiant: string
role: string
actif: boolean
created_at?: string
}

export type RoleUtilisateur =
| 'DIRECTEUR_PROGRAMMES'
| 'DIRECTEUR_TECHNIQUE'
| 'DIRECTEUR_FINANCIER'

export type SessionUtilisateur = {
id: number
nomComplet: string
identifiant: string
role: string
}

export type ReponseConnexion = {
success: boolean
message: string
token: string
utilisateur: SessionUtilisateur
}

export type HistoriqueAction = {
id: number
utilisateur_id: number | null
action: string
description: string
date_action: string
nom_complet: string | null
identifiant: string | null
}

export type Statistiques = {
totalDirecteurs: number
directeursActifs: number
directeursInactifs: number
totalProgrammes: number
totalTechnique: number
totalFinance: number
totalActivites: number
}

export const SESSION_EXPIREE_EVENT = 'mapendo:session-expiree'

async function lireReponse(response: Response): Promise<any> {
try {
return await response.json()
} catch {
return {
success: false,
message: 'Reponse invalide du serveur.',
}
}
}

async function requeteAPI<T>(
chemin: string,
token: string,
options: RequestInit = {},
): Promise<T> {
const response = await fetch(API_URL + chemin, {
...options,
headers: {
'Content-Type': 'application/json',
...options.headers,
Authorization: 'Bearer ' + token,
},
})

const data = await lireReponse(response)

if (response.status === 401) {
window.dispatchEvent(new Event(SESSION_EXPIREE_EVENT))
throw new Error('Session expiree. Veuillez vous reconnecter.')
}

if (!response.ok || data.success === false) {
throw new Error(data.message || 'Une erreur est survenue.')
}

return data as T
}

export async function connecter(
identifiant: string,
motDePasse: string,
): Promise<ReponseConnexion> {
const response = await fetch(API_URL + '/auth/connexion', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
identifiant: identifiant,
motDePasse: motDePasse,
}),
})

const data = await lireReponse(response)

if (!response.ok || !data.success) {
throw new Error(
data.message || 'Identifiant ou mot de passe incorrect.',
)
}

return data as ReponseConnexion
}

export async function obtenirUtilisateurs(
token: string,
): Promise<Utilisateur[]> {
const data = await requeteAPI<{
utilisateurs: Utilisateur[]
}>('/utilisateurs', token)

return data.utilisateurs
}

export async function creerUtilisateur(
token: string,
utilisateur: {
nomComplet: string
identifiant: string
motDePasse: string
role: RoleUtilisateur
},
): Promise<Utilisateur> {
const data = await requeteAPI<{
utilisateur: Utilisateur
}>('/utilisateurs', token, {
method: 'POST',
body: JSON.stringify(utilisateur),
})

return data.utilisateur
}

export async function modifierStatutUtilisateur(
token: string,
id: number,
actif: boolean,
): Promise<Utilisateur> {
const data = await requeteAPI<{
utilisateur: Utilisateur
}>('/utilisateurs/' + id + '/statut', token, {
method: 'PATCH',
body: JSON.stringify({
actif: actif,
}),
})

return data.utilisateur
}

export async function obtenirHistorique(
token: string,
): Promise<HistoriqueAction[]> {
const data = await requeteAPI<{
historique: HistoriqueAction[]
}>('/historique', token)

return data.historique
}

export async function obtenirStatistiques(
token: string,
): Promise<Statistiques> {
const data = await requeteAPI<{
statistiques: Statistiques
}>('/utilisateurs/statistiques', token)

return data.statistiques
}