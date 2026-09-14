-- PostgreSQL/Timescale-ready schema. Hypertable conversion is deployment-specific.
CREATE TABLE tokens (id uuid PRIMARY KEY, network text NOT NULL, address text NOT NULL, name text, symbol text, created_at timestamptz NOT NULL, UNIQUE(network,address));
CREATE TABLE launches (id uuid PRIMARY KEY, token_id uuid REFERENCES tokens(id), launchpad text NOT NULL, creator_address text NOT NULL, initial_liquidity_usd numeric, launched_at timestamptz NOT NULL);
CREATE TABLE trades (id uuid PRIMARY KEY, token_id uuid REFERENCES tokens(id), tx_hash text NOT NULL, wallet_address text, side text, amount_usd numeric, price numeric, occurred_at timestamptz NOT NULL);
CREATE TABLE transactions (id uuid PRIMARY KEY, token_id uuid REFERENCES tokens(id), tx_hash text NOT NULL, event_type text NOT NULL, occurred_at timestamptz NOT NULL);
CREATE TABLE holders (token_id uuid REFERENCES tokens(id), wallet_address text, balance numeric, observed_at timestamptz NOT NULL, PRIMARY KEY(token_id,wallet_address,observed_at));
CREATE TABLE liquidity_snapshots (token_id uuid REFERENCES tokens(id), value_usd numeric NOT NULL, observed_at timestamptz NOT NULL, PRIMARY KEY(token_id,observed_at));
CREATE TABLE price_snapshots (token_id uuid REFERENCES tokens(id), price numeric NOT NULL, observed_at timestamptz NOT NULL, PRIMARY KEY(token_id,observed_at));
CREATE TABLE feature_snapshots (id uuid PRIMARY KEY, token_id uuid REFERENCES tokens(id), features jsonb NOT NULL, observed_at timestamptz NOT NULL);
CREATE TABLE prediction_results (id uuid PRIMARY KEY, token_id uuid REFERENCES tokens(id), horizon text NOT NULL, probability numeric NOT NULL, confidence numeric NOT NULL, model_version text NOT NULL, predicted_at timestamptz NOT NULL);
CREATE TABLE prediction_outcomes (prediction_id uuid REFERENCES prediction_results(id), breakout boolean, evaluated_at timestamptz, outcome_metrics jsonb, PRIMARY KEY(prediction_id));
CREATE TABLE creator_history (network text, creator_address text, metrics jsonb NOT NULL, observed_at timestamptz NOT NULL, PRIMARY KEY(network,creator_address,observed_at));
CREATE TABLE risk_indicators (id uuid PRIMARY KEY, token_id uuid REFERENCES tokens(id), kind text NOT NULL, severity text NOT NULL, evidence jsonb, observed_at timestamptz NOT NULL);
CREATE TABLE backtest_results (id uuid PRIMARY KEY, model_version text, horizon text, precision numeric, recall numeric, accuracy numeric, calibration numeric, false_positive_rate numeric, false_negative_rate numeric, breakout_detection_rate numeric, created_at timestamptz NOT NULL);
