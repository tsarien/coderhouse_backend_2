import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.URI_MONGODB,
  DB_NAME: process.env.DB_NAME,
  SECRET_SESSION: process.env.SECRET_SESSION,
};
