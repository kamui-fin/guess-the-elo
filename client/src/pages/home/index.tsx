import Navbar from "../../components/Navbar";
import Chessground from "react-chessground"
import 'react-chessground/dist/styles/chessground.css'

const Home = () => {
    return (
        <main>
            <Navbar />
            <Chessground />
        </main>
    );
};

export default Home;
