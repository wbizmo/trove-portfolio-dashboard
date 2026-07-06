import portfolioData from "../assets/data/portfolio_data.json";
import type { PortfolioData } from "../types/portfolio";

const MOCK_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getPortfolioData(): Promise<PortfolioData> {
  await delay(MOCK_DELAY_MS);
  return portfolioData as PortfolioData;
}
