"""The gateway must never let a request through on an empty or missing secret: anyone who could reach it would spend the AI credit."""
import asyncio
import unittest
from unittest.mock import patch

from fastapi import HTTPException

from app import deps


def call(header):
    return asyncio.run(deps.verify_gateway_auth(header))


class GatewayAuth(unittest.TestCase):
    def test_right_secret_passes(self):
        with patch.object(deps, "GATEWAY_SECRET", "s3cret-value"):
            self.assertEqual(call("Bearer s3cret-value"), "s3cret-value")

    def test_missing_or_malformed_header_is_401(self):
        with patch.object(deps, "GATEWAY_SECRET", "s3cret-value"):
            for header in (None, "", "s3cret-value", "Basic s3cret-value"):
                with self.assertRaises(HTTPException) as ctx:
                    call(header)
                self.assertEqual(ctx.exception.status_code, 401, header)

    def test_wrong_secret_is_403(self):
        with patch.object(deps, "GATEWAY_SECRET", "s3cret-value"):
            for header in ("Bearer nope", "Bearer ", "Bearer s3cret-valuE", "Bearer é"):
                with self.assertRaises(HTTPException) as ctx:
                    call(header)
                self.assertEqual(ctx.exception.status_code, 403, header)

    def test_no_secret_configured_refuses_everything_even_an_empty_token(self):
        with patch.object(deps, "GATEWAY_SECRET", ""):
            for header in ("Bearer ", "Bearer anything", None):
                with self.assertRaises(HTTPException) as ctx:
                    call(header)
                self.assertEqual(ctx.exception.status_code, 503, header)


if __name__ == "__main__":
    unittest.main()
