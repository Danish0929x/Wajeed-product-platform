export interface Product {
  id: string;
  name: string;
  returnRate: number;
  durationMonths: number;
  minInvestment: number;
  maxInvestment: number;
  description: string;
  color: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'starter-yield',
    name: 'Starter Yield',
    returnRate: 125,
    durationMonths: 12,
    minInvestment: 50000,
    maxInvestment: 1000000,
    description: 'Perfect for beginners. Get 125% returns in 12 months.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'silver-boost',
    name: 'Silver Boost',
    returnRate: 125,
    durationMonths: 12,
    minInvestment: 100000,
    maxInvestment: 1000000,
    description: 'Reliable growth with 125% returns over 12 months.',
    color: 'from-slate-400 to-slate-500',
  },
  {
    id: 'gold-accelerator',
    name: 'Gold Accelerator',
    returnRate: 150,
    durationMonths: 18,
    minInvestment: 100000,
    maxInvestment: 1000000,
    description: 'Enhanced returns of 150% over 18 months.',
    color: 'from-yellow-400 to-yellow-500',
  },
  {
    id: 'platinum-surge',
    name: 'Platinum Surge',
    returnRate: 150,
    durationMonths: 18,
    minInvestment: 250000,
    maxInvestment: 1000000,
    description: 'Premium investment with 150% returns in 18 months.',
    color: 'from-gray-300 to-gray-400',
  },
  {
    id: 'diamond-elite',
    name: 'Diamond Elite',
    returnRate: 175,
    durationMonths: 24,
    minInvestment: 250000,
    maxInvestment: 1000000,
    description: 'Exclusive opportunity. 175% returns in 24 months.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'prestige-fund',
    name: 'Prestige Fund',
    returnRate: 175,
    durationMonths: 24,
    minInvestment: 500000,
    maxInvestment: 1000000,
    description: 'Elite tier investment. 175% returns over 24 months.',
    color: 'from-purple-500 to-pink-500',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
