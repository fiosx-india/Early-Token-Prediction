# Early Token Prediction

An analysis-only, real-time research terminal for newly launched meme tokens. It focuses on the **1-second to 10-minute** discovery window while retaining prediction horizons through 24 hours. It does not trade, purchase tokens, promise returns, or fabricate production chain data.

## Architecture and data flow

```text
Helius / Bitquery streams → common ProviderAdapter → launchpad event normalizer
→ feature snapshots → horizon-specific prediction engine + risk indicators
→ PostgreSQL time series / outcomes → REST + WebSocket → React dashboard / alerts
```

* `server/adapters.ts` defines the common network-provider contract. `HeliusAdapter` is the Solana/pump.fun integration point; `BitqueryAdapter` is the BSC/Four.meme/Flap integration point. Add a new chain or launchpad by adding an adapter/normalizer—not a second application.
* In production, Helius should subscribe server-side to the relevant pump.fun program/instruction stream and Bitquery should use its streaming GraphQL subscription for the configured Four.meme and Flap contracts. Each emits the same normalized launch event, then trade, liquidity, holder and wallet events enrich that launch.
* The browser only receives normalized token intelligence. Provider secrets are read only by the server from environment variables and are never bundled by Vite.
* Events retain event, ingestion, processing and prediction timestamps. The WebSocket feed provides low-latency launch updates; polling is not the primary stream path.

## Directory structure

```text
src/                  React real-time dashboard
server/domain.ts      Shared token, metric, prediction and health contracts
server/adapters.ts    Provider adapter interface plus Helius / Bitquery stubs
server/prediction.ts  Interpretable, horizon-specific baseline scorer
server/demo.ts        Clearly labelled synthetic demo events
db/schema.sql         High-frequency, backtesting-ready PostgreSQL schema
```

## Prediction pipeline

The feature layer is designed to calculate buys and transactions per second, unique buyers, buy-volume and transaction acceleration, price velocity/acceleration, liquidity change, holder growth, wallet quality/concentration, creator history, coordinated-wallet and wash-trade risk, and launch momentum. The MVP scorer consumes available early activity, liquidity, holder growth, price velocity and creator-risk inputs.

Each requested horizon (`1s` through `24h`) has a separate sensitivity profile: short horizons weight rapid activity and momentum more, while longer horizons increase liquidity, holder and durability weight. Values are model outputs—not hard-coded predictions—and should be calibrated against `prediction_outcomes` after historical ingestion. Supporting/conflicting evidence, confidence, freshness, risk level and assumptions are returned with the score.

`db/schema.sql` stores raw launches/trades/transactions/holders, time-series price and liquidity, feature snapshots, predictions and eventual outcomes. `backtest_results` records precision, recall, accuracy, calibration, false-positive/negative rates and breakout detection rate by horizon.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome. Default `DATA_MODE=demo` generates visibly labelled demo events so the UI is usable without credentials. The live adapter methods deliberately reject missing credentials instead of silently inventing chain data.

### Credentials and production mode

Place secrets only in `.env` (already ignored):

```bash
HELIUS_API_KEY=...
BITQUERY_ACCESS_TOKEN=...
DATA_MODE=live
```

Never use a `VITE_` prefix for either secret. Configure contract IDs, streaming subscription implementation, reconnect/backoff and structured stream-health logging in the server adapters before enabling live ingestion.

### Binance link

Each selected token has **Open in Binance ↗**, which opens an external Binance Web3 URL in a separate tab and passes the selected token address/network. It does not connect a wallet or place an order. The server-side/default URL shape is documented in `.env.example` as `BINANCE_TOKEN_URL_TEMPLATE`; set it to the approved Binance route for your deployment. The dashboard remains analysis-only.

## Checks

```bash
npm test
npm run build
```
