const fs = require('fs')
const nodemailer = require('nodemailer')
const from = require('../config').email

const createTransporter = () => {
    const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS))
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: from,
            serviceClient: credentials['client_id'],
            privateKey: credentials['private_key']
        }        
    })

    return transporter
}

const sendEmail = async(to, subject, html ) => {
    const mailOptions = { from, to, subject, html }
    const transporter = createTransporter()

    await transporter.sendMail(mailOptions)
    .then(info => {
        console.info(`Message sent: ${info.messageId}`)        
    })
    .catch(error => {
        console.error(`Erro: ${error}`)        
    })

    transporter.close()    
}

module.exports = {
    sendEmail
}
