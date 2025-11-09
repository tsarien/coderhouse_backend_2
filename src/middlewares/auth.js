import jwt from "jsonwebtoken";

export const auth = (permisos = []) => {
  return (req, res, next) => {
    if (!Array.isArray(permisos)) {
      return res.status(500).json({
        error:
          "Permisos de la ruta mal configurados. Contacte al administrador.",
      });
    }

    permisos = permisos.map((p) => p.toLowerCase());

    // Rutas públicas
    if (permisos.includes("public")) return next();

    const token = req.cookies?.tokenCookie;
    if (!token) {
      return res.status(401).json({ error: "No hay usuarios autenticados" });
    }

    try {
      const usuario = jwt.verify(token, "CoderCoder123");
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

// Middleware para pasar el usuario autenticado a las vistas (no bloquea si no hay token)
export const userToView = (req, res, next) => {
  const token = req.cookies?.tokenCookie;
  if (token) {
    try {
      const usuario = jwt.verify(token, "CoderCoder123");
      res.locals.user = usuario;
      res.locals.isAuthenticated = true;
    } catch (error) {
      res.locals.user = null;
      res.locals.isAuthenticated = false;
    }
  } else {
    res.locals.user = null;
    res.locals.isAuthenticated = false;
  }
  next();
};