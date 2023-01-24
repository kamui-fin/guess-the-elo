import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Settings from "./pages/settings";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    );
};

export default App;
