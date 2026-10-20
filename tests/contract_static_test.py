"""AST structure checks complement, but do not replace, GenVM Direct Mode."""
import ast
from pathlib import Path
import unittest

SRC = Path(__file__).resolve().parents[1] / "contracts" / "Pride.py"


def calls_named(node, name):
    return [item for item in ast.walk(node) if isinstance(item, ast.Call) and
            ((isinstance(item.func, ast.Name) and item.func.id == name) or
             (isinstance(item.func, ast.Attribute) and item.func.attr == name))]


def methods_in(node):
    return {item.name: item for item in ast.walk(node) if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef))}


class StaticContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tree = ast.parse(SRC.read_text(encoding="utf8"))
        cls.contracts = [node for node in cls.tree.body if isinstance(node, ast.ClassDef) and
                         any(isinstance(base, ast.Attribute) and base.attr == "Contract" for base in node.bases)]
        cls.contract = cls.contracts[0]
        cls.methods = methods_in(cls.contract)

    def test_syntax_and_single_contract(self):
        self.assertEqual(len(self.contracts), 1)
        self.assertEqual(self.contract.name, "Pride")

    def test_nondeterministic_comparison_is_validator_scoped(self):
        checker = self.methods["_record_checkpoint"]
        consensus = calls_named(checker, "run_nondet_unsafe")
        self.assertTrue(consensus)
        self.assertTrue(any(any(isinstance(arg, ast.Name) and arg.id == "compare" for arg in call.args) and
                            any(isinstance(arg, ast.Name) and arg.id == "validate" for arg in call.args)
                            for call in consensus))

    def test_no_payable_methods_or_asset_transfer_calls(self):
        for method in self.methods.values():
            for decorator in method.decorator_list:
                if isinstance(decorator, ast.Attribute):
                    self.assertNotEqual(decorator.attr, "payable")
            self.assertFalse(calls_named(method, "transfer"))
            self.assertFalse(calls_named(method, "send"))

    def test_canonical_source_and_bounds_are_in_admission_path(self):
        reader = next(node for node in self.tree.body if isinstance(node, ast.FunctionDef) and node.name == "_read_source")
        self.assertTrue(calls_named(reader, "_canonical"))
        self.assertTrue(calls_named(reader, "sha256"))
        self.assertTrue(calls_named(reader, "encode"))
        source_guard = any(isinstance(node, ast.Compare) and any(
            isinstance(part, ast.Name) and part.id == "MAX_SOURCE_BYTES"
            for part in [node.left, *node.comparators]) for node in ast.walk(reader))
        self.assertTrue(source_guard)

    def test_lifecycle_views_exist_and_are_exposed_as_views(self):
        for name in ("get_charters", "get_checks", "get_publishers", "get_amendments", "get_challenges", "get_config"):
            self.assertIn(name, self.methods)
            decorators = self.methods[name].decorator_list
            self.assertTrue(any(isinstance(d, ast.Attribute) and d.attr == "view" for d in decorators), name)


if __name__ == "__main__":
    unittest.main()
