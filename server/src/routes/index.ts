import express from "express"
import gamesRoute from "./games"

export const router = express.Router()
router.use("/games", gamesRoute)

