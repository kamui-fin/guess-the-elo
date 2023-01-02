import express from "express"
import mongoose from "mongoose"
import helmet from "helmet"
import connectRedis from "connect-redis"
import session from "express-session"
import cors from "cors"
import morgan from "morgan"
import { MONGO_URI, REDIS_URI, APP_PORT, SESSION_OPTS } from "./config"
import { createClient } from "redis"
import { errorHandler } from "./middlewares/error"
import { errors } from "celebrate"
import { router } from "./routes"

const app = express()
app.use(cors({credentials: true}))
app.use(helmet())
app.use(morgan("combined"))

const initRedis = async () => {
    // initialize redis
    const redisClient = createClient({
        legacyMode: true,
        url: REDIS_URI,
    })
    redisClient.on("error", (err) => {
        console.log("Could not establish a connection with redis. " + err)
    })
    redisClient.on("connect", () => {
        console.log("Connected to redis successfully")
    })
    await redisClient.connect()
    const RedisStore = connectRedis(session)
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            ...SESSION_OPTS,
        })
    )
}

initRedis().then(() => {
    // setup db, app, and routes
    app.use(express.json())
    app.use(router)
    app.use(errors())
    app.use(errorHandler)
    mongoose.connect(MONGO_URI).then(() => {
        app.listen(APP_PORT, () => {
            console.log(`Listening to port ${APP_PORT}`)
        })
    })
})
