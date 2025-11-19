import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useAuth } from "../hooks/useAuth";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: LoginForm) => {
    setError(null);
    try {
      await login(values);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Autentificare eșuată");
    }
  };

  return (
    <section className="form-card">
      <h2>Autentificare</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email
          <input type="email" {...register("email", { required: true })} />
        </label>
        <label>
          Parolă
          <input type="password" {...register("password", { required: true })} />
        </label>
        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Se autentifică..." : "Intră"}
        </button>
      </form>
      <p>
        Nu ai cont? <Link to="/register">Creează unul</Link>
      </p>
    </section>
  );
};

export default LoginPage;
