import { Router } from "express";
import User from "../dao/models/user.model.js";
import { generaHash, validaPass } from "../utils.js";

export const sessionsRouter = Router();

sessionsRouter.post("/register", async (req, res) => {
  let { first_name, last_name, email, age, password } = req.body;
  if (!first_name || !email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El primer nombre, email y contraseña son requeridos` });
  }

  password = generaHash(password);

  try {
    let existe = await User.findOne({ email });
    if (existe) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
        error: `El email ${email} ya esta en uso, para ${existe.nombre}`,
      });
    }

    let nuevoUsuario = await User.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    nuevoUsuario = nuevoUsuario.toJSON();
    console.log(Object.keys(nuevoUsuario));

    delete nuevoUsuario.password; // eliminar datos sensibles

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ message: `Registro exitoso`, nuevoUsuario });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Internal server error` });
  }
});

sessionsRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El email y la  contraseña son requeridos` });
  }

  try {
    let usuario = await User.findOne({ email }).lean();
    if (!usuario) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `Credenciales invalidas` });
    }

    if (!validaPass(password, usuario.password)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `Credenciales invalidas` });
    }

    delete usuario.password; // eliminar datos sensibles
    req.session.usuario = usuario; // solo en logins...

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ payload: `Login exitoso para ${usuario.nombre}` });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `internal server error` });
  }
});

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: `Error al realizar logout` });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Logout exitoso...!!!" });
  });
});

export default sessionsRouter;
