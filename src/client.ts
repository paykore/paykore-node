import { PayKoreError } from './types'

export interface PayKoreConfig {
  apiKey: string
  baseURL?: string
  timeout?: number
}

export class HttpClient {
  private readonly baseURL: string
  private readonly apiKey: string
  private readonly timeout: number

  constructor(config: PayKoreConfig) {
    this.apiKey = config.apiKey
    this.baseURL = config.baseURL?.replace(/\/$/, '') ?? 'https://api.paykore.com'
    this.timeout = config.timeout ?? 30_000
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)

    let response: Response
    try {
      response = await fetch(`${this.baseURL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new PayKoreError('TIMEOUT', 'Request timed out', 408)
      }
      throw new PayKoreError('NETWORK_ERROR', 'Network request failed', 0)
    } finally {
      clearTimeout(timer)
    }

    if (!response.ok) {
      let code = 'API_ERROR'
      let message = `HTTP ${response.status}`
      try {
        const json = await response.json()
        code = json.error ?? code
        message = json.message ?? message
      } catch {
        // non-JSON error body
      }
      throw new PayKoreError(code, message, response.status)
    }

    return response.json() as Promise<T>
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path)
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body)
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}