export const HORIZONS = ["1s", "5s", "10s", "30s", "1m", "5m", "10m", "15m", "30m", "1h", "4h", "12h", "24h"] as const;
export type Horizon = typeof HORIZONS[number];
export type Network = "solana" | "bsc";
export type RiskLevel = "low" | "medium" | "high";
export interface Metrics { liquidityUsd: number; buysPerSecond: number; uniqueBuyers: number; volumeUsd: number; volumeAcceleration: number; holders: number; holderGrowth: number; priceVelocity: number; transactionRate: number; }
export interface Prediction { probability: number; confidence: number; }
export interface Token { id: string; address: string; name: string; symbol: string; network: Network; launchpad: "pump.fun" | "Four.meme" | "Flap"; launchTime: string; creator: string; metrics: Metrics; predictions: Record<Horizon, Prediction>; riskLevel: RiskLevel; creatorRisk: number; freshnessMs: number; evidence: string[]; conflicts: string[]; risks: string[]; }
export interface ProviderHealth { name: string; state: "connected" | "disconnected" | "demo"; latencyMs?: number; stream: "healthy" | "unhealthy"; }
