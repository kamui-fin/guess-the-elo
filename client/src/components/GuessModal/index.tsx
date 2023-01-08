import { useState } from "react";
import Button from "../Button";
import "./index.scss";

interface Props {
    guessedElo: number;
    actualRating: number;
    gameLink: string;
    onContinue: () => void;
    onClickOff: () => void;
}

const GuessModal = ({
    guessedElo,
    actualRating,
    gameLink,
    onContinue,
    onClickOff,
}: Props) => {
    const [open, setOpen] = useState(true);

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
                    You guessed {guessedElo}. Off by{" "}
                    {Math.abs(actualRating - guessedElo)} points!
                </p>
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
