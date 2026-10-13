"""GenLayer direct-mode behavior tests; mocked reads only, never a network proof."""
import json
import os
from pathlib import Path


CONTRACT = Path(__file__).resolve().parents[1] / "contracts" / "Pride.py"
SOURCE_URL = "https://docs.example.org/tokenomics.txt"
GENVM_RELEASE = "v0.2.12"


def _windows_tempfile_compat(monkeypatch):
    """Work around genlayer-test 0.29.2 unlinking its active fd-0 tempfile."""
    if os.name != "nt":
        return
    unlink = os.unlink

    def defer_locked_unlink(path, *args, **kwargs):
        try:
            unlink(path, *args, **kwargs)
        except PermissionError:
            # The runtime loader has dup2'ed this file onto stdin. Windows keeps
            # it locked until process teardown; it is a temporary OS file.
            return

    monkeypatch.setattr(os, "unlink", defer_locked_unlink)


def _deploy(direct_deploy, direct_vm, text, outcome="MATCHES", monkeypatch=None):
    if monkeypatch:
        _windows_tempfile_compat(monkeypatch)
    direct_vm.mock_web(r"docs\.example\.org/tokenomics\.txt", {
        "status": 200,
        "body": text,
    })
    excerpt = text[:30] if outcome != "INSUFFICIENT_EVIDENCE" else ""
    direct_vm.mock_llm(r".*", json.dumps({"outcome": outcome, "evidence_excerpt": excerpt}))
    return direct_deploy(str(CONTRACT), sdk_version=GENVM_RELEASE)


def test_register_and_owner_controls(direct_vm, direct_deploy, direct_alice, direct_bob, monkeypatch):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm, "Community receives 30%.", monkeypatch=monkeypatch)
    registered = json.loads(contract.register("Token allocation", "TOKENOMICS", SOURCE_URL, "Community receives 30%"))
    assert registered == {"ok": True, "charter_id": 0}
    rows = json.loads(contract.get_charters())
    assert rows[0]["owner"].lower() == "0x" + direct_alice.hex()
    assert rows[0]["active"] is True
    assert rows[0]["policy_type"] == "TOKENOMICS"

    direct_vm.sender = direct_bob
    assert json.loads(contract.deactivate(0))["error"] == "NOT_OWNER"
    direct_vm.sender = direct_alice
    assert json.loads(contract.deactivate(0)) == {"ok": True}


def test_approved_source_checkpoint_and_unavailable_path(direct_vm, direct_deploy, direct_alice, monkeypatch):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm, "Community receives 30%.", monkeypatch=monkeypatch)
    assert json.loads(contract.register("Token allocation", "TOKENOMICS", SOURCE_URL, "Community receives 30%"))["ok"]
    result = json.loads(contract.check_source(0))
    assert result["ok"] is True, (result, direct_vm._traces)
    assert result["outcome"] == "MATCHES"
    checks = json.loads(contract.get_checks(0))
    assert checks[0]["text"] == "Community receives 30%."
    assert len(checks[0]["content_digest"]) == 64
    assert checks[0]["source_url"] == SOURCE_URL
    assert json.loads(checks[0]["term_comparison"])["changed"] is False

    assert direct_vm.run_validator() is True
    direct_vm.clear_mocks()
    changed = "Community receives 15%."
    direct_vm.mock_web(r"docs\.example\.org/tokenomics\.txt", {"status": 200, "body": changed})
    direct_vm.mock_llm(r".*", json.dumps({"outcome": "MATERIAL_CHANGE", "evidence_excerpt": changed}))
    assert direct_vm.run_validator() is False
    updated = json.loads(contract.check_source(0))
    assert updated["ok"] is True
    assert json.loads(updated["term_comparison"])["changed"] is True

    direct_vm.clear_mocks()
    direct_vm.mock_web(r"docs\.example\.org/tokenomics\.txt", {"status": 503, "body": ""})
    unavailable = json.loads(contract.check_source(0))
    assert unavailable == {"ok": False, "error": "SOURCE_UNAVAILABLE"}
    assert len(json.loads(contract.get_checks(0))) == 2


def test_malformed_model_result_is_insufficient_not_adverse(direct_vm, direct_deploy, direct_alice, monkeypatch):
    direct_vm.sender = direct_alice
    contract = _deploy(direct_deploy, direct_vm, "Community receives 30%.", monkeypatch=monkeypatch)
    assert json.loads(contract.register("Token allocation", "TOKENOMICS", SOURCE_URL, "Community receives 30%"))["ok"]
    direct_vm.clear_mocks()
    direct_vm.mock_web(r"docs\.example\.org/tokenomics\.txt", {"status": 200, "body": "Community receives 30%."})
    direct_vm.mock_llm(r".*", json.dumps({"outcome": "MATERIAL_CHANGE", "evidence_excerpt": "invented quote"}))
    result = json.loads(contract.check_source(0))
    assert result == {"ok": False, "error": "INSUFFICIENT_EVIDENCE"}
    assert json.loads(contract.get_checks(0)) == []


def test_invalid_url_and_unsupported_category_inputs_do_not_register(direct_vm, direct_deploy, direct_alice, monkeypatch):
    direct_vm.sender = direct_alice
    _windows_tempfile_compat(monkeypatch)
    contract = direct_deploy(str(CONTRACT), sdk_version=GENVM_RELEASE)
    invalid = json.loads(contract.register("bad", "TOKENOMICS", "http://docs.example.org/x", "Promise"))
    assert invalid["error"] == "INVALID_CHARTER"
    invalid_category = json.loads(contract.register("bad", "GOVERNANCE", SOURCE_URL, "Promise"))
    assert invalid_category["error"] == "INVALID_CHARTER"
    assert json.loads(contract.get_charters()) == []
