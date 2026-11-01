import { Router, type Response } from 'express'
import { pool } from '../config/database.js'
import {
authentifier,
exigerDirecteurGeneral,
type AuthRequest,
} from '../middlewares/authMiddleware.js'

const router = Router()

router.use(authentifier, exigerDirecteurGeneral)

router.get('/', async (_req: AuthRequest, res: Response) => {
try {
const resultat = await pool.query(
'SELECT h.id, h.utilisateur_id, h.action, h.description, h.date_action, u.nom_complet, u.identifiant FROM historique_actions h LEFT JOIN utilisateurs u ON u.id = h.utilisateur_id ORDER BY h.date_action DESC LIMIT 100'
)

res.json({
  success: true,
  historique: resultat.rows,
})

} catch (error) {
console.error('Erreur historique :', error)

res.status(500).json({
  success: false,
  message: 'Impossible de recuperer l historique.',
})

}
})

export default router