class o extends Error {
  constructor(t, e, s) {
    super(e), this.code = t, this.status = s, this.name = "PayKoreError";
  }
}
class u {
  constructor(t) {
    var e;
    this.apiKey = t.apiKey, this.baseURL = ((e = t.baseURL) == null ? void 0 : e.replace(/\/$/, "")) ?? "https://api.paykore.com", this.timeout = t.timeout ?? 3e4;
  }
  async request(t, e, s) {
    const i = new AbortController(), h = setTimeout(() => i.abort(), this.timeout);
    let a;
    try {
      a = await fetch(`${this.baseURL}${e}`, {
        method: t,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: s !== void 0 ? JSON.stringify(s) : void 0,
        signal: i.signal
      });
    } catch (n) {
      throw n.name === "AbortError" ? new o("TIMEOUT", "Request timed out", 408) : new o("NETWORK_ERROR", "Network request failed", 0);
    } finally {
      clearTimeout(h);
    }
    if (!a.ok) {
      let n = "API_ERROR", c = `HTTP ${a.status}`;
      try {
        const p = await a.json();
        n = p.error ?? n, c = p.message ?? c;
      } catch {
      }
      throw new o(n, c, a.status);
    }
    return a.json();
  }
  get(t) {
    return this.request("GET", t);
  }
  post(t, e) {
    return this.request("POST", t, e);
  }
  delete(t) {
    return this.request("DELETE", t);
  }
}
class l {
  constructor(t) {
    this.http = t;
  }
  /**
   * Create a wallet. Returns 202 — the wallet starts in `pending` state.
   * `account_number` will be null until provisioning completes.
   * Listen for the `wallet.activated` webhook to know when it's ready.
   */
  async create(t) {
    return (await this.http.post("/v1/wallets", {
      user_ref: t.user_ref,
      currency: t.currency ?? "NGN",
      metadata: t.metadata ?? {}
    })).data;
  }
  /**
   * Get a wallet by ID, including its current balance.
   */
  async get(t) {
    return (await this.http.get(
      `/v1/wallets/${t}`
    )).data;
  }
  /**
   * List transactions for a wallet with optional cursor pagination.
   */
  async listTransactions(t, e = {}) {
    const s = new URLSearchParams();
    e.cursor && s.set("cursor", e.cursor), e.limit && s.set("limit", String(e.limit)), e.status && s.set("status", e.status), e.type && s.set("type", e.type);
    const i = s.toString() ? `?${s.toString()}` : "";
    return this.http.get(
      `/v1/wallets/${t}/transactions${i}`
    );
  }
}
class y {
  constructor(t) {
    this.http = t;
  }
  /**
   * Wallet-to-wallet transfer within PayKore. Instant, no NIP fee.
   */
  async p2p(t) {
    return (await this.http.post("/v1/transfers/p2p", t)).data;
  }
  /**
   * Outbound bank transfer via NIP. Returns a `processing` transaction.
   * Listen for `transaction.completed` or `transaction.failed` webhook events.
   */
  async bank(t) {
    return (await this.http.post("/v1/transfers/bank", t)).data;
  }
}
class w {
  constructor(t) {
    this.http = t;
  }
  /**
   * Create a QR payment intent. The returned `qr_code` is a base64 image
   * or payload string to render as a QR code for the customer to scan.
   */
  async createQRIntent(t) {
    return (await this.http.post("/v1/payments/qr/create", {
      wallet_id: t.wallet_id,
      amount: t.amount,
      reference: t.reference,
      description: t.description,
      expires_in_seconds: t.expires_in_seconds ?? 300
    })).data;
  }
  /**
   * Pay a QR intent from a source wallet.
   * Returns the completed transaction.
   */
  async payQRIntent(t) {
    return (await this.http.post("/v1/payments/qr/pay", {
      qr_reference: t.qr_reference,
      source_wallet: t.source_wallet
    })).data;
  }
}
class m {
  constructor(t) {
    this.http = t;
  }
  async getStatus() {
    return (await this.http.get(
      "/v1/partner/compliance/status"
    )).data;
  }
  async submitBusiness(t) {
    await this.http.post("/v1/partner/compliance/business", t);
  }
  async submitDirectors(t) {
    await this.http.post("/v1/partner/compliance/directors", t);
  }
  async acceptAgreements(t) {
    await this.http.post("/v1/partner/compliance/agreements", t);
  }
  async submitUseCase(t) {
    await this.http.post("/v1/partner/compliance/use-case", { description: t });
  }
}
class d {
  constructor(t) {
    const e = new u(t);
    this.wallets = new l(e), this.transfers = new y(e), this.payments = new w(e), this.compliance = new m(e);
  }
}
export {
  d as PayKore,
  o as PayKoreError
};
