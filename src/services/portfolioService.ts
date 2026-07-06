import portfolioData from "../assets/data/portfolio_data.json";
import type { Holding, PortfolioData } from "../types/portfolio";

const MOCK_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getPortfolioData(): Promise<PortfolioData> {
  await delay(MOCK_DELAY_MS);
  return portfolioData as PortfolioData;
}

export function getHoldingValue(holding: Holding) {
  if (holding.shares <= 0 || holding.currentPrice <= 0) return 0;
  return holding.shares * holding.currentPrice;
}

export function getInvestedValue(holding: Holding) {
  if (holding.shares <= 0) return 0;
  return holding.shares * holding.avgCost;
}

export function getComputedPortfolioSummary(holdings: Holding[]) {
  const totalValue = holdings.reduce((sum, holding) => sum + getHoldingValue(holding), 0);
  const totalInvested = holdings.reduce((sum, holding) => sum + getInvestedValue(holding), 0);
  const gainLoss = totalValue - totalInvested;
  const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  return { totalValue, totalInvested, gainLoss, gainLossPercent };
}
