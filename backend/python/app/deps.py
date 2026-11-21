import hmac

from fastapi import Header, HTTPException
from .config import GATEWAY_SECRET


async def verify_gateway_auth(authorization: str = Header(None)):
    # With no secret set, an empty token would match: anyone who can reach this service could spend the AI credit. Refuse instead.
    if not GATEWAY_SECRET:
        raise HTTPException(status_code=503, detail="Gateway secret is not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized System Access")
    token = authorization.split(" ", 1)[1]
    if not hmac.compare_digest(token.encode(), GATEWAY_SECRET.encode()):
        raise HTTPException(status_code=403, detail="Invalid Gateway Token")
    return token
