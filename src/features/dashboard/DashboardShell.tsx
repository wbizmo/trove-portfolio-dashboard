import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";
import { getComputedPortfolioSummary, getPortfolioData } from "../../services/portfolioService";
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
        if (isMounted) setPortfolio(data);
      } catch {
        if (isMounted) setError("Unable to load portfolio data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <main className={styles.statePage}>Loading portfolio...</main>;
  }

  if (error || !portfolio) {
    return <main className={styles.statePage}>{error || "Portfolio unavailable."}</main>;
  }

  const summary = getComputedPortfolioSummary(portfolio.holdings);
  const isPositive = summary.gainLoss >= 0;

  return (
    <main className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>T</div>
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
            <p className={styles.greeting}>Hello, {portfolio.user.name}</p>
            <h1>Portfolio Overview</h1>
            <p className={styles.meta}>
              {portfolio.user.accountId} · Updated {formatDate(portfolio.user.lastUpdated)}
            </p>
          </div>

          <div className={styles.actions}>
            <label className={styles.search}>
              <span>Search</span>
              <input placeholder="Search assets..." />
            </label>
            <button type="button" onClick={logout}>Sign out</button>
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
            <h2>{showBalance ? formatCurrency(summary.totalValue) : "••••••"}</h2>
            <strong className={isPositive ? styles.good : styles.bad}>
              {formatCurrency(summary.gainLoss)} ({formatPercent(summary.gainLossPercent)})
            </strong>
            <p className={styles.note}>Computed from holdings through the portfolio service.</p>
          </article>

          <article className={styles.allocationCard}>
            <div className={styles.cardTop}>
              <p>Allocation</p>
              <span>By sector</span>
            </div>
            <div className={styles.barSkeleton}>
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.legend}>
              <span>Technology</span>
              <span>Finance</span>
              <span>Healthcare</span>
              <span>Automotive</span>
            </div>
          </article>
        </section>

        <section className={styles.accountGrid}>
          <article><span>Total Invested</span><strong>{formatCurrency(summary.totalInvested)}</strong></article>
          <article><span>Holdings</span><strong>{portfolio.holdings.length}</strong></article>
          <article><span>Orders</span><strong>{portfolio.transactions.length}</strong></article>
          <article><span>Currency</span><strong>{portfolio.summary.currency}</strong></article>
        </section>

        <section className={styles.lowerGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Holdings</h2>
              <span>Stocks tab coming next</span>
            </div>
            <p className={styles.empty}>Card-style stock holdings will be implemented in the next sprint.</p>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Recent transactions</h2>
              <span>Orders tab coming next</span>
            </div>
            <p className={styles.empty}>Recent buy/sell orders will be implemented after holdings.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
