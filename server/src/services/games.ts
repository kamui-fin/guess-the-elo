import { GameModel } from "../models";
import { IGame, RandomGame } from "types";

export const fetchRandomGame = async (): Promise<RandomGame> => {
    const game: IGame = (
        await GameModel.aggregate([{ $sample: { size: 1 } }])
    )[0];
    return {
        game,
    };
};
