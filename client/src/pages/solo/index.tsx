import { useEffect, useState } from "react";
import { axios } from "@/config";
import GameLayout, { Props as GameProps } from "@/components/GameLayout";

import "./index.scss";
import Layout from "@/components/Layout";

const Solo = () => {
    const [gameProps, setGameProps] = useState<GameProps | null>();

    const getSettings = () => {
        const storedSettings = localStorage.getItem("settings");
        if (storedSettings) return JSON.parse(storedSettings);
        return {};
    };

    const nextGame = async () => {
        const result = await axios.get("/games/random", {
            params: getSettings(),
        });
        setGameProps({
            pgn: result.data.game.pgn,
            nextGame,
        });
    };

    useEffect(() => {
        (async () => {
            await nextGame();
        })();
    }, []);

    return (
        <Layout>
            <div className="container">
                {gameProps && <GameLayout {...gameProps} />}
            </div>
        </Layout>
    );
};

export default Solo;
