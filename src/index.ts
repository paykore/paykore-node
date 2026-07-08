import { HttpClient, type PayKoreConfig } from './client'
import { WalletNamespace } from './wallet'
import { TransferNamespace } from './transfer'
import { PaymentNamespace } from './payment'
import { ComplianceNamespace } from './compliance'

export { PayKoreError } from './types'
export type {
  Wallet,
  Transaction,
  FeeBreakdown,
  BankAccount,
  QRIntent,
  ComplianceStatus,
  Director,
  CreateWalletParams,
  ListTransactionsParams,
  CreateQRIntentParams,
  PayQRIntentParams,
  SubmitBusinessParams,
  SubmitDirectorsParams,
  AcceptAgreementsParams,
  ApiResponse,
  PaginatedResponse,
} from './types'
export type { PayKoreConfig } from './client'
export type { P2PTransferParams, BankTransferParams } from './transfer'

/**
 * PayKore Web SDK
 *
 * @example
 * ```ts
 * import { PayKore } from '@paykore/sdk'
 *
 * const paykore = new PayKore({ apiKey: 'sk_live_...' })
 *
 * const wallet = await paykore.wallets.create({ user_ref: 'user_123' })
 * const tx = await paykore.transfers.p2p({
 *   source_wallet: wallet.id,
 *   dest_wallet: 'dest-wallet-id',
 *   amount: 500000, // ₦5,000 in kobo
 *   reference: 'txn_001',
 * })
 * ```
 */
export class PayKore {
  readonly wallets: WalletNamespace
  readonly transfers: TransferNamespace
  readonly payments: PaymentNamespace
  readonly compliance: ComplianceNamespace

  constructor(config: PayKoreConfig) {
    const http = new HttpClient(config)
    this.wallets = new WalletNamespace(http)
    this.transfers = new TransferNamespace(http)
    this.payments = new PaymentNamespace(http)
    this.compliance = new ComplianceNamespace(http)
  }
}