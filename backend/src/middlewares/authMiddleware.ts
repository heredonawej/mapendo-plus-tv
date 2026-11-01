import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface AuthRequest extends Request {
utilisateur?: {
id: string
role: string
}
}

export function authentifier(
req: AuthRequest,
res: Response,
next: NextFunction,
) {
const authorization = req.headers.authorization

if (!authorization || !authorization.startsWith('Bearer ')) {
return res.status(401).json({
success: false,
message: 'Authentification requise.',
})
}

const token = authorization.substring(7)
const secret = process.env.JWT_SECRET

if (!secret) {
console.error('JWT_SECRET est absent du fichier .env')

return res.status(500).json({
  success: false,
  message: 'Le service d’authentification est mal configuré.',
})

}

try {
const decoded = jwt.verify(token, secret)

if (
  typeof decoded === 'string' ||
  typeof decoded.sub !== 'string' ||
  typeof decoded.role !== 'string'
) {
  return res.status(401).json({
    success: false,
    message: 'Jeton invalide.',
  })
}

const payload = decoded as JwtPayload

req.utilisateur = {
  id: payload.sub as string,
  role: payload.role,
}

next()

} catch {
return res.status(401).json({
success: false,
message: 'Session expirée ou jeton invalide. Veuillez vous reconnecter.',
})
}
}

export function exigerDirecteurGeneral(
req: AuthRequest,
res: Response,
next: NextFunction,
) {
if (req.utilisateur?.role !== 'DIRECTEUR_GENERAL') {
return res.status(403).json({
success: false,
message: 'Accès réservé au Directeur général.',
})
}

next()
}
