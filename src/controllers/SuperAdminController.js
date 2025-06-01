import SuperAdmin from '../models/SuperAdmin.js'
import mongoose from 'mongoose'
import { sendMailToRecoveryPassword } from "../config/nodemailer.js"
import { crearTokenJWT } from "../middlewares/JWT.js"

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  }
  const superAdminBDD = await SuperAdmin.findOne({ email }).select("-__v -token -updatedAt -createdAt")
  if (!superAdminBDD) {
    return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
  }
  if (superAdminBDD.confirmEmail === false) {
    return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" })
  }
  const verificarPassword = await superAdminBDD.matchPassword(password)
  if (!verificarPassword) {
    return res.status(401).json({ msg: "Lo sentimos, la contraseña no es la correcto" })
  }
  const { nombre, apellido, celular, _id, rol } = superAdminBDD
  const token = crearTokenJWT(superAdminBDD._id, superAdminBDD.rol)

  res.status(200).json({
    token,
    rol,
    nombre,
    apellido,
    celular,
    _id,
    email: superAdminBDD.email
  })
}

const recuperarPassword = async (req, res) => {
  const { email } = req.body
  if (Object.values(req.body).includes("")) {
    return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  }

  const superAdminBDD = await SuperAdmin.findOne({ email })
  if (!superAdminBDD) {
    return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
  }

  const token = superAdminBDD.crearToken()
  superAdminBDD.token = token

  await sendMailToRecoveryPassword(email, token)
  await superAdminBDD.save()

  res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
}

const comprobarTokenPasword = async (req, res) => {
  const { token } = req.params

  if (!token) {
    return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  }

  const superAdminBDD = await SuperAdmin.findOne({ token })
  if (!superAdminBDD || superAdminBDD.token !== token) {
    return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  }

  res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" })
}

const crearNuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body
  const { token } = req.params

  if (Object.values(req.body).includes("")) {
    return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
  }

  if (password !== confirmpassword) {
    return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" })
  }

  const superAdminBDD = await SuperAdmin.findOne({ token })
  if (!superAdminBDD || superAdminBDD.token !== token) {
    return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  }

  superAdminBDD.token = null
  superAdminBDD.password = await superAdminBDD.encrypPassword(password)

  await superAdminBDD.save()

  res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nueva contraseña" })
}

const actualizarPerfil = async (req, res)=>{
    const {id} = req.params
    const {nombre,apellido,direccion,celular,email} = req.body
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const superAdminBDD = await SuperAdmin.findById(id)
    if(!superAdminBDD) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`})
    if (superAdminBDD.email != email)
    {
        const superAdminBDDMail = await SuperAdmin.findOne({email})
        if (superAdminBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
    superAdminBDD.nombre = nombre ?? superAdminBDD.nombre
    superAdminBDD.apellido = apellido ?? superAdminBDD.apellido
    superAdminBDD.direccion = direccion ?? superAdminBDD.direccion
    superAdminBDD.celular = celular ?? superAdminBDD.celular
    superAdminBDD.email = email ?? superAdminBDD.email
    await superAdminBDD.save()
    console.log(superAdminBDD)
    res.status(200).json({msg: "Datos actualizados correctamente"})
}

const actualizarPassword = async (req,res)=>{
    const superAdminBDD = await SuperAdmin.findById(req.superAdminBDD._id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el usario ${id}`})
    const verificarPassword = await superAdminBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, la contraseña actual no es la correcto"})
    superAdminBDD.password = await superAdminBDD.encrypPassword(req.body.passwordnuevo)
    await superAdminBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}


const perfil = (req, res)=>{
    delete req.SuperAdminBDD.token
    delete req.SuperAdminBDD.confirmEmail
    delete req.SuperAdminBDD.createdAt
    delete req.SuperAdminBDD.updatedAt
    delete req.SuperAdminBDD.__v
    res.status(200).json(req.SuperAdminBDD)
}

export {
  login,
  recuperarPassword,
  comprobarTokenPasword,
  crearNuevoPassword,
  perfil,
  actualizarPerfil,
  actualizarPassword
}
