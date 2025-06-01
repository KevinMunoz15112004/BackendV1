import {Router} from 'express'
import { comprobarTokenPasword, crearNuevoPassword, recuperarPassword, login, perfil, actualizarPerfil, actualizarPassword } 
from '../controllers/SuperAdminController.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post('/recuperar-password', recuperarPassword)
router.get('/recuperar-password/:token', comprobarTokenPasword)
router.post('/nuevo-password/:token', crearNuevoPassword)

router.post('/login', login)

router.get('/perfil-superadmin', verificarTokenJWT, perfil)
router.put('/superadmin/:id', verificarTokenJWT, actualizarPerfil)
router.put('/superadmin/actualizar-password/:id', verificarTokenJWT, actualizarPassword)

export default router