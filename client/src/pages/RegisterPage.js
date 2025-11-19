import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
const RegisterPage = () => {
    const { register: registerUser, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { isSubmitting }, } = useForm({
        defaultValues: { name: "", email: "", password: "" },
    });
    if (user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    const onSubmit = async (values) => {
        setError(null);
        try {
            await registerUser(values);
            navigate("/");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Înregistrare eșuată");
        }
    };
    return (_jsxs("section", { className: "form-card", children: [_jsx("h2", { children: "Creare cont" }), error && _jsx("div", { className: "alert", children: error }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsxs("label", { children: ["Nume complet", _jsx("input", { type: "text", ...register("name", { required: true }) })] }), _jsxs("label", { children: ["Email", _jsx("input", { type: "email", ...register("email", { required: true }) })] }), _jsxs("label", { children: ["Parol\u0103", _jsx("input", { type: "password", ...register("password", { required: true, minLength: 6 }) })] }), _jsx("button", { className: "primary-btn", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Se procesează..." : "Înregistrează-te" })] }), _jsxs("p", { children: ["Ai deja cont? ", _jsx(Link, { to: "/login", children: "Autentific\u0103-te" })] })] }));
};
export default RegisterPage;
