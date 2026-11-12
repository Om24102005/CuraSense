/** True when a JWT's exp claim is in the past. A token that cannot be read is treated as still valid: the server decides. */
export function isTokenExpired(token: string, now = Date.now()): boolean {
  try {
    const payload = token.split('.')[1];
    const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof claims.exp === 'number' && claims.exp * 1000 <= now;
  } catch {
    return false;
  }
}
