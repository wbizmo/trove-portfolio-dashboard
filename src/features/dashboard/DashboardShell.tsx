import { useCallback, useEffect, useState } from "react";

import { Sidebar } from "../../components/layout/Sidebar";
import { TopBar } from "../../components/layout/TopBar";
import { getDashboardData } from "../../services/portfolioService";
import type { DashboardData } from "../../types/portfolio";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { HoldingsPanel } from "./components/HoldingsPanel";
import { TransactionsPanel } from "./components/TransactionsPanel";
import styles from "./DashboardShell.module.css";

type StateCardProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

function StateCard({ title, message, actionLabel, onAction }: StateCardProps) {
  return (
    <main className={styles.statePage}>
      <section className={styles.stateCard}>
        <div className={styles.stateLogo}>T</div>
        <h1>{title}</h1>
        <p>{message}</p>
        {actionLabel && onAction ? (
          <button type="button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </section>
    </main>
  );
}

export function DashboardShell() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [showExcluded, setShowExcluded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getDashboardData();
      setDashboard(data);
    } catch {
      setError("Unable to load portfolio data.");
      setDashboard(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      void loadDashboard();
    }, 0);
  }, [loadDashboard]);

  if (isLoading) {
    return (
      <StateCard
        title="Loading portfolio"
        message="Preparing your portfolio dashboard..."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <StateCard
        title="Portfolio unavailable"
        message={error || "The portfolio data could not be prepared."}
        actionLabel="Try again"
        onAction={loadDashboard}
      />
    );
  }

  const { computedSummary, allocation, excludedHoldings } = dashboard;
  const gainClass = computedSummary.gainLoss >= 0 ? styles.positive : styles.negative;

  return (
    <main className={styles.app}>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {menuOpen ? (
        <button
          className={styles.scrim}
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <section className={styles.main}>
        <TopBar onMenuClick={() => setMenuOpen(true)} />

        <div className={styles.content}>
          <section className={styles.topGrid}>
            <article className={styles.netWorthCard}>
              <div className={styles.cardTop}>
                <p>
                  Total Net Worth <span className={styles.infoIcon}>i</span>
                </p>

                <div className={styles.range}>
                  <button className={styles.rangeActive} type="button">1D</button>
                  <button type="button">1W</button>
                  <button type="button">1M</button>
                  <button type="button">ALL</button>
                </div>
              </div>

              <div className={styles.valueRow}>
                <h1>{showBalance ? formatCurrency(computedSummary.totalValue) : "••••••"}</h1>
                <strong className={gainClass}>{formatPercent(computedSummary.gainLossPercent)}</strong>
                <button
                  className={styles.hideButton}
                  type="button"
                  onClick={() => setShowBalance((current) => !current)}
                >
                  {showBalance ? "Hide" : "Show"}
                </button>
              </div>

              <div className={styles.fakeChart} aria-hidden="true">
                <svg viewBox="0 0 520 170" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#059A83" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#059A83" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 120 C80 105 130 130 200 105 C285 72 310 10 390 58 C455 95 468 132 520 28" fill="none" stroke="#059A83" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0 120 C80 105 130 130 200 105 C285 72 310 10 390 58 C455 95 468 132 520 28 L520 170 L0 170 Z" fill="url(#chartFill)" />
                </svg>
              </div>
            </article>

            <article className={styles.allocationCard}>
              <h2>Asset Allocation</h2>

              {allocation.length > 0 ? (
                <>
                  <div className={styles.allocationBar}>
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
                        <b>{item.sector}</b>
                        <strong>{item.percentage.toFixed(1)}%</strong>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className={styles.emptyState}>No valid allocation data is available.</p>
              )}

              {excludedHoldings.length > 0 ? (
                <div className={styles.exclusionBox}>
                  <button type="button" onClick={() => setShowExcluded((current) => !current)}>
                    {excludedHoldings.length} excluded from allocation
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
                <p>{item.sector}</p>
                <strong>{formatCurrency(item.value)}</strong>
                <span>{item.positions} {item.positions === 1 ? "position" : "positions"}</span>
              </article>
            ))}
          </section>

          <section className={styles.lowerGrid}>
            <HoldingsPanel holdings={dashboard.portfolio.holdings} />
            <TransactionsPanel transactions={dashboard.portfolio.transactions} />
          </section>
        </div>
      </section>
    </main>
  );
}
