import tempfile
import os
import sys
import ast
from io import StringIO
import hashlib
from config.celery import app

ALLOWED_MODULES = {
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "scipy",
    "sklearn",
    "datetime",
    "json",
    "csv",
    "math",
    "statistics",
}


class SecurityException(Exception):
    pass


def validate_code(code_str):
    try:
        tree = ast.parse(code_str)
    except SyntaxError as e:
        raise SecurityException(f"Syntax error: {str(e)}")

    class ImportVisitor(ast.NodeVisitor):
        def visit_Import(self, node):
            for alias in node.names:
                module = alias.name.split(".")[0]
                if module not in ALLOWED_MODULES:
                    raise SecurityException(f"Disallowed import: {module}")

        def visit_ImportFrom(self, node):
            if node.module:
                module = node.module.split(".")[0]
                if module not in ALLOWED_MODULES:
                    raise SecurityException(
                        f"Disallowed import from: {module}"
                    )

    class SecurityVisitor(ast.NodeVisitor):
        def generic_visit(self, node):
            if isinstance(node, (ast.Call, ast.Attribute)):
                if "system" in getattr(node, "attr", ""):
                    raise SecurityException("Dangerous system call detected")
            super().generic_visit(node)

    try:
        ImportVisitor().visit(tree)
        SecurityVisitor().visit(tree)
    except SecurityException as e:
        raise
    except Exception as e:
        raise SecurityException(f"Security check failed: {str(e)}")


def secure_exec(code_str, result_path):
    original_dir = os.getcwd()
    original_stdout = sys.stdout
    sys.stdout = captured_stdout = StringIO()
    result_content = None

    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            os.chdir(temp_dir)
            restricted_globals = {
                "__builtins__": {
                    "open": lambda f, *a, **kw: open(f, *a, **kw),
                    "print": print,
                    "str": str,
                    "int": int,
                    "float": float,
                    "bool": bool,
                    "list": list,
                    "dict": dict,
                    "tuple": tuple,
                    "set": set,
                }
            }

            exec(code_str, restricted_globals)

            if result_path == "stdout":
                result_content = captured_stdout.getvalue().encode("utf-8")
            else:
                with open(result_path, "rb") as f:
                    result_content = f.read()

        except Exception as e:
            raise RuntimeError(f"Execution error: {str(e)}")
        finally:
            os.chdir(original_dir)
            sys.stdout = original_stdout

    return result_content


@app.task(bind=True)
def analyze_data_task(self, code_str, result_path, expected_bytes):
    try:
        validate_code(code_str)

        result_content = secure_exec(code_str, result_path)

        result_hash = hashlib.sha256(result_content).hexdigest()
        expected_hash = hashlib.sha256(expected_bytes).hexdigest()

        return {
            "success": True,
            "match": result_hash == expected_hash,
            "result_hash": result_hash,
            "expected_hash": expected_hash,
        }

    except SecurityException as e:
        return {"success": False, "error": f"Security violation: {str(e)}"}
    except RuntimeError as e:
        return {"success": False, "error": f"Execution error: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {str(e)}"}
