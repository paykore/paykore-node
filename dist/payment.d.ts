import type { HttpClient } from './client';
import type { QRIntent, Transaction, CreateQRIntentParams, PayQRIntentParams } from './types';
export declare class PaymentNamespace {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create a QR payment intent. The returned `qr_code` is a base64 image
     * or payload string to render as a QR code for the customer to scan.
     */
    createQRIntent(params: CreateQRIntentParams): Promise<QRIntent>;
    /**
     * Pay a QR intent from a source wallet.
     * Returns the completed transaction.
     */
    payQRIntent(params: PayQRIntentParams): Promise<Transaction>;
}
