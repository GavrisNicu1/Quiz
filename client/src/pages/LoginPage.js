import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
const LoginPage = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { isSubmitting }, } = useForm({
        defaultValues: { email: "", password: "" },
    });
    if (user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    const onSubmit = async (values) => {
        setError(null);
        try {
            await login(values);
            navigate("/");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Autentificare eșuată");
        }
    };
    return (_jsxs("section", { className: "form-card", children: [_jsx("h2", { children: "Autentificare" }), error && _jsx("div", { className: "alert", children: error }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsxs("label", { children: ["Email", _jsx("input", { type: "email", ...register("email", { required: true }) })] }), _jsxs("label", { children: ["Parol\u0103", _jsx("input", { type: "password", ...register("password", { required: true }) })] }), _jsx("button", { className: "primary-btn", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Se autentifică..." : "Intră" })] }), _jsxs("p", { children: ["Nu ai cont? ", _jsx(Link, { to: "/register", children: "Creeaz\u0103 unul" })] })] }));
};
export default LoginPage;
