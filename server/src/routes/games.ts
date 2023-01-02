import express from "express"
import { gamesController } from "../controllers"
import { validate } from "../utils"

const router = express.Router()

router.get("/random", gamesController.getRandom)

export default router
