import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './config/database.js'
import authRoutes from './routes/auth.js'
import utilisateursRoutes from './routes/utilisateurs.js'
import historiqueRoutes from './routes/historique.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.use(cors({
origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/utilisateurs', utilisateursRoutes)
app.use('/api/historique', historiqueRoutes)

app.get('/', (_req, res) => {
res.json({
message: 'Serveur MAPENDO TV operationnel',
})
})

app.get('/api/health', (_req, res) => {
res.json({
success: true,
message: 'Le serveur fonctionne correctement',
})
})

app.get('/api/health/database', async (_req, res) => {
try {
const result = await pool.query('SELECT NOW() AS date_serveur')

res.json({
  success: true,
  message: 'Connexion a PostgreSQL reussie',
  dateServeur: result.rows[0].date_serveur,
})

} catch (error) {
console.error('Erreur PostgreSQL :', error)

res.status(500).json({
  success: false,
  message: 'Impossible de se connecter a la base de donnees',
})

}
})

app.listen(PORT, () => {
console.log('Serveur MAPENDO TV actif sur http://localhost:' + PORT)
})