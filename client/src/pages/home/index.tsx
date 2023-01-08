import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import format from "format-duration";
import Chessground from "react-chessground";
import { Chess, Move } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Person } from "@/assets/person.svg";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import GuessModal from "@/components/GuessModal";
import { axios } from "@/config";

import "react-chessground/dist/styles/chessground.css";
import "@/assets/cburnett.css";
import "./index.scss";
import { RandomGame } from "types";

dayjs.extend(duration);

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

const Home = () => {
    const navigate = useNavigate();
    const chess = useMemo(() => new Chess(), []);

    const [currMove, setCurrMove] = useState(-1);
    const [fen, setFen] = useState(chess.fen());
    const [pgn, setPgn] = useState<Chess>(new Chess());
    const [moves, setMoves] = useState<(string | Move)[]>([]);
    const [realElo, setRealElo] = useState(0);
    // clock states
    const [blackClock, setBlackClock] = useState("");
    const [whiteClock, setWhiteClock] = useState("");
    // form
    const [guessedElo, setGuessedElo] = useState(null);
    const [guessed, setGuessed] = useState(false);

    useEffect(() => {
        (async () => {
            const result = await axios.get("/games/random");
            const game: RandomGame = result.data;
            const game_pgn = new Chess();
            game_pgn.loadPgn(game.game.pgn);

            // initialize game states
            setPgn(game_pgn);
            setMoves(game_pgn.history());
            setRealElo(Number.parseInt(game_pgn.header()[`${game.player}Elo`]));
            setWhiteClock(getMoveClock(game_pgn, 0)); // FIXME: starting times
            setBlackClock(getMoveClock(game_pgn, 0));
        })();
    }, []);

    const refreshPage = () => {
        navigate(0);
    };
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
        setCurrClock(getMoveClock(pgn, index));
        if (index > 0) {
            setOtherClock(getMoveClock(pgn, index - 1));
        } else {
            setOtherClock(getMoveClock(pgn, index));
        }
    };

    return (
        <main>
            {guessed && (
                <GuessModal
                    guessedElo={guessedElo || 0}
                    actualRating={realElo}
                    gameLink={pgn.header()["Link"]}
                    onContinue={refreshPage}
                    onClickOff={() => {
                        setGuessed(false);
                    }}
                />
            )}
            <Navbar />
            {moves && (
                <div
                    className="container"
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                >
                    <div className="game-board">
                        <div className="black-info">
                            <div className="player">
                                <Person />
                                <p>Black</p>
                            </div>
                            <div className="timer">{blackClock}</div>
                        </div>

                        <Chessground fen={fen} />

                        <div className="white-info">
                            <div className="player">
                                <Person />
                                <p>White</p>
                            </div>
                            <div className="timer">{whiteClock}</div>
                        </div>
                    </div>

                    <div className="sidebar">
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
                                            2 * index + 1 == currMove &&
                                            "active"
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
                                <p>{pgn.header()["Result"]}</p>
                                <p>{pgn.header()["Termination"]}</p>
                            </div>
                        </div>
                        <div className="guess">
                            <input
                                type="number"
                                placeholder="Enter Elo"
                                value={guessedElo}
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
        </main>
    );
};

export default Home;
