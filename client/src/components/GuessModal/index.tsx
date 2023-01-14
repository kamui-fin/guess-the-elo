import { axios } from "@/config";
import { useEffect, useState } from "react";
import Button from "../Button";
import { ReactComponent as Person } from "@/assets/person.svg";
import "./index.scss";

interface Props {
    guessedElo: number;
    gameLink: string;
    whiteUsername: string;
    blackUsername: string;
    whiteRating: number;
    blackRating: number;
    onContinue: () => void;
    onClickOff: () => void;
}

const GuessModal = ({
    guessedElo,
    whiteUsername,
    blackUsername,
    whiteRating,
    blackRating,
    gameLink,
    onContinue,
    onClickOff,
}: Props) => {
    const [open, setOpen] = useState(true);
    const [avatars, setAvatars] = useState({});

    const actualRating = Math.floor((whiteRating + blackRating) / 2);

    useEffect(() => {
        (async () => {
            const whiteData = (
                await axios.get(
                    `https://api.chess.com/pub/player/${whiteUsername}`
                )
            ).data;
            const whiteAvatar = whiteData.avatar ? (
                <img src={whiteData.avatar} />
            ) : (
                <Person />
            );
            const blackData = (
                await axios.get(
                    `https://api.chess.com/pub/player/${blackUsername}`
                )
            ).data;
            const blackAvatar = blackData.avatar ? (
                <img src={blackData.avatar} />
            ) : (
                <Person />
            );
            setAvatars({ white: whiteAvatar, black: blackAvatar });
        })();
    }, []);

    const isCorrect = () => {
        return (
            guessedElo >= actualRating - 100 && guessedElo <= actualRating + 100
        );
    };

    return (
        <div
            className={`modal ${open && "open"}`}
            onClick={() => {
                setOpen(false);
                onClickOff();
            }}
        >
            <div
                className="modal-content"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
            >
                {!isCorrect() ? (
                    <h2 className="incorrect-text">Incorrect</h2>
                ) : (
                    <h2 className="correct-text">Correct</h2>
                )}
                <p>
                    You guessed{" "}
                    <span className="incorrect-text">{guessedElo}</span>. Off by{" "}
                    <span className="correct-text">
                        {Math.abs(actualRating - guessedElo)}
                    </span>{" "}
                    points!
                </p>
                <div className="player-stats">
                    <div className="white">
                        <h4>{whiteUsername}</h4>
                        {avatars.white}
                        <h2>{actualRating}</h2>
                    </div>
                    <h3>VS</h3>
                    <div className="black">
                        <h4>{blackUsername}</h4>
                        {avatars.black}
                        <h2>{blackRating}</h2>
                    </div>
                </div>
                <div className="button-group">
                    <Button>
                        <a href={gameLink}>View Game</a>
                    </Button>
                    <Button onClick={onContinue} type="secondary">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GuessModal;
