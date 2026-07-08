import type { HttpClient } from './client'
import type {
  QRIntent,
  Transaction,
  CreateQRIntentParams,
  PayQRIntentParams,
  ApiResponse,
} from './types'

export class PaymentNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a QR payment intent. The returned `qr_code` is a base64 image
   * or payload string to render as a QR code for the customer to scan.
   */
  async createQRIntent(params: CreateQRIntentParams): Promise<QRIntent> {
    const res = await this.http.post<ApiResponse<QRIntent>>('/v1/payments/qr/create', {
      wallet_id: params.wallet_id,
      amount: params.amount,
      reference: params.reference,
      description: params.description,
      expires_in_seconds: params.expires_in_seconds ?? 300,
    })
    return res.data
  }

  /**
   * Pay a QR intent from a source wallet.
   * Returns the completed transaction.
   */
  async payQRIntent(params: PayQRIntentParams): Promise<Transaction> {
    const res = await this.http.post<ApiResponse<Transaction>>('/v1/payments/qr/pay', {
      qr_reference: params.qr_reference,
      source_wallet: params.source_wallet,
    })
    return res.data
  }
}