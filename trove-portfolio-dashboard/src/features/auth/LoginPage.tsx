import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import styles from "./LoginPage.module.css";

type LoginErrors = {
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => window.setTimeout(resolve, 700));

    login(email.trim());
    setIsSubmitting(false);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-label="Sign in">
        <p className={styles.brand}>Trove</p>

        <h1 className={styles.title}>Welcome back</h1>

        <p className={styles.subtitle}>
          Sign in to view your investment portfolio dashboard.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>Email address</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              placeholder="adaeze@example.com"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              placeholder="Enter password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? (
              <span className={styles.error}>{errors.password}</span>
            ) : null}
          </label>

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.hint}>
          Demo only. Any valid email and a password of 6+ characters will sign in.
        </p>
      </section>
    </main>
  );
}
