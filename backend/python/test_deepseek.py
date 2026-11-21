"""The DeepSeek provider keeps working when some connections to the API stall (measured 2026-11-11: about one in two new
connections never completed, while a healthy call answers in under a second).

Run with:  .venv/bin/python -W ignore -m unittest test_deepseek
"""
import time
import unittest
from unittest import mock

import requests

from app.services.providers import deepseek


def post(**kw):
    return deepseek._post("deepseek-flash", [{"role": "user", "content": "hi"}], 100, 0.2, kw.pop("total", 60), **kw)


class RetryTests(unittest.TestCase):
    def setUp(self):
        self.sleep = mock.patch.object(deepseek.time, "sleep").start()
        mock.patch.object(deepseek, "print", create=True).start()  # the provider logs every failed attempt; keep the test output clean
        self.addCleanup(mock.patch.stopall)

    def stream(self, *outcomes):
        """Patch the network call: each outcome is returned, or raised when it is an exception."""
        return mock.patch.object(deepseek, "_stream", side_effect=list(outcomes))

    def test_a_connection_that_never_completes_is_retried_on_a_fresh_one(self):
        with self.stream(requests.ConnectTimeout("no tcp"), requests.ReadTimeout("send stalled"), ("answer", "stop")) as s:
            self.assertEqual(post(), "answer")
        self.assertEqual(s.call_count, 3)
        self.sleep.assert_not_called()  # a stalled connection is retried at once: waiting would not help

    def test_a_dropped_connection_is_retried(self):
        with self.stream(requests.ConnectionError("Connection aborted, the write operation timed out"), ("answer", "stop")) as s:
            self.assertEqual(post(), "answer")
        self.assertEqual(s.call_count, 2)

    def test_it_gives_up_after_the_attempts(self):
        with self.stream(*[requests.ReadTimeout("stalled")] * 10) as s:
            self.assertIsNone(post())
        self.assertEqual(s.call_count, deepseek.ATTEMPTS)

    def test_a_server_error_is_retried_after_a_pause_but_a_client_error_is_not(self):
        with self.stream(deepseek._HttpError(503, "busy"), ("answer", "stop")) as s:
            self.assertEqual(post(), "answer")
        self.assertEqual(s.call_count, 2)
        self.sleep.assert_called_once()
        with self.stream(deepseek._HttpError(400, "bad request"), ("never used", "stop")) as s:
            self.assertIsNone(post())
        self.assertEqual(s.call_count, 1)

    def test_empty_or_cut_off_answers_are_asked_again_with_a_bigger_budget(self):
        seen = []

        def fake(headers, payload, deadline):
            seen.append(payload["max_tokens"])  # the payload is one object that gets doubled, so record it at call time
            return ("", "length") if len(seen) == 1 else ("answer", "stop")

        with mock.patch.object(deepseek, "_stream", side_effect=fake):
            self.assertEqual(post(), "answer")
        self.assertEqual(seen[1], seen[0] * 2)

    def test_the_doubling_stops_at_the_cap_the_api_accepts(self):
        seen = []

        def fake(headers, payload, deadline):
            seen.append(payload["max_tokens"])
            return ("", "length")

        with mock.patch.object(deepseek, "_stream", side_effect=fake):
            self.assertIsNone(post())
        self.assertEqual(len(seen), deepseek.ATTEMPTS)
        self.assertEqual(max(seen), deepseek.MAX_TOKENS_CAP)

    def test_no_time_left_means_no_call(self):
        with self.stream(("answer", "stop")) as s:
            self.assertIsNone(post(total=0))
        s.assert_not_called()


class BudgetTests(unittest.TestCase):
    """Neither the connect/send wait nor the idle wait may outlast what is left of the call's budget."""

    def timeouts(self, left):
        with mock.patch.object(deepseek.requests, "post", side_effect=requests.ConnectTimeout("x")) as p:
            with self.assertRaises(requests.ConnectTimeout):
                deepseek._stream({}, {}, time.time() + left)
        return p.call_args.kwargs["timeout"]

    def test_a_big_budget_uses_the_normal_waits(self):
        self.assertEqual(self.timeouts(100), (deepseek.CONNECT, deepseek.IDLE))

    def test_a_small_budget_shortens_both_waits(self):
        connect, idle = self.timeouts(3)
        self.assertLessEqual(connect, 3)
        self.assertLessEqual(idle, 3)

    def test_a_spent_budget_still_gets_a_minimal_wait(self):
        self.assertEqual(self.timeouts(-5), (1.0, 1.0))


if __name__ == "__main__":
    unittest.main()
