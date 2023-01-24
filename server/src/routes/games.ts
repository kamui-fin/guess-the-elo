import express from "express";
import { gamesController } from "../controllers";

const router = express.Router();

router.get("/random", gamesController.getRandom);

export default router;

