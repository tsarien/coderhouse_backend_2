export const auth = (req, res, next) => {
  if (!req.session.usuario) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `No hay usuarios autenticados` });

    return res.redirect("/login"); // login debe ser una vista (html) o contenido estático
  }

  req.user = req.session.usuario;

  next();
};
