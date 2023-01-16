import { useState } from "react";
import { login } from "@/api";
import Layout from "@/components/Layout";
import ErrorBanner from "@/components/ErrorBanner";
import { useForm } from "react-hook-form";
import { isEmpty } from "utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./index.scss";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (isEmpty(errors)) {
            try {
                await login(data);
                setServerError("");
                navigate("/");
            } catch (error) {
                setServerError(error.response.data.message);
            }
        }
    };

    return (
        <Layout>
            <div className="container">
                <h1 className="">Hello Again!</h1>
                {serverError && <ErrorBanner message={serverError} />}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className=""
                        placeholder="Username or email"
                        {...register("username", { required: true })}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        {...register("password", { required: true })}
                    />
                    <div className="login-actions">
                        <input type="submit" value="Login" />
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
