const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/mailer');

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user, // generated ethereal user
        pass: emailConfig.pass // generated ethereal password
    }
});

// generar html
const generarHtml = (archivo, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/mails/${archivo}.pug`, options);
    return juice(html);
};

exports.send = async (options) => {
    const html = generarHtml(options.archivo, options);
    const text = htmlToText.fromString(html);
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com>',
        to: options.user.email,
        subject: options.subject,
        text,
        html
    };
    const enviarEmail = util.promisify(transporter.sendMail, transporter);
    return enviarEmail.call(transporter, mailOptions);
};

