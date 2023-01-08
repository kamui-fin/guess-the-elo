import React from "react";
import "./index.scss";

interface Props {
    children: React.ReactNode;
    type?: "primary" | "secondary";
    onClick?: () => void;
}

const Button = ({ children, onClick, type = "primary" }: Props) => {
    return (
        <button className={`btn ${type}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
