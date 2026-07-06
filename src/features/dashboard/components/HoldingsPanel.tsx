import { useMemo, useState } from "react";

import { getHoldingValue, getInvestedValue } from "../../../services/portfolioService";
import type { Holding } from "../../../types/portfolio";
import { formatCurrency, formatPercent } from "../../../utils/formatters";
import styles from "./HoldingsPanel.module.css";

type HoldingsPanelProps = {
  holdings: Holding[];
};

const ITEMS_PER_PAGE = 5;

function getGainLoss(holding: Holding) {
  const currentValue = getHoldingValue(holding);
  const investedValue = getInvestedValue(holding);
  const amount = currentValue - investedValue;
  const percent = investedValue > 0 ? (amount / investedValue) * 100 : 0;

  return { currentValue, investedValue, amount, percent };
}

function getStatusText(holding: Holding) {
  if (holding.shares <= 0) return "No active shares";
  if (holding.currentPrice === 0) return "Current price is zero";
  if (holding.currentPrice < 0) return "Invalid price";
  return "";
}

export function HoldingsPanel({ holdings }: HoldingsPanelProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [page, setPage] = useState(1);

  const sectors = useMemo(() => {
    return ["All", ...Array.from(new Set(holdings.map((holding) => holding.sector))).sort()];
  }, [holdings]);

  const filteredHoldings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return holdings.filter((holding) => {
      const matchesSearch =
        holding.ticker.toLowerCase().includes(normalizedQuery) ||
        holding.name.toLowerCase().includes(normalizedQuery);

      const matchesSector = sector === "All" || holding.sector === sector;

      return matchesSearch && matchesSector;
    });
  }, [holdings, query, sector]);

  const totalPages = Math.max(1, Math.ceil(filteredHoldings.length / ITEMS_PER_PAGE));
  const paginatedHoldings = filteredHoldings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <article className={styles.panel}>
      <div className={styles.head}>
        <h2>Holdings</h2>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.activeTab}`} type="button">
            Stocks
          </button>
          <button className={styles.tab} type="button">
            Orders
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <label className={styles.search}>
          <input
            type="search"
            placeholder="Search by ticker or company"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          />
        </label>

        <div className={styles.filters}>
          {sectors.map((item) => (
            <button
              key={item}
              className={`${styles.filter} ${item === sector ? styles.activeFilter : ""}`}
              type="button"
              onClick={() => { setSector(item); setPage(1); }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {paginatedHoldings.length > 0 ? (
          paginatedHoldings.map((holding) => {
            const gainLoss = getGainLoss(holding);
            const statusText = getStatusText(holding);
            const isPositive = gainLoss.amount >= 0;

            return (
              <article className={styles.card} key={holding.id}>
                <span className={styles.logo}>{holding.ticker.slice(0, 2)}</span>

                <span className={styles.nameBlock}>
                  <span className={styles.ticker}>{holding.ticker}</span>
                  <span className={styles.company}>{holding.name}</span>
                  <span className={styles.meta}>
                    {holding.shares} shares · {holding.sector}
                  </span>
                </span>

                <span className={styles.valueBlock}>
                  <span className={styles.value}>
                    {statusText ? "Unavailable" : formatCurrency(gainLoss.currentValue)}
                  </span>

                  {statusText ? (
                    <span className={`${styles.gain} ${styles.warning}`}>{statusText}</span>
                  ) : (
                    <span
                      className={`${styles.gain} ${
                        isPositive ? styles.positive : styles.negative
                      }`}
                    >
                      {formatCurrency(gainLoss.amount)} ({formatPercent(gainLoss.percent)})
                    </span>
                  )}
                </span>
              </article>
            );
          })
        ) : (
          <p className={styles.empty}>No holdings match this filter.</p>
        )}
      </div>

      <div className={styles.pagination}>
        <span>
          Page {page} of {totalPages}
        </span>
        <div>
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Prev
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </article>
  );
}
