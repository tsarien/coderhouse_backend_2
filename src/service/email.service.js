import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendResetPasswordEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const content = `
    <h2>Restablecer contraseña</h2>
    <p>Haz clic en el botón para restablecer tu contraseña:</p>
    <a href="${resetLink}" 
       style="padding: 10px 20px; background: #1e90ff; color: white; 
       text-decoration: none; border-radius: 5px;">
       Restablecer contraseña
    </a>
    <p>Este enlace expirará en 1 hora.</p>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    html: content,
  });
};
