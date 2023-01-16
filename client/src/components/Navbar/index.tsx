import { ReactComponent as Logo } from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import Button from "../Button";
import "./index.scss";

const Navbar = () => {
    return (
        <div className="navbar">
            <nav>
                <ul className="nav-items">
                    <Link to="/">
                        <div className="logo">
                            <Logo />
                            <h1 className="logo-text">Guess The Elo</h1>
                        </div>
                    </Link>
                    {/* <li className="page-link">
                        <Link to="/solo">Play Solo</Link>
                    </li> */}
                    {/* <li className="page-link">
                        <Link to="/settings">Settings</Link>
                    </li> */}
                </ul>
                <ul className="nav-items">
                    <li className="page-link">
                        <Link to="/settings">Settings</Link>
                    </li>
                    {/* <li>
                        <Link to="/login">Sign In</Link>
                    </li>
                    <li>
                        <Link to="/register">
                            <Button>Register</Button>
                        </Link>
                    </li> */}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
