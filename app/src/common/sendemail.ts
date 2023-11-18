import * as nodemailer from 'nodemailer';


// Enviar e-mail
export function sendEmail(text: string) {
  // Configurações do transporte (SMTP para Hotmail)
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configurações do e-mail
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Venom start chatbot',
    text: 'Content',
  };

  mailOptions.text = text;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Erro ao enviar e-mail:', error.message);
    }
    console.log('E-mail enviado com sucesso:', info.response);
  });
}

