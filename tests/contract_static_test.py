"""Source-level smoke tests only, not a substitute for GenVM direct-mode tests."""
import ast
from pathlib import Path
import unittest

SRC=Path(__file__).resolve().parents[1]/'contracts'/'Pride.py'

class StaticContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tree=ast.parse(SRC.read_text(encoding='utf8'))
        cls.code=SRC.read_text(encoding='utf8')
    def test_syntax_and_single_contract(self):
        classes=[x for x in self.tree.body if isinstance(x,ast.ClassDef) and any(isinstance(b,ast.Attribute) and b.attr=='Contract' for b in x.bases)]
        self.assertEqual(len(classes),1)
    def test_nondet_inside_consensus_scope(self):
        self.assertIn('gl.vm.run_nondet_unsafe(read_and_classify, validator_fn)',self.code)
        self.assertIn('mine = read_and_classify()',self.code)
    def test_no_payable_and_no_asset_transfers(self):
        self.assertNotIn('public.write.payable',self.code)
        self.assertNotIn('emit_transfer(',self.code)
    def test_verdict_and_evidence_bound(self):
        self.assertIn('return theirs == mine',self.code)
        self.assertIn('hashlib.sha256(result["text"].encode("utf-8")).hexdigest()',self.code)
        self.assertIn('result["outcome"] == "INSUFFICIENT_EVIDENCE"',self.code)
    def test_views_present(self):
        for method in ('get_charters','get_checks','get_config'):
            self.assertIn('def '+method+'(',self.code)

if __name__=='__main__':unittest.main()
