import dotenv from "dotenv";
dotenv.config();

import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../dao/models/user.model.js";
import { generaHash, validaPass } from "../utils.js";
import { auth } from "../middlewares/auth.js";
import { passportCall } from "../utils.js";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error(
    "Falta la clave secreta para JWT en las variables de entorno"
  );
}

export const sessionsRouter = Router();

sessionsRouter.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !email || !password) {
      return res.status(400).json({
        error: "El primer nombre, email y contraseña son requeridos.",
      });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res
        .status(400)
        .json({ error: `El email ${email} ya está en uso.` });
    }

    const nuevoUsuario = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: generaHash(password),
    });

    const usuarioSinPassword = nuevoUsuario.toObject();
    delete usuarioSinPassword.password;

    res
      .status(201)
      .json({ message: "Registro exitoso", usuario: usuarioSinPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

sessionsRouter.post("/login", passportCall("login"), async (req, res) => {
  const usuario = req.user.toObject();
  delete usuario.password;

  const token = jwt.sign(usuario, SECRET_KEY, { expiresIn: "1h" });

  res.cookie("tokenCookie", token, { httpOnly: true });
  res.status(200).json({ message: "Login exitoso", usuario });
});

sessionsRouter.get(
  "/usuario",
  passportCall("current"),
  auth(["user", "admin"]),
  (req, res) => {
    res.status(200).json({
      mensaje: `Perfil del usuario: ${req.user.first_name}`,
      usuario: req.user,
    });
  }
);

sessionsRouter.get("/public", auth(["public"]), (req, res) => {
  res.status(200).json({ mensaje: "Ruta pública accesible" });
});

sessionsRouter.get(
  "/admin",
  passportCall("current"),
  auth(["admin"]),
  (req, res) => {
    res.status(200).json({
      mensaje: `Acceso de administrador: ${req.user.first_name}`,
    });
  }
);

sessionsRouter.get(
  "/current",
  passportCall("current"),
  auth(["user", "admin"]),
  (req, res) => {
    res.status(200).json({
      mensaje: `Usuario autenticado: ${req.user.first_name}`,
      usuario: req.user,
    });
  }
);

sessionsRouter.get("/logout", (req, res) => {
  res.clearCookie("tokenCookie");
  res.status(200).json({ message: "Logout exitoso" });
});

export default sessionsRouter;
