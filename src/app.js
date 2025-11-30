import express from "express";
import path from "path";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectMongo from "connect-mongo";
import { engine } from "express-handlebars";

import { config } from "./config/config.js";
import connectMongoDB from "./config/db.js";
import { initPassport } from "./config/passport.config.js";
import __dirname from "./utils.js";

import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import { userToView } from "./middlewares/auth.js";
import { getOrCreateCart } from "./middlewares/cart.js";
import ticketRouter from "./routes/tickets.router.js";

const app = express();
const PORT = config.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: config.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      mongoUrl: config.MONGO_URL,
      ttl: 3600,
    }),
  })
);

initPassport();
app.use(passport.initialize());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(userToView);
app.use(getOrCreateCart);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketRouter);
app.use("/", viewsRouter);

app.listen(PORT, () =>
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
);

connectMongoDB();
