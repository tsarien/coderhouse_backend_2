import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const SECRET_KEY = config.JWT_SECRET;
if (!SECRET_KEY) throw new Error("JWT_SECRET no está definido. Contacte al administrador.");

export const auth = (permisos = []) => {
  return (req, res, next) => {
    if (!Array.isArray(permisos)) {
      return res.status(500).json({
        error:
          "Permisos de la ruta mal configurados. Contacte al administrador.",
      });
    }
    permisos = permisos.map((p) => p.toLowerCase());
    if (permisos.includes("public")) return next();

    const token = req.cookies?.tokenCookie;
    if (!token) {
      return res.status(401).json({ error: "No hay usuarios autenticados" });
    }
    try {
      const usuario = jwt.verify(token, SECRET_KEY);
      req.user = usuario;
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Credenciales inválidas", detalle: error.message });
    }
    if (!permisos.includes(req.user.role?.toLowerCase())) {
      return res.status(403).json({
        error:
          "No tiene privilegios suficientes para acceder al recurso solicitado.",
      });
    }
    return next();
  };
};

export const authAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores." });
  }
  next();
};

export const authUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Acceso solo para usuarios." });
  }
  next();
};

export const userToView = (req, res, next) => {
  const token = req.cookies?.tokenCookie;
  if (token) {
    try {
      const usuario = jwt.verify(token, SECRET_KEY);
      req.user = usuario;
      res.locals.user = usuario;
      res.locals.isAuthenticated = true;
    } catch (error) {
      req.user = null;
      res.locals.user = null;
      res.locals.isAuthenticated = false;
    }
  } else {
    req.user = null;
    res.locals.user = null;
    res.locals.isAuthenticated = false;
  }
  next();
};
