import { Router, type Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/database.js'
import {
authentifier,
exigerDirecteurGeneral,
type AuthRequest,
} from '../middlewares/authMiddleware.js'

const router = Router()

const ROLES_AUTORISES = [
'DIRECTEUR_PROGRAMMES',
'DIRECTEUR_TECHNIQUE',
'DIRECTEUR_FINANCIER',
]

router.use(authentifier, exigerDirecteurGeneral)

// STATISTIQUES DU TABLEAU DE BORD
router.get('/statistiques', async (_req, res: Response) => {
try {
const resultat = await pool.query(
"SELECT COUNT(id) AS total_directeurs, COUNT(id) FILTER (WHERE actif = TRUE) AS directeurs_actifs, COUNT(id) FILTER (WHERE actif = FALSE) AS directeurs_inactifs, COUNT(id) FILTER (WHERE role = 'DIRECTEUR_PROGRAMMES') AS total_programmes, COUNT(id) FILTER (WHERE role = 'DIRECTEUR_TECHNIQUE') AS total_technique, COUNT(id) FILTER (WHERE role = 'DIRECTEUR_FINANCIER') AS total_finance, (SELECT COUNT(id) FROM historique_actions) AS total_activites FROM utilisateurs WHERE role IN ('DIRECTEUR_PROGRAMMES', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_FINANCIER')"
)
const ligne = resultat.rows[0]

return res.status(200).json({
  success: true,
  statistiques: {
    totalDirecteurs: Number(ligne.total_directeurs),
    directeursActifs: Number(ligne.directeurs_actifs),
    directeursInactifs: Number(ligne.directeurs_inactifs),
    totalProgrammes: Number(ligne.total_programmes),
    totalTechnique: Number(ligne.total_technique),
    totalFinance: Number(ligne.total_finance),
    totalActivites: Number(ligne.total_activites),
  },
})
} catch (error) {
console.error('Erreur statistiques :', error)

return res.status(500).json({
  success: false,
  message: 'Impossible de recuperer les statistiques.',
})

}
})

// LISTE DES UTILISATEURS
router.get('/', async (_req, res: Response) => {
try {
const resultat = await pool.query(
'SELECT id, nom_complet, identifiant, role, actif, created_at FROM utilisateurs ORDER BY created_at DESC'
)
return res.status(200).json({
  success: true,
  utilisateurs: resultat.rows,
})

} catch (error) {
console.error('Erreur utilisateurs :', error)

return res.status(500).json({
  success: false,
  message: 'Impossible de recuperer les utilisateurs.',
})

}
})

// CREATION D'UN UTILISATEUR
router.post('/', async (req: AuthRequest, res: Response) => {
const { nomComplet, identifiant, motDePasse, role } = req.body

if (
typeof nomComplet !== 'string' ||
typeof identifiant !== 'string' ||
typeof motDePasse !== 'string' ||
typeof role !== 'string'
) {
return res.status(400).json({
success: false,
message: 'Tous les champs sont obligatoires.',
})
}

const nom = nomComplet.trim()
const login = identifiant.trim()

if (!nom || !login || !motDePasse) {
return res.status(400).json({
success: false,
message: 'Veuillez remplir tous les champs.',
})
}

if (nom.length > 150 || login.length > 80) {
return res.status(400).json({
success: false,
message: 'Le nom ou l identifiant est trop long.',
})
}

if (!ROLES_AUTORISES.includes(role)) {
return res.status(400).json({
success: false,
message: 'Le role selectionne est invalide.',
})
}

if (motDePasse.length < 12) {
return res.status(400).json({
success: false,
message: 'Le mot de passe doit contenir au moins 12 caracteres.',
})
}

try {
const hash = await bcrypt.hash(motDePasse, 12)

const resultat = await pool.query(
  'INSERT INTO utilisateurs (nom_complet, identifiant, mot_de_passe_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, nom_complet, identifiant, role, actif, created_at',
  [nom, login, hash, role]
)

const nouvelUtilisateur = resultat.rows[0]

await pool.query(
  'INSERT INTO historique_actions (utilisateur_id, action, description) VALUES ($1, $2, $3)',
  [
    req.utilisateur?.id,
    'CREATION_UTILISATEUR',
    'Creation du compte ' + login + ' avec le role ' + role,
  ]
)

return res.status(201).json({
  success: true,
  message: 'Compte cree avec succes.',
  utilisateur: nouvelUtilisateur,
})

} catch (error) {
if (
typeof error === 'object' &&
error !== null &&
'code' in error &&
error.code === '23505'
) {
return res.status(409).json({
success: false,
message: 'Cet identifiant est deja utilise.',
})
}

console.error('Erreur creation utilisateur :', error)

return res.status(500).json({
  success: false,
  message: 'Impossible de creer le compte.',
})

}
})

// ACTIVATION OU DESACTIVATION
router.patch('/:id/statut', async (req: AuthRequest, res: Response) => {
const id = Number(req.params.id)
const { actif } = req.body

if (!Number.isInteger(id) || id <= 0 || typeof actif !== 'boolean') {
return res.status(400).json({
success: false,
message: 'Identifiant ou statut invalide.',
})
}

try {
const resultat = await pool.query(
"UPDATE utilisateurs SET actif = $1 WHERE id = $2 AND role IN ('DIRECTEUR_PROGRAMMES', 'DIRECTEUR_TECHNIQUE', 'DIRECTEUR_FINANCIER') RETURNING id, nom_complet, identifiant, role, actif",
[actif, id]
)

if (resultat.rowCount === 0) {
  return res.status(404).json({
    success: false,
    message: 'Compte introuvable ou non modifiable.',
  })
}

await pool.query(
  'INSERT INTO historique_actions (utilisateur_id, action, description) VALUES ($1, $2, $3)',
  [
    req.utilisateur?.id,
    actif ? 'ACTIVATION_UTILISATEUR' : 'DESACTIVATION_UTILISATEUR',
    'Modification du statut du compte ' + resultat.rows[0].identifiant,
  ]
)

return res.status(200).json({
  success: true,
  message: actif ? 'Compte active.' : 'Compte desactive.',
  utilisateur: resultat.rows[0],
})

} catch (error) {
console.error('Erreur modification statut :', error)

return res.status(500).json({
  success: false,
  message: 'Impossible de modifier le statut du compte.',
})

}
})

export default router