import type { ApiErrorCode, ApiErrorResponse } from '{{contractPackage}}'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export function apiError(
  c: Context,
  status: ContentfulStatusCode,
  code: ApiErrorCode,
  message: string,
  existingId?: string
) {
  const body: ApiErrorResponse = { error: { code, message, existingId } }
  return c.json(body, status)
}
