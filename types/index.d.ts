export interface IGame {
    white_username: string;
    black_username: string;
    white_id: string;
    black_id: string;
    white_rating: number;
    black_rating: number;
    white_result: string;
    black_result: string;
    time_class: string;
    time_control: number;
    rules: string;
    rated: string;
    fen: string;
    pgn: string;
}

export interface RandomGame {
    game: IGame;
}
