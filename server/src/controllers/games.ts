import httpStatus from "http-status"
import { catchAsync } from "../utils"
import { fetchRandomGame } from "../services/games"

export const getRandom = catchAsync(async (req, res) => {
    const game = await fetchRandomGame()
    res.status(httpStatus.OK).json(game)
})
