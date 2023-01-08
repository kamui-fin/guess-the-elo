import { Schema, model } from "mongoose";
import { IGame } from "types";

const schema = new Schema<IGame>({
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
    pgn: String,
});

export const GameModel = model<IGame>("Game", schema);
