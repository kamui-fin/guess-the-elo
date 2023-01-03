import { GameModel, IGame } from "../models"

export const fetchRandomGame = async () => {
    const game: IGame = (await GameModel.aggregate([{ $sample: { size: 1 } }]))[0]
    return game
}
