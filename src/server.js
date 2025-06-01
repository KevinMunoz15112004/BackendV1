// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import superAdminRoutes from './routers/superAdminRoutes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.PORT || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())
app.use('/api', superAdminRoutes)

// Manejo de rutas no existentens
app.use((req, res) => {res.status(404).json({error: "Ruta no encontrada"})})

// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

// Exportar la instancia de express por medio de app
export default app