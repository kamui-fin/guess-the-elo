import { useEffect, useState } from "react";
import { axios } from "@/config";
import GameLayout, { Props as GameProps } from "@/components/GameLayout";

import "./index.scss";
import Layout from "@/components/Layout";

const Solo = () => {
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
        <Layout>
            <div className="container">
                {gameProps && <GameLayout {...gameProps} />}
            </div>
        </Layout>
    );
};

export default Solo;
