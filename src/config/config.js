import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.URI_MONGODB,
  DB_NAME: process.env.DB_NAME,
  SECRET_SESSION: process.env.SECRET_SESSION,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};
