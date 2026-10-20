"""Cross-contract Direct Mode integration: Gate reads the deployed Pride object."""
import json
import re
from pathlib import Path

from glsim.engine import SimEngine
from glsim.state import StateStore
from gltest.direct.loader import load_contract_class

from test_contract_direct import BASE_URL, GENVM_RELEASE, REPO, _windows_tempfile_compat


ROOT = Path(__file__).resolve().parents[1]


def test_gate_reads_real_pride_contract_and_requires_positive_current_checkpoint(monkeypatch):
    """Local simulation only; the target Pride view is real and is not stubbed."""
    _windows_tempfile_compat(monkeypatch)
    engine = SimEngine(StateStore(chain_id=61999))
    engine.activate()
    try:
        pride_path = ROOT / "contracts" / "Pride.py"
        gate_path = ROOT / "contracts" / "pride_reliance_gate.py"
        engine._class_cache[str(pride_path.resolve())] = load_contract_class(pride_path, engine.vm, GENVM_RELEASE)
        engine._reset_contract_registry()
        engine._class_cache[str(gate_path.resolve())] = load_contract_class(gate_path, engine.vm, GENVM_RELEASE)

        operator = "0x1111111111111111111111111111111111111111"
        stranger = "0x2222222222222222222222222222222222222222"
        pride_address, _ = engine.deploy(str(pride_path), sender=operator)
        engine.vm.mock_web(re.escape(BASE_URL), {"status": 200, "body": "Community allocation remains 30%."})
        assert json.loads(engine.call_method(pride_address, "register_publisher", ["Fixture publisher", REPO], sender=operator))["ok"]
        assert json.loads(engine.call_method(pride_address, "register", ["Terms", "TOKENOMICS", BASE_URL,
                                                                           "Community allocation remains 30%."],
                                            sender=operator))["ok"]
        gate_address, _ = engine.deploy(str(gate_path), args=[pride_address, 0, 1], sender=operator)
        missing = json.loads(engine.call_method(gate_address, "authorize", ["missing-evidence"], sender=operator))
        assert missing["decision"] == "REJECTED"
        assert missing["reason"] == "NO_CURRENT_VERSION_CHECKPOINT"
        engine.vm.mock_llm(r"Allowed outcomes: MATCHES", json.dumps({
            "outcome": "MATCHES", "evidence": "Community allocation remains 30%."}))
        assert json.loads(engine.call_method(pride_address, "check_source", [0, BASE_URL], sender=operator))["ok"]
        original_hook = engine.vm._gl_call_hook
        calls = []

        def observed_hook(vm, request):
            call = request.get("CallContract")
            if call:
                calls.append(call)
            return original_hook(vm, request)

        engine.vm._gl_call_hook = observed_hook
        permitted = json.loads(engine.call_method(gate_address, "authorize", ["eligible-match"], sender=operator))
        assert "decision" in permitted, (permitted, calls, engine.vm._traces)
        assert permitted["decision"] == "PERMITTED", (permitted, engine.vm._traces)
        assert calls[-1]["address"].as_hex.lower() == pride_address.lower()
        assert calls[-1]["calldata"]["method"] == "get_reliance_status"
        assert calls[-1]["state"] == 1

        # A subsequent changed checkpoint is the actual Pride object's current state.
        changed_url = BASE_URL.replace("baseline.txt", "changed.txt")
        engine.vm.mock_web(re.escape(changed_url), {"status": 200, "body": "Community allocation is now 15%."})
        engine.vm.mock_llm(r"Allowed outcomes: MATCHES", json.dumps({
            "outcome": "MATERIAL_CHANGE", "evidence": "Community allocation is now 15%."}))
        assert json.loads(engine.call_method(pride_address, "check_source", [0, changed_url], sender=operator))["ok"]
        rejected = json.loads(engine.call_method(gate_address, "authorize", ["changed-checkpoint"], sender=operator))
        assert rejected["decision"] == "REJECTED"
        assert rejected["reason"] == "LATEST_CHECKPOINT_NOT_MATCHES"
        readback = json.loads(engine.call_method(gate_address, "get_decisions"))
        assert [item["permitted"] for item in readback] == [False, True, False]
        assert readback[0]["has_checkpoint"] is False
        assert readback[1]["has_checkpoint"] is True and readback[1]["checkpoint_outcome"] == "MATCHES"
        assert readback[2]["checkpoint_outcome"] == "MATERIAL_CHANGE"

        unauthorized = json.loads(engine.call_method(gate_address, "authorize", ["stranger"], sender=stranger))
        assert unauthorized["error"] == "NOT_OPERATOR"
    finally:
        engine.deactivate()
