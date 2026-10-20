"""Direct Mode integration checks for the separate Reliance Gate IC."""
import json
from pathlib import Path

from test_contract_direct import GENVM_RELEASE, _windows_tempfile_compat


CONTRACT_ROOT = Path(__file__).resolve().parents[1] / "contracts"


def test_gate_reads_canonical_standing_and_blocks_replay_and_unauthorized_caller(
    direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch
):
    _windows_tempfile_compat(monkeypatch)
    pride_address = "0x" + direct_alice.hex()
    states = [{"ok": True, "version": 1, "active": True, "standing": "OBSERVED"}]
    requests = []
    def hook(vm, request):
        call = request.get("CallContract", {})
        requests.append(call)
        if call.get("calldata", {}).get("method") != "get_standing":
            return None
        from genlayer.py import calldata
        from genlayer.py.public_abi import ResultCode
        encoded = calldata.encode(json.dumps(states[0]))
        return bytes([int(ResultCode.RETURN)]) + encoded
    direct_vm._gl_call_hook = hook
    gate = direct_deploy(str(CONTRACT_ROOT / "pride_reliance_gate.py"), pride_address, 0, 1,
                         sdk_version=GENVM_RELEASE)
    result = json.loads(gate.authorize("action-1"))
    assert result["decision"] == "PERMITTED", (result, direct_vm._traces)
    assert requests[0]["calldata"]["method"] == "get_standing"
    assert requests[0]["state"] == 1  # StorageType.LATEST_FINAL, never provisional standing.
    assert json.loads(gate.get_decisions())[0]["standing"] == "OBSERVED"
    assert json.loads(gate.authorize("action-1"))["error"] == "ACTION_ALREADY_USED"
    direct_vm.sender = direct_bob
    assert json.loads(gate.authorize("action-2"))["error"] == "NOT_OPERATOR"


def test_gate_rejects_adverse_stale_and_inconclusive_pride_state(direct_vm, direct_deploy, direct_alice, monkeypatch):
    _windows_tempfile_compat(monkeypatch)
    pride_address = "0x" + direct_alice.hex()
    state = {"ok": True, "version": 1, "active": True, "standing": "MATERIAL_DEVIATION_ESTABLISHED"}
    def hook(vm, request):
        from genlayer.py import calldata
        from genlayer.py.public_abi import ResultCode
        encoded = calldata.encode(json.dumps(state))
        return bytes([int(ResultCode.RETURN)]) + encoded
    direct_vm._gl_call_hook = hook
    gate = direct_deploy(str(CONTRACT_ROOT / "pride_reliance_gate.py"), pride_address, 0, 1,
                         sdk_version=GENVM_RELEASE)
    assert json.loads(gate.authorize("adverse"))["decision"] == "REJECTED"
    state.update(standing="OBSERVED", version=2)
    assert json.loads(gate.authorize("stale"))["reason"] == "STALE_VERSION"
    state.update(standing="INCONCLUSIVE", version=1)
    assert json.loads(gate.authorize("inconclusive"))["reason"] == "STANDING_NOT_ELIGIBLE"
    assert [row["permitted"] for row in json.loads(gate.get_decisions())] == [False, False, False]


def test_gate_fails_closed_when_bound_pride_contract_cannot_be_read(direct_vm, direct_deploy, direct_alice, monkeypatch):
    _windows_tempfile_compat(monkeypatch)
    pride_address = "0x" + direct_alice.hex()
    direct_vm._gl_call_hook = lambda vm, request: None
    gate = direct_deploy(str(CONTRACT_ROOT / "pride_reliance_gate.py"), pride_address, 0, 1,
                         sdk_version=GENVM_RELEASE)
    assert json.loads(gate.authorize("unavailable"))["error"] in ("PRIDE_READ_FAILED", "INVALID_PRIDE_STANDING")
    assert json.loads(gate.get_decisions()) == []
