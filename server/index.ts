import "dotenv/config";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { HeliusAdapter, BitqueryAdapter } from "./adapters.js";
import { demoToken } from "./demo.js";
import type { ProviderHealth, Token } from "./domain.js";

const app = express(); app.use(cors()); app.use(express.json());
const demo = process.env.DATA_MODE !== "live"; const tokens: Token[] = Array.from({ length: 6 }, demoToken);
const providers = demo ? [{ name: "Helius", state: "demo", stream: "healthy" }, { name: "Bitquery", state: "demo", stream: "healthy" }] satisfies ProviderHealth[] : [new HeliusAdapter().health(), new BitqueryAdapter().health()];
app.get("/api/tokens", (_req, res) => res.json({ mode: demo ? "demo" : "live", tokens }));
app.get("/api/tokens/:id", (req, res) => { const token = tokens.find(t => t.id === req.params.id); token ? res.json(token) : res.status(404).json({ error: "Token not found" }); });
app.get("/api/health", (_req, res) => res.json({ providers, mode: demo ? "demo" : "live", serverTime: new Date().toISOString(), binanceTokenUrlTemplate: process.env.BINANCE_TOKEN_URL_TEMPLATE ?? "https://www.binance.com/en/web3?token={token}&network={network}" }));
const server = app.listen(Number(process.env.PORT ?? 8787), () => console.log(JSON.stringify({ level: "info", event: "api_started", port: process.env.PORT ?? 8787, mode: demo ? "demo" : "live" })));
const wss = new WebSocketServer({ server, path: "/ws" });
const broadcast = (message: object) => wss.clients.forEach(client => { if (client.readyState === 1) client.send(JSON.stringify(message)); });
if (demo) setInterval(() => { const token = demoToken(); tokens.unshift(token); tokens.splice(20); broadcast({ type: "token.detected", token, timestamps: { event: token.launchTime, ingested: new Date().toISOString(), processed: new Date().toISOString(), predicted: new Date().toISOString() } }); }, 5000);
