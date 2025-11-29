import crypto from "crypto";
import User from "../dao/models/user.model.js";
import { sendResetPasswordEmail } from "../service/email.service.js";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: "No existe un usuario con ese correo." });

  // Crear token
  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${token}`;

  await sendResetPasswordEmail(email, resetLink);

  res.json({ message: "Correo enviado para restablecer la contraseña" });
};

export const showResetPasswordForm = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // token NO expirado
  });

  if (!user) return res.status(400).send("Enlace inválido o expirado.");

  res.render("resetPassword", { token });
};

import bcrypt from "bcrypt";

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).send("Token inválido o expirado.");

  // Validar que la nueva clave NO sea igual a la anterior
  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword)
    return res.status(400).json({
      message: "La nueva contraseña no puede ser igual a la anterior.",
    });

  // Hashear nueva contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Actualizar usuario
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Contraseña actualizada correctamente." });
};
