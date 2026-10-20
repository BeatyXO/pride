# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""Non-custodial consumer gate bound to one immutable PRIDE policy."""
import json
import typing
from datetime import datetime, timezone
from dataclasses import dataclass
import genlayer as gl
from genlayer import *
from genlayer.py.public_abi import StorageType

MAX_DECISIONS = 256
MAX_ACTION_ID = 100
MAX_PAGE_SIZE = 50
REQUIRED_CHECKPOINT_OUTCOME = "MATCHES"


@gl.contract_interface
class PrideInterface:
    class View:
        def get_reliance_status(self, charter_id: int) -> str: ...


@allow_storage
@dataclass
class GateDecision:
    action_id: str
    caller: Address
    permitted: bool
    reason: str
    standing: str
    observed_version: u32
    expected_version: u32
    has_checkpoint: bool
    checkpoint_id: u32
    checkpoint_outcome: str
    checkpoint_digest: str
    decided_at: u64


class PrideRelianceGate(gl.Contract):
    pride_address: Address
    charter_id: u32
    expected_version: u32
    operator: Address
    decisions: DynArray[GateDecision]

    def __init__(self, pride_address: Address, charter_id: int, expected_version: int):
        # The GenLayer CLI's argument parser sends a hex address as Address,
        # while Direct Mode fixtures pass a string. Accept both representations.
        self.pride_address = pride_address if isinstance(pride_address, Address) else Address(pride_address)
        self.charter_id = u32(charter_id)
        self.expected_version = u32(expected_version)
        self.operator = gl.message.sender_address

    @gl.public.write
    def authorize(self, action_id: str) -> typing.Any:
        """Record one unique operator request using live canonical PRIDE standing."""
        if gl.message.sender_address != self.operator:
            return json.dumps({"ok": False, "error": "NOT_OPERATOR"})
        if not isinstance(action_id, str) or not action_id.strip() or len(action_id) > MAX_ACTION_ID:
            return json.dumps({"ok": False, "error": "INVALID_ACTION_ID"})
        if len(self.decisions) >= MAX_DECISIONS:
            return json.dumps({"ok": False, "error": "DECISION_CAPACITY"})
        for previous in self.decisions:
            if previous.action_id == action_id:
                return json.dumps({"ok": False, "error": "ACTION_ALREADY_USED"})
        try:
            source = PrideInterface(self.pride_address)
            raw = source.view(state=StorageType.LATEST_FINAL).get_reliance_status(int(self.charter_id))
            state = json.loads(raw) if isinstance(raw, str) else raw
        except Exception:
            return json.dumps({"ok": False, "error": "PRIDE_READ_FAILED"})
        if not isinstance(state, dict) or state.get("ok") is not True:
            return json.dumps({"ok": False, "error": "INVALID_PRIDE_STANDING"})
        standing = state.get("standing", "")
        version = state.get("version")
        active = state.get("active")
        checkpoint_version = state.get("checkpoint_version")
        checkpoint_outcome = state.get("checkpoint_outcome")
        source_matches = state.get("source_matches")
        content_matches = state.get("content_matches")
        eligible = state.get("eligible")
        blocking_cases = state.get("blocking_cases")
        if (not isinstance(standing, str) or not isinstance(version, int) or
                not isinstance(active, bool) or not isinstance(checkpoint_version, int) or
                not isinstance(checkpoint_outcome, str) or not isinstance(source_matches, bool) or
                not isinstance(content_matches, bool) or not isinstance(eligible, bool) or
                not isinstance(blocking_cases, list)):
            return json.dumps({"ok": False, "error": "INVALID_PRIDE_STANDING"})
        permitted = (active and version == int(self.expected_version) and eligible and
                     checkpoint_version == version and checkpoint_outcome == REQUIRED_CHECKPOINT_OUTCOME and
                     source_matches and content_matches and not blocking_cases)
        reason = "POLICY_SATISFIED" if permitted else (
            "INACTIVE_COMMITMENT" if not active else
            "STALE_VERSION" if version != int(self.expected_version) or
            (checkpoint_version >= 0 and checkpoint_version != version) else
            str(state.get("reason") or "STANDING_NOT_ELIGIBLE"))
        now = int(datetime.now(timezone.utc).timestamp())
        checkpoint_id = state.get("checkpoint_id")
        has_checkpoint = isinstance(checkpoint_id, int) and checkpoint_id >= 0
        self.decisions.append(GateDecision(action_id, gl.message.sender_address, permitted, reason,
                                           standing, u32(version), self.expected_version,
                                           has_checkpoint, u32(checkpoint_id if has_checkpoint else 0),
                                           checkpoint_outcome, str(state.get("checkpoint_digest") or ""),
                                           u64(now)))
        return json.dumps({"ok": True, "decision": "PERMITTED" if permitted else "REJECTED",
                           "action_id": action_id, "reason": reason, "standing": standing,
                           "observed_version": version, "expected_version": int(self.expected_version),
                           "qualifying_checkpoint_id": state.get("checkpoint_id"),
                           "qualifying_checkpoint_outcome": checkpoint_outcome,
                           "qualifying_checkpoint_digest": str(state.get("checkpoint_digest") or ""),
                           "decision_id": len(self.decisions) - 1})

    @gl.public.view
    def get_config(self) -> str:
        return json.dumps({"product": "PRIDE_RELIANCE_GATE", "version": "1.0.0",
                           "pride_address": self.pride_address.as_hex,
                           "charter_id": int(self.charter_id),
                           "expected_version": int(self.expected_version),
                           "operator": self.operator.as_hex,
                           "required_checkpoint_outcome": REQUIRED_CHECKPOINT_OUTCOME,
                           "eligibility_policy": "ACTIVE_CURRENT_VERSION_MATCH_VALID_SOURCE_NO_BLOCKING_CASE",
                           "max_decisions": MAX_DECISIONS, "max_page_size": MAX_PAGE_SIZE})

    @gl.public.view
    def get_decisions(self, offset: int = 0, limit: int = MAX_PAGE_SIZE) -> str:
        if offset < 0 or limit < 1 or limit > MAX_PAGE_SIZE:
            return "[]"
        end = min(offset + limit, len(self.decisions))
        return json.dumps([{"id": i, "action_id": self.decisions[i].action_id,
                            "caller": self.decisions[i].caller.as_hex,
                            "permitted": bool(self.decisions[i].permitted),
                            "reason": self.decisions[i].reason,
                            "standing": self.decisions[i].standing,
                            "has_checkpoint": bool(self.decisions[i].has_checkpoint),
                            "checkpoint_id": int(self.decisions[i].checkpoint_id) if self.decisions[i].has_checkpoint else None,
                            "checkpoint_outcome": self.decisions[i].checkpoint_outcome,
                            "checkpoint_digest": self.decisions[i].checkpoint_digest,
                            "observed_version": int(self.decisions[i].observed_version),
                            "expected_version": int(self.decisions[i].expected_version),
                            "decided_at": int(self.decisions[i].decided_at)}
                           for i in range(offset, end)])
