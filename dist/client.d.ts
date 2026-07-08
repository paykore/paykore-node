export interface PayKoreConfig {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}
export declare class HttpClient {
    private readonly baseURL;
    private readonly apiKey;
    private readonly timeout;
    constructor(config: PayKoreConfig);
    request<T>(method: string, path: string, body?: unknown): Promise<T>;
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body: unknown): Promise<T>;
    delete<T>(path: string): Promise<T>;
}
