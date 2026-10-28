from fastapi import Header, HTTPException
from .config import GATEWAY_SECRET


async def verify_gateway_auth(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized System Access")
    token = authorization.split(" ")[1]
    if token != GATEWAY_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Gateway Token")
    return token
