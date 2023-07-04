const mailer = require("nodemailer")
const { VsAuthenticator } = require('@vs-org/authenticator')
require("dotenv").config()


const sendOTP = async (options) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // console.log(secret)
    return await transporter.sendMail(mailOptions)

}



module.exports = { sendOTP }