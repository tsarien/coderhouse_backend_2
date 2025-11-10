import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../dao/models/user.model.js";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) throw new Error("JWT_SECRET no está definido");

const buscarToken = (req) => req?.cookies?.tokenCookie || null;

export const initPassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        secretOrKey: SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([buscarToken]),
      },
      async (payload, done) => {
        try {
          if (payload.exp && Date.now() / 1000 > payload.exp) {
            return done(null, false, { message: "El token ha expirado." });
          }
          return done(null, payload);
        } catch (error) {
          console.error("Error en estrategia JWT:", error);
          return done(error);
        }
      }
    )
  );

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
