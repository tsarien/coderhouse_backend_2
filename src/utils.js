import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import passport from "passport"; // ✅ Falta esta importación

// Obtención del __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// 🔐 Hash y validación de contraseñas
export const generaHash = (password) => bcrypt.hashSync(password, 10);
export const validaPass = (pass, hash) => bcrypt.compareSync(pass, hash);

// 🔑 Middleware genérico para usar estrategias de Passport
export const passportCall = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: info?.message || info?.toString() || "Error de autenticación",
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  };
};
