import Navbar from "../../components/Navbar";
import Chessground from "react-chessground";
import { Chess } from "chess.js";
import "react-chessground/dist/styles/chessground.css";
import "../../assets/cburnett.css";
import { ReactElement, useCallback, useMemo, useState } from "react";
import "./index.scss";
import Button from "../../components/Button";
import { ReactComponent as Person } from "../../assets/person.svg";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import format from "format-duration";
import GuessModal from "../../components/GuessModal";

dayjs.extend(duration);

const sample_pgn =
    '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2021.05.23"]\n[Round "-"]\n[White "KuzuriChess"]\n[Black "0pensh1ft"]\n[Result "1-0"]\n[CurrentPosition "q5nr/p3kQ2/2pR1p1p/1pn3p1/2B1P3/6B1/PP3PPP/R5K1 b - -"]\n[Timezone "UTC"]\n[ECO "D08"]\n[ECOUrl "https://www.chess.com/openings/Queens-Gambit-Declined-Albin-Countergambit"]\n[UTCDate "2021.05.23"]\n[UTCTime "13:04:06"]\n[WhiteElo "1022"]\n[BlackElo "1053"]\n[TimeControl "600"]\n[Termination "KuzuriChess won by checkmate"]\n[StartTime "13:04:06"]\n[EndDate "2021.05.23"]\n[EndTime "13:12:05"]\n[Link "https://www.chess.com/game/live/15513841013"]\n\n1. d4 {[%clk 0:10:00]} 1... d5 {[%clk 0:09:59.1]} 2. c4 {[%clk 0:09:58.8]} 2... e5 {[%clk 0:09:57.9]} 3. cxd5 {[%clk 0:09:49.1]} 3... Qxd5 {[%clk 0:09:54.8]} 4. Nc3 {[%clk 0:09:34.2]} 4... Qe6 {[%clk 0:09:51.6]} 5. dxe5 {[%clk 0:09:31.7]} 5... Qxe5 {[%clk 0:09:50.4]} 6. Nf3 {[%clk 0:09:30.6]} 6... Qf6 {[%clk 0:09:37.6]} 7. Nd5 {[%clk 0:09:20.1]} 7... Qd8 {[%clk 0:09:03.6]} 8. e4 {[%clk 0:09:15.1]} 8... Bd6 {[%clk 0:08:59.6]} 9. Bc4 {[%clk 0:09:00.6]} 9... Bg4 {[%clk 0:08:57.7]} 10. O-O {[%clk 0:08:56.8]} 10... Bxf3 {[%clk 0:08:40.1]} 11. Qxf3 {[%clk 0:08:54.6]} 11... c6 {[%clk 0:08:38.4]} 12. Nb6 {[%clk 0:08:44]} 12... f6 {[%clk 0:08:12.7]} 13. Nxa8 {[%clk 0:08:38.7]} 13... Na6 {[%clk 0:08:10.2]} 14. Rd1 {[%clk 0:08:24.7]} 14... Nc5 {[%clk 0:07:37.9]} 15. Bg5 {[%clk 0:07:57.8]} 15... h6 {[%clk 0:07:14.3]} 16. Bh4 {[%clk 0:07:46.9]} 16... g5 {[%clk 0:07:02.4]} 17. Bg3 {[%clk 0:07:44.8]} 17... b5 {[%clk 0:06:00.2]} 18. Rxd6 {[%clk 0:07:35]} 18... Qxa8 {[%clk 0:05:56]} 19. Qh5+ {[%clk 0:06:44.6]} 19... Ke7 {[%clk 0:05:30.4]} 20. Qf7# {[%clk 0:06:41.2]} 1-0\n';
const pgn = new Chess();
pgn.loadPgn(sample_pgn);
const moves = pgn.history();

const getMoveClock = (index) => {
    let test = pgn.getComments()[index].comment;
    let clock_regex = /\[\%clk (.+)(\.\d+)?\]/;
    let res = test.match(clock_regex)[1];
    let [hours, minutes, seconds] = res.split(":");
    let obj = {
        hours: Number.parseInt(hours),
        minutes: Number.parseInt(minutes),
        seconds: Number.parseInt(seconds),
    };
    let dur = dayjs.duration(obj);
    return format(dur.asMilliseconds());
};

function chunks<T>(arr: T[], n: number): T[][] {
    let res = [];
    for (let i = 0; i < arr.length; i += n) {
        res.push(arr.slice(i, i + n));
    }
    return res;
}

const Home = () => {
    const chess = useMemo(() => new Chess(), []);
    const [currMove, setCurrMove] = useState(-1);
    const [fen, setFen] = useState(chess.fen());
    const [blackClock, setBlackClock] = useState(getMoveClock(0));
    const [whiteClock, setWhiteClock] = useState(getMoveClock(0));

    const handleKeyPress = (e) => {
        if ([38, 40, 37, 39].includes(e.keyCode)) {
            e.preventDefault();
        }
        let newMoveIndex = currMove;
        if (e.keyCode == "38") {
            // up arrow
            newMoveIndex = 0;
            chess.reset();
            setCurrMove(newMoveIndex);
        } else if (e.keyCode == "40") {
            // down arrow
            newMoveIndex = moves.length - 1;
            setCurrMove(newMoveIndex);
            chess.reset();
            for (let move of moves) {
                chess.move(move);
            }
        } else if (e.keyCode == "37") {
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
        } else if (e.keyCode == "39") {
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

    const updateClock = (index) => {
        if (index % 2 == 0) {
            setWhiteClock(getMoveClock(index));
            if (index > 0) {
                setBlackClock(getMoveClock(index - 1));
            } else {
                setBlackClock(getMoveClock(index));
            }
        } else {
            setBlackClock(getMoveClock(index));
            if (index > 0) {
                setWhiteClock(getMoveClock(index - 1));
            } else {
                setWhiteClock(getMoveClock(index));
            }
        }
    };

    return (
        <main>
            <GuessModal />
            <Navbar />
            <div
                className="container"
                onKeyDown={handleKeyPress}
                tabIndex={0}
                ref={useCallback((elm) => {
                    if (elm) elm.focus();
                })}
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
                                        move[0] == moves[currMove] && "active"
                                    }`}
                                    onClick={() => {
                                        setCurrMove(2 * index);
                                        updateClock(2 * index);
                                        // needs optimizing
                                        chess.reset();
                                        for (let i = 0; i <= 2 * index; i++) {
                                            chess.move(moves[i]);
                                        }
                                        setFen(chess.fen());
                                    }}
                                >
                                    {move[0]}
                                </p>
                                <p
                                    className={`move-cell ${
                                        move[1] == moves[currMove] && "active"
                                    }`}
                                    onClick={() => {
                                        setCurrMove(2 * index + 1);
                                        updateClock(2 * index + 1);
                                        chess.reset();
                                        for (
                                            let i = 0;
                                            i <= 2 * index + 1;
                                            i++
                                        ) {
                                            chess.move(moves[i]);
                                        }
                                        setFen(chess.fen());
                                    }}
                                >
                                    {move[1]}
                                </p>
                            </div>
                        ))}
                        <div className="result">
                            <p>{pgn.header()["Result"]}</p>
                            <p>{pgn.header()["Termination"]}</p>
                        </div>
                    </div>
                    <div className="guess">
                        <input type="number" placeholder="Enter Elo" />
                        <Button>Guess</Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
