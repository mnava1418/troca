const fs = require('fs')
const nodemailer = require('nodemailer')
const from = require('../config').email
const origin = require('../config/auth').origin

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

const orderNotificacionMessage = (account, orderId) => {
    return `
    <div style="color:inherit;font-size:inherit;line-height:inherit">    
        <p style="margin-bottom:1em;line-height:1.6;font-size:18px">
            Hi ${account.substring(0,5)}...${account.substring(account.length - 4)}!
        </p>
        <p style="margin-bottom:1em;font-size:16px;line-height:1.6">
            Your order <strong>${orderId}</strong> has been updated. <a href="${origin[process.env.NODE_ENV]}/orderBook" target="_blank">Click Here</a> to review it.
        </p>
        <p style="margin-bottom:1em;font-size:16px;line-height:1.6">Keep swaping, <br/>Troca Team</p>
    </div>`
}

const sellNotificacionMessage = (account, tokenId) => {
    return `
    <div style="color:inherit;font-size:inherit;line-height:inherit">    
        <p style="margin-bottom:1em;line-height:1.6;font-size:18px">
            Hi ${account.substring(0,5)}...${account.substring(account.length - 4)}!
        </p>
        <p style="margin-bottom:1em;font-size:16px;line-height:1.6">
            You just sold token <strong>#${tokenId}</strong>. Go to your <a href="${origin[process.env.NODE_ENV]}/portfolio" target="_blank">portfolio</a> to get more details.
        </p>
        <p style="margin-bottom:1em;font-size:16px;line-height:1.6">Keep swaping, <br/>Troca Team</p>
    </div>`
}

module.exports = {
    sendEmail,
    orderNotificacionMessage,
    sellNotificacionMessage
}
