import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";
import {
  getComputedPortfolioSummary,
  getPortfolioData,
} from "../../services/portfolioService";
import type { PortfolioData } from "../../types/portfolio";
import { formatCurrency, formatDate, formatPercent } from "../../utils/formatters";
import styles from "./DashboardShell.module.css";

export function DashboardShell() {
  const { logout } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolio() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getPortfolioData();

        if (isMounted) {
          setPortfolio(data);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load portfolio data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.stateCard}>Loading portfolio...</section>
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className={styles.page}>
        <section className={styles.stateCard}>{error || "Portfolio unavailable."}</section>
      </main>
    );
  }

  const summary = getComputedPortfolioSummary(portfolio.holdings);
  const isPositive = summary.gainLoss >= 0;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Portfolio Dashboard</p>
            <h1 className={styles.title}>{portfolio.user.name}</h1>
            <p className={styles.meta}>
              {portfolio.user.accountId} · Updated {formatDate(portfolio.user.lastUpdated)}
            </p>
          </div>

          <button className={styles.logout} type="button" onClick={logout}>
            Sign out
          </button>
        </header>

        <section className={styles.grid}>
          <article className={styles.netWorthCard}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.label}>Net worth</p>
                <h2 className={styles.netWorth}>
                  {showBalance ? formatCurrency(summary.totalValue) : "••••••"}
                </h2>
              </div>

              <button
                className={styles.balanceToggle}
                type="button"
                onClick={() => setShowBalance((current) => !current)}
              >
                {showBalance ? "Hide" : "Show"}
              </button>
            </div>

            <p className={isPositive ? styles.positive : styles.negative}>
              {formatCurrency(summary.gainLoss)} ({formatPercent(summary.gainLossPercent)})
            </p>

            <p className={styles.muted}>
              Computed from active holdings. Missing prices and zero-share positions are
              handled intentionally.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Total invested</p>
            <strong className={styles.metric}>
              {formatCurrency(summary.totalInvested)}
            </strong>
            <p className={styles.muted}>
              Based on average cost and active share count.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Holdings</p>
            <strong className={styles.metric}>{portfolio.holdings.length}</strong>
            <p className={styles.muted}>
              Includes positions with data quirks for review.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Recent orders</p>
            <strong className={styles.metric}>{portfolio.transactions.length}</strong>
            <p className={styles.muted}>
              Completed, pending, and failed statuses are represented.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
