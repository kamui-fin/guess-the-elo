import express from "express"
import authRoute from "./auth"
import gamesRoute from "./games"

export const router = express.Router()
router.use("/auth", authRoute)
router.use("/games", gamesRoute)
