import type { HttpClient } from './client'
import type {
  Wallet,
  Transaction,
  CreateWalletParams,
  ListTransactionsParams,
  ApiResponse,
  PaginatedResponse,
} from './types'

export class WalletNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a wallet. Returns 202 — the wallet starts in `pending` state.
   * `account_number` will be null until provisioning completes.
   * Listen for the `wallet.activated` webhook to know when it's ready.
   */
  async create(params: CreateWalletParams): Promise<Wallet> {
    const res = await this.http.post<ApiResponse<Wallet>>('/v1/wallets', {
      user_ref: params.user_ref,
      currency: params.currency ?? 'NGN',
      metadata: params.metadata ?? {},
    })
    return res.data
  }

  /**
   * Get a wallet by ID, including its current balance.
   */
  async get(id: string): Promise<{ wallet: Wallet; balance_kobo: number }> {
    const res = await this.http.get<ApiResponse<{ wallet: Wallet; balance_kobo: number }>>(
      `/v1/wallets/${id}`
    )
    return res.data
  }

  /**
   * List transactions for a wallet with optional cursor pagination.
   */
  async listTransactions(
    walletId: string,
    params: ListTransactionsParams = {}
  ): Promise<PaginatedResponse<Transaction>> {
    const qs = new URLSearchParams()
    if (params.cursor) qs.set('cursor', params.cursor)
    if (params.limit) qs.set('limit', String(params.limit))
    if (params.status) qs.set('status', params.status)
    if (params.type) qs.set('type', params.type)

    const query = qs.toString() ? `?${qs.toString()}` : ''
    return this.http.get<PaginatedResponse<Transaction>>(
      `/v1/wallets/${walletId}/transactions${query}`
    )
  }
}