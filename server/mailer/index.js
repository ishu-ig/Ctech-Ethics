const nodemailer = require("nodemailer")

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // was missing — required for port 587 (STARTTLS)
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD
    }
})

mailer.verify((error, success) => {
    if (error) console.log("Mailer connection failed:", error)
    else console.log("Mailer is ready to send messages")
})

module.exports = mailer