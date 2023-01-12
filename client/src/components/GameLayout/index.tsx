import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import format from "format-duration";
import Chessground from "react-chessground";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";

import { ReactComponent as Person } from "@/assets/person.svg";
import Button from "@/components/Button";
import GuessModal from "@/components/GuessModal";

import "react-chessground/dist/styles/chessground.css";
import "@/assets/cburnett.css";
import "./index.scss";

interface ClockProps {
    player: "White" | "Black";
    timestamp: string;
}

const Clock = ({ player, timestamp }: ClockProps) => {
    return (
        <div className="clock-info">
            <div className="player">
                <Person />
                <p>{player}</p>
            </div>
            <div className="timer">{timestamp}</div>
        </div>
    );
};

interface NotationProps {
    game: Chess;
    currMove: number;
    goToMove: (move: number) => void;
}

const Notation = ({ game, currMove, goToMove }: NotationProps) => {
    const moves = game.history();
    return (
        <div className="notation">
            {chunks(moves, 2).map((move, index) => (
                <div className="move">
                    <p className="move-num">{index + 1}</p>
                    <p
                        className={`move-cell ${
                            index * 2 == currMove && "active"
                        }`}
                        onClick={() => {
                            goToMove(2 * index);
                        }}
                    >
                        {move[0] && move[0].toString()}
                    </p>
                    <p
                        className={`move-cell ${
                            2 * index + 1 == currMove && "active"
                        }`}
                        onClick={() => {
                            goToMove(2 * index + 1);
                        }}
                    >
                        {move[1] && move[1].toString()}
                    </p>
                </div>
            ))}
            <div className="result">
                <p>{game.header()["Result"]}</p>
                <p>{game.header()["Termination"]}</p>
            </div>
        </div>
    );
};

dayjs.extend(duration);
export interface Props {
    pgn: string;
    playerToGuess: "White" | "Black";
}

const getMoveClock = (pgn: Chess, index: number): string => {
    let clock_regex = /\[\%clk (.+)(\.\d+)?\]/;
    let comment = pgn.getComments()[index].comment;
    let matched = comment.match(clock_regex);
    if (matched && matched.length >= 2) {
        let [hours, minutes, seconds] = matched[1].split(":");
        let durationObj = {
            hours: Number.parseInt(hours),
            minutes: Number.parseInt(minutes),
            seconds: Number.parseInt(seconds),
        };
        let dur = dayjs.duration(durationObj);
        return format(dur.asMilliseconds());
    } else {
        return "";
    }
};

function chunks<T>(arr: T[], n: number): T[][] {
    let res = [];
    for (let i = 0; i < arr.length; i += n) {
        res.push(arr.slice(i, i + n));
    }
    return res;
}

const GameLayout = ({ pgn, playerToGuess }: Props) => {
    const chess = useMemo(() => new Chess(), []);
    const [currMove, setCurrMove] = useState(-1);
    const [fen, setFen] = useState(chess.fen());

    const game = new Chess();
    game.loadPgn(pgn);
    const moves = game.history();
    const realElo = Number.parseInt(game.header()[`${playerToGuess}Elo`]);

    // clock states
    const [blackClock, setBlackClock] = useState(getMoveClock(game, 0));
    const [whiteClock, setWhiteClock] = useState(getMoveClock(game, 0));
    // form
    const [guessedElo, setGuessedElo] = useState(null);
    const [guessed, setGuessed] = useState(false);

    const goToMove = (moveNum: number) => {
        setCurrMove(moveNum);
        updateClock(moveNum);
        chess.reset();
        for (let i = 0; i <= moveNum; i++) {
            chess.move(moves[i]);
        }
        setFen(chess.fen());
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (
            ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(e.key)
        ) {
            e.preventDefault();
        }
        let newMoveIndex = currMove;
        if (e.key == "ArrowUp") {
            // up arrow
            newMoveIndex = 0;
            chess.reset();
            setCurrMove(newMoveIndex);
        } else if (e.key == "ArrowDown") {
            // down arrow
            newMoveIndex = moves.length - 1;
            setCurrMove(newMoveIndex);
            chess.reset();
            for (let move of moves) {
                chess.move(move);
            }
        } else if (e.key == "ArrowLeft") {
            // left arrow
            if (currMove - 1 >= 0) {
                newMoveIndex = currMove - 1;
                setCurrMove(currMove - 1);
                chess.undo();
            } else if (currMove - 1 === -1) {
                newMoveIndex = -1;
                setCurrMove(-1);
                chess.reset();
            }
        } else if (e.key == "ArrowRight") {
            // right arrow
            newMoveIndex = currMove + 1;
            if (currMove + 1 < moves.length) {
                setCurrMove(currMove + 1);
                chess.move(moves[currMove + 1]);
            }
        }
        updateClock(newMoveIndex);
        setFen(chess.fen());
    };

    const updateClock = (index: number) => {
        let setCurrClock = setWhiteClock;
        let setOtherClock = setBlackClock;
        if (index % 2 != 0) {
            setCurrClock = setBlackClock;
            setOtherClock = setWhiteClock;
        }
        setCurrClock(getMoveClock(game, index));
        if (index > 0) {
            setOtherClock(getMoveClock(game, index - 1));
        } else {
            setOtherClock(getMoveClock(game, index));
        }
    };

    return (
        <div className="game-layout">
            {guessed && (
                <GuessModal
                    guessedElo={guessedElo || 0}
                    actualRating={realElo}
                    gameLink={game.header()["Link"]}
                    onContinue={() => {
                        /* TODO */
                    }}
                    onClickOff={() => {
                        setGuessed(false);
                    }}
                />
            )}
            {moves && (
                <div
                    className="game-container"
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                >
                    <div className="game-board">
                        <Clock player="Black" timestamp={blackClock} />
                        <Chessground
                            style={{ marginBottom: "1.4rem" }} // accomodate for coords
                            fen={fen}
                        />
                        <Clock player="White" timestamp={whiteClock} />
                    </div>

                    <div className="sidebar">
                        <Notation
                            game={game}
                            currMove={currMove}
                            goToMove={goToMove}
                        />
                        <div className="guess">
                            <input
                                type="number"
                                placeholder="Enter Elo"
                                value={guessedElo || ""}
                                onKeyDown={(event) => {
                                    if (event.key == "Enter") setGuessed(true);
                                }}
                                onChange={(e) => {
                                    setGuessedElo(
                                        Number.parseInt(e.target.value)
                                    );
                                }}
                            />
                            <Button
                                onClick={() => {
                                    setGuessed(true);
                                }}
                            >
                                Guess
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameLayout;
