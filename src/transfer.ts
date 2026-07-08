import type { HttpClient } from './client'
import type { Transaction, BankAccount, ApiResponse } from './types'

export interface P2PTransferParams {
  source_wallet: string
  dest_wallet: string
  amount: number
  reference: string
  description?: string
}

export interface BankTransferParams {
  source_wallet: string
  dest_account: BankAccount
  amount: number
  reference: string
  description?: string
}

export class TransferNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Wallet-to-wallet transfer within PayKore. Instant, no NIP fee.
   */
  async p2p(params: P2PTransferParams): Promise<Transaction> {
    const res = await this.http.post<ApiResponse<Transaction>>('/v1/transfers/p2p', params)
    return res.data
  }

  /**
   * Outbound bank transfer via NIP. Returns a `processing` transaction.
   * Listen for `transaction.completed` or `transaction.failed` webhook events.
   */
  async bank(params: BankTransferParams): Promise<Transaction> {
    const res = await this.http.post<ApiResponse<Transaction>>('/v1/transfers/bank', params)
    return res.data
  }
}