import { useEffect, useState } from "react";

import { getPortfolioData } from "./services/portfolioService";
import type { PortfolioData } from "./types/portfolio";

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    getPortfolioData().then(setPortfolio);
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <p style={{ color: "var(--primary)", fontWeight: 700 }}>
        Trove Portfolio Dashboard
      </p>

      <h1>Sprint 1 foundation complete.</h1>

      <p>
        {portfolio
          ? `Loaded ${portfolio.holdings.length} holdings and ${portfolio.transactions.length} transactions for ${portfolio.user.name}.`
          : "Loading portfolio data through service layer..."}
      </p>
    </main>
  );
}
