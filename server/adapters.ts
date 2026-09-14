import type { Network, ProviderHealth } from "./domain.js";

export type RawLaunchEvent = { address: string; name: string; symbol: string; creator: string; occurredAt: string; launchpad: string };
export interface ProviderAdapter { readonly network: Network; health(): ProviderHealth; connect(onLaunch: (event: RawLaunchEvent) => void): Promise<void>; disconnect(): Promise<void>; }

abstract class CredentialedAdapter implements ProviderAdapter {
  abstract readonly network: Network; protected connected = false;
  constructor(private readonly name: string, protected readonly credential?: string) {}
  health(): ProviderHealth { return { name: this.name, state: this.connected ? "connected" : "disconnected", stream: this.connected ? "healthy" : "unhealthy" }; }
  async disconnect() { this.connected = false; }
  abstract connect(onLaunch: (event: RawLaunchEvent) => void): Promise<void>;
}

/** Helius websocket/webhook subscription point for pump.fun program events. Credentials never leave this process. */
export class HeliusAdapter extends CredentialedAdapter {
  readonly network = "solana" as const;
  constructor(key = process.env.HELIUS_API_KEY) { super("Helius", key); }
  async connect(_onLaunch: (event: RawLaunchEvent) => void) { if (!this.credential) throw new Error("HELIUS_API_KEY is required for live mode"); this.connected = true; /* subscribe to Helius server-side stream here */ }
}
/** Bitquery streaming subscription point for BSC Four.meme and Flap contract events. */
export class BitqueryAdapter extends CredentialedAdapter {
  readonly network = "bsc" as const;
  constructor(token = process.env.BITQUERY_ACCESS_TOKEN) { super("Bitquery", token); }
  async connect(_onLaunch: (event: RawLaunchEvent) => void) { if (!this.credential) throw new Error("BITQUERY_ACCESS_TOKEN is required for live mode"); this.connected = true; /* subscribe to Bitquery GraphQL stream here */ }
}
