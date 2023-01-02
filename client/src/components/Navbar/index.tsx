import { ReactComponent as Logo } from "../../assets/logo.svg";
import { Link } from "react-router-dom"
import Button from "../Button";
import "./index.scss";

const Navbar = () => {
    return (
        <nav>
            <div className="logo">
                <Logo />
                <h1 className="logo-text">Guess The Elo</h1>
            </div>
            <ul className="nav-items">
                <li>
                    <Link to="/login">Sign In</Link>
                </li>
                <li>
                    <Button>
                        <Link to="/register">Register</Link>
                    </Button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
