import { useEffect, useState } from "react";
import { axios } from "@/config";
import Navbar from "@/components/Navbar";
import GameLayout, { Props as GameProps } from "@/components/GameLayout";

import "./index.scss";

const Home = () => {
    const [gameProps, setGameProps] = useState<GameProps | null>(null);

    useEffect(() => {
        (async () => {
            const result = await axios.get("/games/random");
            setGameProps({
                pgn: result.data.game.pgn,
            });
        })();
    }, []);

    return (
        <main>
            <Navbar />
            <div className="container">
                {gameProps && <GameLayout {...gameProps} />}
            </div>
        </main>
    );
};

export default Home;
