import "./index.scss";

const Button = ({ children, onClick, type = "primary" }) => {
    return (
        <button className={`btn ${type}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
