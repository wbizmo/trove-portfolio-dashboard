import { useState } from "react";

import { useAuth } from "../../context/useAuth";
import styles from "./LoginPage.module.css";

const DEMO_EMAIL = "demo@trove.com";
const DEMO_PASSWORD = "trove123";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors: LoginErrors = {};
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(cleanEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (
      cleanEmail &&
      password &&
      (cleanEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD)
    ) {
      nextErrors.form = "Use the demo credentials provided below.";
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
        <div className={styles.logo}>T</div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>Email address</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              placeholder="name@company.com"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <span className={styles.passwordWrap}>
              <input
                className={styles.passwordInput}
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                className={styles.eyeButton}
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                ◉
              </button>
            </span>
            {errors.password ? (
              <span className={styles.error}>{errors.password}</span>
            ) : null}
          </label>

          {errors.form ? <p className={styles.error}>{errors.form}</p> : null}

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className={styles.divider}>
          <span />
          <button className={styles.forgotButton} type="button">
            Forgot password?
          </button>
          <span />
        </div>

        <p className={styles.accountText}>Don&apos;t have an account?</p>

        <button className={styles.secondaryButton} type="button">
          Create a Trove account
        </button>

        <p className={styles.demo}>
          Demo: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
        </p>
      </section>
    </main>
  );
}
