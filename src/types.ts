// ── Core domain types ────────────────────────────────────────

export interface Wallet {
  id: string
  partner_id: string
  user_ref: string
  currency: string
  status: 'pending' | 'active' | 'frozen' | 'closed'
  account_number: string | null
  account_name: string | null
  bank_code: string | null
  bank_name: string | null
  mfb_reference: string | null
  account_status: 'provisioning' | 'active' | 'suspended' | 'closed'
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface FeeBreakdown {
  customerFee: number
  merchantFee: number
  platformFee: number
  mfbCost: number
  netAmount: number
}

export interface Transaction {
  id: string
  partner_id: string
  reference: string
  type:
    | 'wallet_funding'
    | 'wallet_credit'
    | 'wallet_debit'
    | 'p2p_transfer'
    | 'bank_transfer'
    | 'ussd_payment'
    | 'qr_payment'
    | 'split_payment'
    | 'fee_deduction'
    | 'reversal'
    | 'settlement_payout'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed' | 'expired'
  amount: number
  currency: string
  source_wallet: string | null
  dest_wallet: string | null
  fee_breakdown: FeeBreakdown
  mfb_reference: string | null
  description: string
  metadata: Record<string, unknown>
  failed_reason: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface BankAccount {
  bank_code: string
  account_number: string
  account_name: string
}

export interface QRIntent {
  qr_code: string
  reference: string
  expires_at: string
}

export interface ComplianceStatus {
  overall_status:
    | 'incomplete'
    | 'submitted'
    | 'under_review'
    | 'approved'
    | 'rejected'
    | 'suspended'
  cac_number: string
  business_type: string
  terms_version: string
  rejection_reason: string | null
  use_case_description: string
  directors_submitted_at: string | null
  terms_accepted_at: string | null
  aml_policy_accepted_at: string | null
  dpa_accepted_at: string | null
  steps: {
    business_info: boolean
    directors: boolean
    agreements: boolean
    use_case: boolean
  }
}

export interface Director {
  full_name: string
  role: string
  bvn?: string
  nin?: string
}

// ── Request param types ───────────────────────────────────────

export interface CreateWalletParams {
  user_ref: string
  currency?: string
  metadata?: Record<string, unknown>
}

export interface ListTransactionsParams {
  cursor?: string
  limit?: number
  status?: string
  type?: string
}

export interface CreateQRIntentParams {
  wallet_id: string
  amount: number
  reference: string
  description?: string
  expires_in_seconds?: number
}

export interface PayQRIntentParams {
  qr_reference: string
  source_wallet: string
}

export interface SubmitBusinessParams {
  cac_number: string
  business_type: 'llc' | 'sole_prop' | 'ngo' | 'partnership'
}

export interface SubmitDirectorsParams {
  directors: Director[]
}

export interface AcceptAgreementsParams {
  terms: true
  aml_policy: true
  dpa: true
}

// ── Response wrapper ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  next_cursor: string | null
}

// ── Error ────────────────────────────────────────────────────

export class PayKoreError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'PayKoreError'
  }
}