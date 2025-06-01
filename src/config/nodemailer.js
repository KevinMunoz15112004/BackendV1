import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from:'"PoliRed" <polired@policonecta.com>',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>PoliRed</h1>
    <hr>
    <a href=${process.env.BACKEND_URL}/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>El equipo de PoliRed te da bienvenida.</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}



export {
    sendMailToRecoveryPassword
}