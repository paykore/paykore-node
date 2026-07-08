import type { HttpClient } from './client';
import type { Transaction, BankAccount } from './types';
export interface P2PTransferParams {
    source_wallet: string;
    dest_wallet: string;
    amount: number;
    reference: string;
    description?: string;
}
export interface BankTransferParams {
    source_wallet: string;
    dest_account: BankAccount;
    amount: number;
    reference: string;
    description?: string;
}
export declare class TransferNamespace {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Wallet-to-wallet transfer within PayKore. Instant, no NIP fee.
     */
    p2p(params: P2PTransferParams): Promise<Transaction>;
    /**
     * Outbound bank transfer via NIP. Returns a `processing` transaction.
     * Listen for `transaction.completed` or `transaction.failed` webhook events.
     */
    bank(params: BankTransferParams): Promise<Transaction>;
}
