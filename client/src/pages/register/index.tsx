import { useState } from "react";
import { register as registerUser } from "@/api";
import Layout from "components/Layout";
import ErrorBanner from "components/ErrorBanner";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isEmpty } from "utils";

import "./index.scss";

const Register = () => {
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
                const temp = data;
                delete temp.confirmPassword;
                if (!data.email) {
                    delete temp.email;
                }
                await registerUser(data);
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
                <h1>Let's get started</h1>
                {serverError && <ErrorBanner message={serverError} />}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        placeholder="Username"
                        {...register("username", { required: true })}
                    />
                    <input
                        placeholder="Email (optional)"
                        type="email"
                        {...register("email")}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        {...register("password", { required: true })}
                    />
                    <input
                        placeholder="Confirm password"
                        type="password"
                        {...register("confirmPassword", { required: true })}
                    />
                    <div className="register-actions">
                        <input type="submit" value="Submit" />
                        <p>
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
