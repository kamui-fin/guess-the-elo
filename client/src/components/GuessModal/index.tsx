import { axios } from "@/config";
import { useEffect, useState } from "react";
import Button from "../Button";
import personUrl from "@/assets/person.svg?url";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
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

    const defaultAvatar = (
        <LazyLoadImage
            width="100px"
            height="100px"
            effect="blur"
            src={personUrl}
        />
    );

    useEffect(() => {
        (async () => {
            const whiteData = (
                await axios.get(
                    `https://api.chess.com/pub/player/${whiteUsername}`
                )
            ).data;
            const blackData = (
                await axios.get(
                    `https://api.chess.com/pub/player/${blackUsername}`
                )
            ).data;
            setAvatars({ white: whiteData.avatar, black: blackData.avatar });
        })();
    }, []);

    const isCorrect = () => {
        return (
            guessedElo >= actualRating - 100 && guessedElo <= actualRating + 100
        );
    };

    const openInNewTab = (url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    return (
        <AnimatePresence>
            <div
                className={`modal ${open && "open"}`}
                onClick={() => {
                    setOpen(false);
                    onClickOff();
                }}
            >
                <motion.div
                    className="modal-content"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    initial={{
                        opacity: 0,
                        scale: 0.75,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            ease: "easeOut",
                            duration: 0.15,
                        },
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.75,
                        transition: {
                            ease: "easeIn",
                            duration: 0.15,
                        },
                    }}
                >
                    {!isCorrect() ? (
                        <h2 className="incorrect-text">Incorrect</h2>
                    ) : (
                        <h2 className="correct-text">Correct</h2>
                    )}
                    <p>
                        You guessed{" "}
                        <span className="incorrect-text">{guessedElo}</span>.
                        Off by{" "}
                        <span className="correct-text">
                            {Math.abs(actualRating - guessedElo)}
                        </span>{" "}
                        points!
                    </p>
                    <div className="player-stats">
                        <div className="white">
                            <h4>{whiteUsername}</h4>
                            {avatars.white ? (
                                <LazyLoadImage
                                    width="100px"
                                    height="100px"
                                    effect="blur"
                                    src={avatars.white}
                                />
                            ) : (
                                defaultAvatar
                            )}
                            <h2>{actualRating}</h2>
                        </div>
                        <h3>VS</h3>
                        <div className="black">
                            <h4>{blackUsername}</h4>
                            {avatars.black ? (
                                <LazyLoadImage
                                    width="100px"
                                    height="100px"
                                    effect="blur"
                                    src={avatars.black}
                                />
                            ) : (
                                defaultAvatar
                            )}
                            <h2>{blackRating}</h2>
                        </div>
                    </div>
                    <div className="button-group">
                        <a
                            href={gameLink}
                            onClick={() => openInNewTab(gameLink)}
                        >
                            <Button>View Game</Button>
                        </a>
                        <Button onClick={onContinue} type="secondary">
                            New Round
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GuessModal;
