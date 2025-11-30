import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../dao/models/user.model.js";
import { sendResetPasswordEmail } from "../service/email.service.js";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ status: "error", message: "No existe un usuario con ese correo." });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${token}`;

  await sendResetPasswordEmail(email, resetLink);

  res.json({ status:"success", message: "Correo enviado para restablecer la contraseña" });
};

export const showResetPasswordForm = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ status:"error", message: "Enlace inválido o expirado." });

  res.render("resetPassword", { token });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ status:"error", message: "Token inválido o expirado." });

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword)
    return res.status(400).json({
      status:"error", 
      message: "La nueva contraseña no puede ser igual a la anterior.",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ status:"success" , message: "Contraseña actualizada correctamente." });
};
