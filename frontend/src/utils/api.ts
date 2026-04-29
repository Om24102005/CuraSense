/**
 * API base URL utility.
 *
 * Resolution order:
 *  1. VITE_API_BASE_URL env var (set at build time via Railway variable reference
 *     `${{ CuraSense.RAILWAY_PRIVATE_DOMAIN }}:8000`)
 *  2. The Railway private domain default injected by vite.config.ts
 *  3. Local development fallback: http://localhost:8000
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ||
  'http://curasense.railway.internal:8000';
