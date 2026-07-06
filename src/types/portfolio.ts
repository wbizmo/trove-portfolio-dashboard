export type Currency = "USD";

export type TransactionType = "BUY" | "SELL";

export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface PortfolioUser {
  name: string;
  accountId: string;
  lastUpdated: string;
}

export interface PortfolioSummary {
  totalPortfolioValue: number;
  totalInvested: number;
  currency: Currency;
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: Currency;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  ticker: string;
  name: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  date: string;
  status: TransactionStatus;
}

export interface PortfolioData {
  user: PortfolioUser;
  summary: PortfolioSummary;
  holdings: Holding[];
  transactions: Transaction[];
}

export interface PortfolioComputedSummary {
  totalValue: number;
  totalInvested: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  positions: number;
  percentage: number;
}

export interface ExcludedHolding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  reason: string;
}

export interface DashboardData {
  portfolio: PortfolioData;
  computedSummary: PortfolioComputedSummary;
  allocation: SectorAllocation[];
  excludedHoldings: ExcludedHolding[];
}
