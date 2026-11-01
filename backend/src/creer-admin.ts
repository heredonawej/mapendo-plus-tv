import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { pool } from './config/database.js'

dotenv.config()

async function creerAdmin() {
  try {
    const nomComplet = process.env.ADMIN_NOM
    const identifiant = process.env.ADMIN_IDENTIFIANT
    const motDePasse = process.env.ADMIN_MOT_DE_PASSE

    if (!nomComplet || !identifiant || !motDePasse) {
      throw new Error(
        'Configure ADMIN_NOM, ADMIN_IDENTIFIANT et ADMIN_MOT_DE_PASSE dans .env',
      )
    }

    if (motDePasse.length < 12) {
      throw new Error('Le mot de passe doit contenir au moins 12 caractères.')
    }

    const hash = await bcrypt.hash(motDePasse, 12)

    await pool.query(
      `INSERT INTO utilisateurs
       (nom_complet, identifiant, mot_de_passe_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (identifiant) DO NOTHING`,
      [nomComplet, identifiant, hash, 'DIRECTEUR_GENERAL'],
    )

    console.log('Compte du Directeur général vérifié.')
  } catch (error) {
    console.error('Impossible de créer le compte :', error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

creerAdmin()