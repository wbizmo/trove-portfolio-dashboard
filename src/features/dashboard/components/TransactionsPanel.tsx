import { useMemo, useState } from "react";

import type { Transaction, TransactionType } from "../../../types/portfolio";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import styles from "./TransactionsPanel.module.css";

type TransactionFilter = "All" | TransactionType;

type TransactionsPanelProps = {
  transactions: Transaction[];
};

const filters: TransactionFilter[] = ["All", "BUY", "SELL"];
const ITEMS_PER_PAGE = 5;

function getStatusClass(status: Transaction["status"]) {
  if (status === "COMPLETED") return styles.completed;
  if (status === "PENDING") return styles.pending;
  return styles.failed;
}

export function TransactionsPanel({ transactions }: TransactionsPanelProps) {
  const [filter, setFilter] = useState<TransactionFilter>("All");
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions.filter((transaction) => transaction.type === filter);
  }, [filter, transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <article className={styles.panel} aria-labelledby="transactions-heading">
      <div className={styles.head}>
        <h2 id="transactions-heading">Recent Transactions</h2>
        <button className={styles.viewAll} type="button">
          View All
        </button>
      </div>

      <div className={styles.filters}>
        {filters.map((item) => (
          <button
            key={item}
            className={`${styles.filter} ${item === filter ? styles.activeFilter : ""}`}
            type="button"
            aria-pressed={item === filter}
            onClick={() => { setFilter(item); setPage(1); }}
          >
            {item === "All" ? "All" : item === "BUY" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((transaction) => (
            <article className={styles.order} key={transaction.id}>
              <span
                className={`${styles.type} ${
                  transaction.type === "BUY" ? styles.buy : styles.sell
                }`}
              >
                {transaction.type === "BUY" ? "B" : "S"}
              </span>

              <span className={styles.asset}>
                <span className={styles.ticker}>{transaction.ticker}</span>
                <span className={styles.name}>{transaction.name}</span>
                <span className={styles.meta}>
                  {transaction.shares} shares · {formatDate(transaction.date)}
                </span>
              </span>

              <span className={styles.amount}>
                <strong>{formatCurrency(transaction.totalAmount)}</strong>
                <span className={`${styles.status} ${getStatusClass(transaction.status)}`}>
                  {transaction.status.toLowerCase()}
                </span>
              </span>
            </article>
          ))
        ) : (
          <p className={styles.empty}>No transactions match this filter.</p>
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
