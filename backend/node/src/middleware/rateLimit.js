/**
 * Fixed-window rate limiter keyed by the authenticated user id (IP if absent).
 * shortcut: in-memory, so limits are per process; use a shared store (Redis)
 * before running more than one Node instance.
 */
export function userRateLimit({ windowMs, max, name }) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [k, h] of hits) if (h.reset <= now) hits.delete(k);
  }, windowMs).unref();

  return (req, res, next) => {
    const key = String(req.user?._id ?? req.ip);
    const now = Date.now();
    let h = hits.get(key);
    if (!h || h.reset <= now) { h = { n: 0, reset: now + windowMs }; hits.set(key, h); }
    if (++h.n > max) {
      const secs = Math.ceil((h.reset - now) / 1000);
      res.set('Retry-After', String(secs));
      return res.status(429).json({ error: `Too many ${name} requests. Try again in ${secs}s.` });
    }
    next();
  };
}
