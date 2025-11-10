import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../dao/models/user.model.js";

const SECRET_KEY = process.env.JWT_SECRET;

const buscarToken = (req) => req?.cookies?.tokenCookie || null;

export const initPassport = () => {
  // Estrategia JWT (verifica usuarios autenticados con token)
  passport.use(
    "current",
    new JWTStrategy(
      {
        secretOrKey: SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([buscarToken]),
      },
      async (usuario, done) => {
        try {
          // Ejemplo de restricción temporal
          if (usuario.first_name === "Martin") {
            return done(null, false, {
              message:
                "El usuario Martin tiene temporalmente el acceso inhabilitado. Contacte a RRHH.",
            });
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia Local (login con email y contraseña)
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const usuario = await User.findOne({ email });
          if (!usuario) {
            return done(null, false, { message: "Credenciales inválidas." });
          }

          const esValido = bcrypt.compareSync(password, usuario.password);
          if (!esValido) {
            return done(null, false, { message: "Credenciales inválidas." });
          }

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización de usuario (requerida por Passport)
  passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await User.findById(id);
      done(null, usuario);
    } catch (error) {
      done(error);
    }
  });
};
