import { useState } from "react";
import Button from "../Button";
import "./index.scss";

const GuessModal = ({
    guessedElo = 1200,
    actualRating = 1151,
    gameLink = "#",
}) => {
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
                    <Button type="secondary">Continue</Button>
                </div>
            </div>
        </div>
    );
};

export default GuessModal;
