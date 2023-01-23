import httpStatus from "http-status";
import { catchAsync } from "../utils";
import { fetchRandomGame } from "../services/games";

export const getRandom = catchAsync(async (req, res) => {
    const { minimumMoves, allowedTimeControls } = req.query;
    const game = await fetchRandomGame(minimumMoves, allowedTimeControls);
    res.status(httpStatus.OK).json(game);
});
