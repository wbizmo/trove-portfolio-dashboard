import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";
import { getDashboardData } from "../../services/portfolioService";
import type { DashboardData } from "../../types/portfolio";
import { formatCurrency, formatDate, formatPercent } from "../../utils/formatters";
import styles from "./DashboardShell.module.css";

export function DashboardShell() {
  const { logout } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [showExcluded, setShowExcluded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getDashboardData();

        if (isMounted) setDashboard(data);
      } catch {
        if (isMounted) setError("Unable to load portfolio data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <main className={styles.statePage}>Loading portfolio...</main>;

  if (error || !dashboard) {
    return <main className={styles.statePage}>{error || "Portfolio unavailable."}</main>;
  }

  const { portfolio, computedSummary, allocation, excludedHoldings } = dashboard;
  const isPositive = computedSummary.gainLoss >= 0;

  return (
    <main className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>T</div>
          <strong>Trove</strong>
        </div>

        <nav className={styles.nav}>
          <span className={styles.navActive}>Dashboard</span>
          <span>Portfolio</span>
          <span>Orders</span>
          <span>Settings</span>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.greeting}>Welcome back</p>
            <h1>Dashboard</h1>
            <p className={styles.meta}>
              {portfolio.user.name} · {portfolio.user.accountId} · Updated{" "}
              {formatDate(portfolio.user.lastUpdated)}
            </p>
          </div>

          <div className={styles.actions}>
            <label className={styles.search}>
              <span>Search</span>
              <input placeholder="Search" />
            </label>

            <button type="button" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>

        <section className={styles.heroGrid}>
          <article className={styles.netCard}>
            <div className={styles.cardTop}>
              <p>Net worth</p>
              <button type="button" onClick={() => setShowBalance((current) => !current)}>
                {showBalance ? "Hide" : "Show"}
              </button>
            </div>

            <h2>{showBalance ? formatCurrency(computedSummary.totalValue) : "••••••"}</h2>

            <strong className={isPositive ? styles.good : styles.bad}>
              {formatCurrency(computedSummary.gainLoss)}{" "}
              ({formatPercent(computedSummary.gainLossPercent)})
            </strong>

            <p className={styles.note}>Total portfolio value computed from holdings.</p>
          </article>

          <article className={styles.allocationCard}>
            <div className={styles.cardTop}>
              <p>Allocation</p>
              <span>By sector</span>
            </div>

            <div className={styles.allocationBar} aria-label="Portfolio allocation by sector">
              {allocation.map((item, index) => (
                <span
                  key={item.sector}
                  className={styles[`segment${index + 1}`]}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.sector}: ${item.percentage.toFixed(1)}%`}
                />
              ))}
            </div>

            <div className={styles.legend}>
              {allocation.map((item, index) => (
                <span key={item.sector}>
                  <i className={styles[`dot${index + 1}`]} />
                  {item.sector} {item.percentage.toFixed(1)}%
                </span>
              ))}
            </div>

            {excludedHoldings.length > 0 ? (
              <div className={styles.exclusionBox}>
                <button
                  type="button"
                  onClick={() => setShowExcluded((current) => !current)}
                >
                  {excludedHoldings.length} excluded from allocation{" "}
                  <span>{showExcluded ? "Hide" : "View"}</span>
                </button>

                {showExcluded ? (
                  <ul>
                    {excludedHoldings.map((holding) => (
                      <li key={holding.id}>
                        <strong>{holding.ticker}</strong>
                        <span>{holding.reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </article>
        </section>

        <section className={styles.accountGrid}>
          {allocation.map((item) => (
            <article key={item.sector}>
              <span>{item.sector}</span>
              <strong>{formatCurrency(item.value)}</strong>
              <small>
                {item.positions} {item.positions === 1 ? "position" : "positions"}
              </small>
            </article>
          ))}
        </section>

        <section className={styles.lowerGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Holdings</h2>
              <span>Stocks</span>
            </div>
            <p className={styles.empty}>
              Card-style stock holdings with search and sector filters come next.
            </p>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Recent transactions</h2>
              <span>Orders</span>
            </div>
            <p className={styles.empty}>
              Recent orders with Buy/Sell filters and status badges come next.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
