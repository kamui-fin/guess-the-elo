import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Switch from "react-switch";
import "./index.scss";

type Settings = {
    allowedTimeControls: string[];
    minimumMoves: string[];
};

const TIME_CONTROLS = ["blitz", "bullet", "daily", "rapid"];

const Settings = () => {
    const [allowedTimeControls, setAllowedTimeControls] = useState(
        TIME_CONTROLS.slice()
    );
    const [minimumMoves, setMinimumMoves] = useState(0);

    const loadSettings = () => {
        const storedPref = localStorage.getItem("settings");
        if (storedPref) {
            const settings = JSON.parse(storedPref);
            setMinimumMoves(settings.minimumMoves);
            setAllowedTimeControls(settings.allowedTimeControls);
        }
    };

    const saveSettings = () => {
        // TODO validate
        localStorage.setItem(
            "settings",
            JSON.stringify({ allowedTimeControls, minimumMoves })
        );
    };

    useEffect(loadSettings, []);

    return (
        <Layout>
            <div className="container">
                <h1>Settings</h1>
                <p>A few tweaks to change up your guess the elo experience</p>
                {/* <h4>Elo Disparity</h4> */}
                {/* <input
                    type="number"
                    className="elo-disparity"
                    value={minimumMoves}
                    onChange={(e) => {
                        setMinimumMoves(Number.parseInt(e.target.value));
                    }}
                /> */}
                <h4> Minimum Moves</h4>
                <input
                    type="number"
                    className="min-moves"
                    value={minimumMoves}
                    onChange={(e) => {
                        setMinimumMoves(Number.parseInt(e.target.value));
                    }}
                />

                <h4>Manage time controls</h4>
                <ul className="controls-list">
                    {TIME_CONTROLS.map((control) => (
                        <label className="control">
                            <span>{control}</span>
                            <Switch
                                onChange={(checked) => {
                                    if (!checked)
                                        setAllowedTimeControls(
                                            allowedTimeControls.filter(
                                                (item) => item !== control
                                            )
                                        );
                                    else
                                        setAllowedTimeControls([
                                            ...allowedTimeControls,
                                            control,
                                        ]);
                                }}
                                checked={allowedTimeControls.includes(control)}
                            />
                        </label>
                    ))}
                </ul>
                <Button onClick={saveSettings}>Save</Button>
            </div>
        </Layout>
    );
};

export default Settings;
