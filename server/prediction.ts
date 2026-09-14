import { HORIZONS, type Horizon, type Metrics, type Prediction } from "./domain.js";

// Interpretable baseline only: replace calibration/weights after historical outcome training.
const horizonSensitivity: Record<Horizon, [number, number, number]> = {
  "1s": [1.45, .5, .25], "5s": [1.4, .55, .3], "10s": [1.3, .6, .35], "30s": [1.2, .65, .4], "1m": [1.1, .7, .45], "5m": [1, .8, .55], "10m": [.9, .85, .6], "15m": [.75, .9, .72], "30m": [.7, .95, .8], "1h": [.62, 1, .9], "4h": [.52, 1.02, 1], "12h": [.45, 1.04, 1.08], "24h": [.4, 1.05, 1.15]
};
const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));
export function scorePredictions(metrics: Metrics, creatorRisk: number): Record<Horizon, Prediction> {
  return Object.fromEntries(HORIZONS.map(horizon => {
    const [activity, durability, risk] = horizonSensitivity[horizon];
    const signal = activity * (metrics.buysPerSecond / 3 + metrics.transactionRate / 6 + metrics.priceVelocity / 8)
      + durability * (metrics.uniqueBuyers / 12 + metrics.holderGrowth / 20 + metrics.liquidityUsd / 60_000)
      - risk * (creatorRisk / 28);
    const confidence = Math.min(92, 32 + metrics.transactionRate * 4 + metrics.uniqueBuyers * 1.4);
    return [horizon, { probability: Math.round(sigmoid(signal - 2.3) * 100), confidence: Math.round(confidence) }];
  })) as Record<Horizon, Prediction>;
}
