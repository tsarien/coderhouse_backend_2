import express from "express";
import path from "path";
import productsRouter from "./routes/products.router.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import cartRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import connectMongo from "connect-mongo";
import { config } from "./config/config.js";
import __dirname from "./utils.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

app.use(
  session({
    secret: config.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    store: connectMongo.create({
      mongoUrl: config.MONGO_URL,
      ttl: 3600,
    }),
  })
);

app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en http://localhost:${PORT}`);
});

// Conexión a MongoDB
connectMongoDB();
