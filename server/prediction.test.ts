import test from "node:test";
import assert from "node:assert/strict";
import { scorePredictions } from "./prediction.js";
const quiet = { liquidityUsd: 3000, buysPerSecond: .2, uniqueBuyers: 1, volumeUsd: 40, volumeAcceleration: 0, holders: 3, holderGrowth: 0, priceVelocity: -1, transactionRate: .3 };
const active = { ...quiet, liquidityUsd: 22000, buysPerSecond: 7, uniqueBuyers: 32, holderGrowth: 8, priceVelocity: 5, transactionRate: 11 };
test("high early activity scores above quiet activity", () => assert.ok(scorePredictions(active, 10)["1m"].probability > scorePredictions(quiet, 75)["1m"].probability));
test("horizons are independently scored", () => assert.notEqual(scorePredictions(active, 10)["1s"].probability, scorePredictions(active, 10)["24h"].probability));
