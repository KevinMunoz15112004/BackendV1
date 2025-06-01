import jwt from "jsonwebtoken"
import SuperAdmin from "../models/SuperAdmin.js"

const crearTokenJWT = (id, rol) => {

    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {

    if (!req.headers.authorization) return res.status(401).json({ msg: "Acceso denegado: token no proporcionado o no válido" })

    const { authorization } = req.headers

    try {
        const token = authorization.split(" ")[1];
        const { id, rol } = jwt.verify(token,process.env.JWT_SECRET)
        if (rol === "SuperAdmin") {
            req.SuperAdminBDD = await SuperAdmin.findById(id).lean().select("-password")
            next()
        }
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido o expirado" });
    }
}


export { 
    crearTokenJWT,
    verificarTokenJWT 
}

