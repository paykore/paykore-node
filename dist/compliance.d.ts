import type { HttpClient } from './client';
import type { ComplianceStatus, SubmitBusinessParams, SubmitDirectorsParams, AcceptAgreementsParams } from './types';
export declare class ComplianceNamespace {
    private readonly http;
    constructor(http: HttpClient);
    getStatus(): Promise<ComplianceStatus>;
    submitBusiness(params: SubmitBusinessParams): Promise<void>;
    submitDirectors(params: SubmitDirectorsParams): Promise<void>;
    acceptAgreements(params: AcceptAgreementsParams): Promise<void>;
    submitUseCase(description: string): Promise<void>;
}
