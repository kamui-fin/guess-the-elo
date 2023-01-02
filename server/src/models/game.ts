import { Schema, model } from "mongoose"

export interface IGame {
    white_username: string,
    black_username: string,
    white_id: string,
    black_id: string,
    white_rating: number,
    black_rating: number,
    white_result: string,
    black_result: string,
    time_class: string,
    time_control: number,
    rules: string,
    rated: string,
    fen: string,
    pgn: string;
}

const schema = new Schema<IGame>(
    {
        white_username: String,
        black_username: String,
        white_id: String,
        black_id: String,
        white_rating: Number,
        black_rating: Number,
        white_result: String,
        black_result: String,
        time_class: String,
        time_control: Number,
        rules: String,
        rated: String,
        fen: String,
        pgn: String
    }
)

export const GameModel = model<IGame>("Game", schema)
