const nodemailer = require('nodemailer');
async function sendMail(to, subject, text){
  const host = process.env.SMTP_HOST;
  if(!host) {
    console.log('SMTP not configured - skipping email. Would send to', to, subject, text);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587',10),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
}
module.exports = { sendMail };
