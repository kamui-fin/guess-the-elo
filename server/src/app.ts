import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { MONGO_URI, APP_PORT } from "./config";
import { errorHandler } from "./middlewares/error";
import { errors } from "celebrate";
import { router } from "./routes";

const app = express();
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(morgan("combined"));

// setup db, app, and routes
app.use(express.json());
app.use(router);
app.use(errors());
app.use(errorHandler);
mongoose.connect(MONGO_URI).then(() => {
    app.listen(APP_PORT, () => {
        console.log(`Listening to port ${APP_PORT}`);
    });
});
