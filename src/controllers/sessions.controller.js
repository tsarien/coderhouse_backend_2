import jwt from "jsonwebtoken";
import UserService from "../service/user.service.js";
import { config } from "../config/config.js";

const userService = new UserService();
const SECRET_KEY = config.JWT_SECRET;

export default class SessionsController {
  async register(req, res) {
    try {
      const usuario = await userService.register(req.body);
      res.status(201).json({ status:"success", message: "Registro exitoso", usuario });
    } catch (error) {
      res.status(400).json({ status:"error", message: "Error al registrar el usuario", error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const usuario = await userService.login(email, password);

      const token = jwt.sign(usuario, SECRET_KEY, { expiresIn: "1h" });

      res.cookie("tokenCookie", token, { httpOnly: true });
      res.json({ status:"success", message: "Login exitoso", usuario });
    } catch (error) {
      res.status(401).json({ status:"error", message: "Error al iniciar sesión", error: error.message });
    }
  }

  async current(req, res) {
    res.json({ status:"success", message: "Usuario autenticado", usuario: req.user });
  }

  async logout(req, res) {
    res.clearCookie("tokenCookie");
    res.json({ status:"success", message: "Logout exitoso" });
  }
}
