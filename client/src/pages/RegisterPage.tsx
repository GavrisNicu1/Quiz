import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useAuth } from "../hooks/useAuth";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: { name: "", email: "", password: "" },
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: RegisterForm) => {
    setError(null);
    try {
      await registerUser(values);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Înregistrare eșuată");
    }
  };

  return (
    <section className="form-card">
      <h2>Creare cont</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Nume complet
          <input type="text" {...register("name", { required: true })} />
        </label>
        <label>
          Email
          <input type="email" {...register("email", { required: true })} />
        </label>
        <label>
          Parolă
          <input type="password" {...register("password", { required: true, minLength: 6 })} />
        </label>
        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Se procesează..." : "Înregistrează-te"}
        </button>
      </form>
      <p>
        Ai deja cont? <Link to="/login">Autentifică-te</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
