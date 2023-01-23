import { GameModel } from "../models";
import { IGame, RandomGame } from "types";

export const fetchRandomGame = async (
    minimumMoves?: string,
    allowedTimeControls?: string[]
): Promise<RandomGame> => {
    let moveGreater = Number.parseInt(minimumMoves || "0");
    const game: IGame = (
        await GameModel.aggregate([
            {
                $match: {
                    time_class: { $in: allowedTimeControls },
                    num_moves: { $gte: moveGreater },
                },
            },
            { $sample: { size: 1 } },
        ])
    )[0];
    console.log(game);
    return {
        game,
    };
};
