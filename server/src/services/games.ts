import { GameModel, IGame } from "../models"
import pgnParser from "pgn-parser"

export const fetchRandomGame = async () => {
    const game: IGame = (await GameModel.aggregate([{ $sample: { size: 1 } }]))[0]
    const [pgnExpanded] = pgnParser.parse(game.pgn)
    return { ...game, pgn: pgnExpanded }
}
