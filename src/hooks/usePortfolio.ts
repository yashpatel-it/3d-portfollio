import data from "../data/portfolio.json";
import type { PortfolioData } from "../types/portfolio";

export function usePortfolio(): PortfolioData {
  return data as PortfolioData;
}
