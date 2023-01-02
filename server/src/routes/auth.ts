import express from "express"
import { authController } from "../controllers"
import * as authValidation from "../validations"
import { validate } from "../utils"

const router = express.Router()

router.post("/register", validate(authValidation.register), authController.register)
router.post("/login", validate(authValidation.login), authController.login)
router.post("/logout", authController.logout)

export default router