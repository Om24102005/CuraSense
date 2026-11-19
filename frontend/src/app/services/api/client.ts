// The shared API client lives in packages/shared. The website keeps the token in localStorage and reads the API address from the Vite environment.
import { configureApi } from '@curasense/shared/api/client';

configureApi({
  baseUrl: import.meta.env.VITE_NODE_BASE_URL ?? 'http://localhost:5001',   // empty = this site's own address (see SystemStatus.tsx)
  getToken: () => localStorage.getItem('curasense_token'),
});

export * from '@curasense/shared/api/client';
