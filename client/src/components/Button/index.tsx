import "./index.scss";

const Button = ({ children, onClick }) => {
    return (
        <button className="btn" onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
