import type { HttpClient } from './client';
import type { Wallet, Transaction, CreateWalletParams, ListTransactionsParams, PaginatedResponse } from './types';
export declare class WalletNamespace {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create a wallet. Returns 202 — the wallet starts in `pending` state.
     * `account_number` will be null until provisioning completes.
     * Listen for the `wallet.activated` webhook to know when it's ready.
     */
    create(params: CreateWalletParams): Promise<Wallet>;
    /**
     * Get a wallet by ID, including its current balance.
     */
    get(id: string): Promise<{
        wallet: Wallet;
        balance_kobo: number;
    }>;
    /**
     * List transactions for a wallet with optional cursor pagination.
     */
    listTransactions(walletId: string, params?: ListTransactionsParams): Promise<PaginatedResponse<Transaction>>;
}
