import { VscError } from "react-icons/vsc";
import { useState } from "react";

import "./index.scss";

const ErrorBanner = ({ message }) => {
    const [closed, setClosed] = useState(false);

    return (
        <div className="banner">
            <VscError className="error-icon" />
            <div className="error">
                <h2 className="">Error</h2>
                <p className="">{message}</p>
            </div>
        </div>
    );
};

export default ErrorBanner;
