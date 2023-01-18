import { Routes, Route } from "react-router-dom";
import Solo from "./pages/solo";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Settings from "./pages/settings";

const App = () => {
    return (
        <>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/" element={<Solo />} />
                <Route path="/settings" element={<Settings />} />
                {/* <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> */}
            </Routes>
        </>
    );
};

export default App;
