import dotenv from "dotenv";

dotenv.config();

export const {
    NODE_ENV = "development",
    APP_PORT = 3080,
    MONGO_URI = "mongodb://localhost:27017/eloguess",
} = process.env;
