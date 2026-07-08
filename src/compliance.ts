import type { HttpClient } from './client'
import type {
  ComplianceStatus,
  SubmitBusinessParams,
  SubmitDirectorsParams,
  AcceptAgreementsParams,
  ApiResponse,
} from './types'

export class ComplianceNamespace {
  constructor(private readonly http: HttpClient) {}

  async getStatus(): Promise<ComplianceStatus> {
    const res = await this.http.get<ApiResponse<ComplianceStatus>>(
      '/v1/partner/compliance/status'
    )
    return res.data
  }

  async submitBusiness(params: SubmitBusinessParams): Promise<void> {
    await this.http.post('/v1/partner/compliance/business', params)
  }

  async submitDirectors(params: SubmitDirectorsParams): Promise<void> {
    await this.http.post('/v1/partner/compliance/directors', params)
  }

  async acceptAgreements(params: AcceptAgreementsParams): Promise<void> {
    await this.http.post('/v1/partner/compliance/agreements', params)
  }

  async submitUseCase(description: string): Promise<void> {
    await this.http.post('/v1/partner/compliance/use-case', { description })
  }
}