// kit:if cloudflare-workers
import type { ApiErrorCode as ContractApiErrorCode } from '{{contractPackage}}'
// kit:end
// kit:if !cloudflare-workers
type ContractApiErrorCode =
  'duplicate' | 'invalid' | 'not_found' | 'rate_limited' | 'internal'
// kit:end

// 'unknown' is client-only: a network failure or a response outside the contract.
export type ApiErrorCode = ContractApiErrorCode | 'unknown'

export interface IApiError {
  code: ApiErrorCode
  message: string
  status?: number
  existingId?: string
}
