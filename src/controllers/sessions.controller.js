import jwt from "jsonwebtoken";
import UserService from "../service/user.service.js";

const userService = new UserService();
const SECRET_KEY = process.env.JWT_SECRET;

export default class SessionsController {
  async register(req, res) {
    try {
      const usuario = await userService.register(req.body);
      res.status(201).json({ message: "Registro exitoso", usuario });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const usuario = await userService.login(email, password);

      const token = jwt.sign(usuario, SECRET_KEY, { expiresIn: "1h" });

      res.cookie("tokenCookie", token, { httpOnly: true });
      res.json({ message: "Login exitoso", usuario });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async current(req, res) {
    res.json({ message: "Usuario autenticado", usuario: req.user });
  }

  async logout(req, res) {
    res.clearCookie("tokenCookie");
    res.json({ message: "Logout exitoso" });
  }
}
