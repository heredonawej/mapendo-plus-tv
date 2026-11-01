import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'

const router = Router()

router.post('/connexion', async (req, res) => {
  try {
    const { identifiant, motDePasse } = req.body

    if (
      typeof identifiant !== 'string' ||
      typeof motDePasse !== 'string' ||
      !identifiant.trim() ||
      !motDePasse
    ) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs.',
      })
    }

    const result = await pool.query(
      `SELECT id, nom_complet, identifiant, mot_de_passe_hash, role
       FROM utilisateurs
       WHERE identifiant = $1 AND actif = TRUE`,
      [identifiant.trim()],
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects.',
      })
    }

    const utilisateur = result.rows[0]

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.mot_de_passe_hash,
    )

    if (!motDePasseValide) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects.',
      })
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      console.error('JWT_SECRET est absent du fichier .env')

      return res.status(500).json({
        success: false,
        message: 'Le service d’authentification est mal configuré.',
      })
    }

    const token = jwt.sign(
      {
        sub: String(utilisateur.id),
        role: utilisateur.role,
      },
      secret,
      { expiresIn: '1h' },
    )

    await pool.query(
      `INSERT INTO historique_actions
       (utilisateur_id, action, description)
       VALUES ($1, $2, $3)`,
      [
        utilisateur.id,
        'CONNEXION',
        'Connexion réussie au logiciel de la Direction générale',
      ],
    )

    return res.json({
      success: true,
      message: 'Connexion réussie.',
      token,
      utilisateur: {
        id: utilisateur.id,
        nomComplet: utilisateur.nom_complet,
        identifiant: utilisateur.identifiant,
        role: utilisateur.role,
      },
    })
  } catch (error) {
    console.error('Erreur de connexion :', error)

    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la connexion.',
    })
  }
})

export default router