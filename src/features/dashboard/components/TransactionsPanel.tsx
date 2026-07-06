import { useMemo, useState } from "react";

import type { Transaction, TransactionType } from "../../../types/portfolio";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import styles from "./TransactionsPanel.module.css";

type TransactionFilter = "All" | TransactionType;

type TransactionsPanelProps = {
  transactions: Transaction[];
};

const filters: TransactionFilter[] = ["All", "BUY", "SELL"];

function getStatusClass(status: Transaction["status"]) {
  if (status === "COMPLETED") return styles.completed;
  if (status === "PENDING") return styles.pending;
  return styles.failed;
}

export function TransactionsPanel({ transactions }: TransactionsPanelProps) {
  const [filter, setFilter] = useState<TransactionFilter>("All");

  const filteredTransactions = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions.filter((transaction) => transaction.type === filter);
  }, [filter, transactions]);

  return (
    <article className={styles.panel}>
      <div className={styles.head}>
        <h2>Recent Transactions</h2>
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
            onClick={() => setFilter(item)}
          >
            {item === "All" ? "All" : item === "BUY" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
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
    </article>
  );
}
