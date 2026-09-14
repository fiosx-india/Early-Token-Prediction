import { randomUUID } from "node:crypto";
import { scorePredictions } from "./prediction.js";
import type { Token } from "./domain.js";
const samples = [["Mango Mutt", "MANGO", "solana", "pump.fun"], ["Flapcat", "FLAPCAT", "bsc", "Flap"], ["Moon Kiosk", "KIOSK", "bsc", "Four.meme"], ["Coconut", "COCO", "solana", "pump.fun"]] as const;
let sequence = 0;
export function demoToken(): Token {
  const [name, symbol, network, launchpad] = samples[sequence++ % samples.length]; const seed = sequence * 7;
  const metrics = { liquidityUsd: 7500 + seed * 820, buysPerSecond: +(1.2 + (seed % 6) * .72).toFixed(1), uniqueBuyers: 7 + seed % 22, volumeUsd: 950 + seed * 310, volumeAcceleration: -8 + seed % 36, holders: 18 + seed * 4, holderGrowth: +(1 + seed % 9).toFixed(1), priceVelocity: -2 + seed % 14, transactionRate: +(2 + seed % 11).toFixed(1) };
  const creatorRisk = 18 + seed % 55; const address = `${network === "solana" ? "So1" : "0x"}${randomUUID().replaceAll("-", "").slice(0, 34)}`;
  return { id: randomUUID(), address, name, symbol, network, launchpad, launchTime: new Date().toISOString(), creator: `wallet…${(seed * 319).toString(16).padStart(4, "0")}`, metrics, predictions: scorePredictions(metrics, creatorRisk), riskLevel: creatorRisk > 55 ? "high" : creatorRisk > 35 ? "medium" : "low", creatorRisk, freshnessMs: 180 + seed % 260, evidence: ["Buyer rate is rising above the launch baseline", "Liquidity was added after first transactions"], conflicts: creatorRisk > 45 ? ["Creator wallet has limited verified history"] : ["Holder distribution is still forming"], risks: ["Very early market; price discovery can reverse quickly", "No profit or performance is guaranteed"] };
}
