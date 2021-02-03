import * as nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import * as fs from 'fs'

import {
    AUTHOR,
    ISSUER,
    NODEMAILER_USER,
    NODEMAILER_PASS
} from '@environment'

type Type = 'verifyEmail' | 'forgotPassword'

export const sendMail = async (
    type: Type,
    name: string,
    email: string,
    token: string,
): Promise<any> => {
    const transporter = await nodemailer.createTransport({
        service: 'gmail',
        secure: false, // true
        host: 'smtp.gmail.com',
        port: 587, // 465
        auth: {
            user: NODEMAILER_USER!,
            pass: NODEMAILER_PASS!
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const readHTMLFile = (path, callback) => {
        fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
            if (err) {
                callback(err)
            } else {
                callback(null, html)
            }
        })
    }

    readHTMLFile('./src/assets/templates/udacity-index.html', (err, html) => {
        const template = handlebars.compile(html)

        const common = {
            author: AUTHOR!,
            issuer: ISSUER!,
            to: name,
        }

        const replacements = {
            verifyEmail: {
                link: `${token}`,
                subject: 'Verify Email',
                text1: 'To complete your sign up, please verify your email: ',
                button: 'VERIFY EMAIL',
                text2: 'Or copy this link and paste in your web	browser',
                ...common
            },
            forgotPassword: {
                link: `${token}`,
                subject: 'Reset Your Password',
                text1:
                    // tslint:disable-next-line:quotemark
                    "Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.",
                button: 'Set New Password',
                text2:
                    // tslint:disable-next-line:quotemark
                    "If that doesn't work, copy and paste the following link in your browser:",
                ...common
            }
        }

        const htmlToSend = template(replacements[type])

        const mailOptions = {
            from: `${AUTHOR}:${NODEMAILER_USER}`, // sender address
            to: email, // list of receivers
            subject: replacements[type].subject,
            html: htmlToSend,
            attachments: []
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                // Logger.error(err.message)
            } else {
                console.log('Message sent: ' + JSON.parse(info))
                // Logger.debug(info.response.message, 'Nodemailer')
            }
        })

        transporter.close()
    })
}
