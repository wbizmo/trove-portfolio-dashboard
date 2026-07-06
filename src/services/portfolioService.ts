import portfolioData from "../assets/data/portfolio_data.json";
import { transactionsMock } from "../assets/data/transactionsMock";
import type {
  DashboardData,
  ExcludedHolding,
  Holding,
  PortfolioComputedSummary,
  PortfolioData,
  SectorAllocation,
} from "../types/portfolio";

const MOCK_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getPortfolioData(): Promise<PortfolioData> {
  await delay(MOCK_DELAY_MS);
  return portfolioData as PortfolioData;
}

export async function getDashboardData(): Promise<DashboardData> {
  const portfolio = await getPortfolioData();

  const dashboardPortfolio = {
    ...portfolio,
    transactions: transactionsMock,
  };

  return {
    portfolio: dashboardPortfolio,
    computedSummary: getComputedPortfolioSummary(dashboardPortfolio.holdings),
    allocation: getSectorAllocations(dashboardPortfolio.holdings),
    excludedHoldings: getExcludedHoldings(dashboardPortfolio.holdings),
  };
}

export function getHoldingValue(holding: Holding) {
  if (holding.shares <= 0 || holding.currentPrice <= 0) return 0;
  return holding.shares * holding.currentPrice;
}

export function getInvestedValue(holding: Holding) {
  if (holding.shares <= 0) return 0;
  return holding.shares * holding.avgCost;
}

export function getComputedPortfolioSummary(holdings: Holding[]): PortfolioComputedSummary {
  const totalValue = holdings.reduce((sum, holding) => sum + getHoldingValue(holding), 0);
  const totalInvested = holdings.reduce((sum, holding) => sum + getInvestedValue(holding), 0);
  const gainLoss = totalValue - totalInvested;
  const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  return { totalValue, totalInvested, gainLoss, gainLossPercent };
}

export function getExclusionReason(holding: Holding) {
  if (holding.shares <= 0) return "No active shares";
  if (holding.currentPrice === 0) return "Current price is zero";
  if (holding.currentPrice < 0) return "Invalid negative price";
  return "";
}

export function getExcludedHoldings(holdings: Holding[]): ExcludedHolding[] {
  return holdings
    .map((holding) => ({
      id: holding.id,
      ticker: holding.ticker,
      name: holding.name,
      sector: holding.sector,
      reason: getExclusionReason(holding),
    }))
    .filter((holding) => holding.reason);
}

export function getSectorAllocations(holdings: Holding[]): SectorAllocation[] {
  const validHoldings = holdings.filter((holding) => !getExclusionReason(holding));

  const totalValue = validHoldings.reduce(
    (sum, holding) => sum + getHoldingValue(holding),
    0,
  );

  const grouped = validHoldings.reduce<Record<string, SectorAllocation>>((acc, holding) => {
    const current = acc[holding.sector] ?? {
      sector: holding.sector,
      value: 0,
      positions: 0,
      percentage: 0,
    };

    current.value += getHoldingValue(holding);
    current.positions += 1;
    current.percentage = totalValue > 0 ? (current.value / totalValue) * 100 : 0;

    acc[holding.sector] = current;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.value - a.value);
}
