import { useAuth } from "../../context/AuthContext";
import styles from "./DashboardShell.module.css";

export function DashboardShell() {
  const { logout, user } = useAuth();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Portfolio Dashboard</p>
            <h1 className={styles.title}>Welcome, {user?.name}</h1>
          </div>

          <button className={styles.logout} type="button" onClick={logout}>
            Sign out
          </button>
        </header>

        <section className={styles.card}>
          <p className={styles.muted}>
            Authentication flow is working. Next sprint builds the dashboard data layout.
          </p>
        </section>
      </div>
    </main>
  );
}
