import unittest

from apps.task.tasks import analyze_data_task


class TestAnalyzeDataTask(unittest.TestCase):
    def test_task_execution_basic(self):
        code_str = 'print("Hello, World!")'
        result_path = "stdout"
        expected_bytes = b"Hello, World!\n"
        result = analyze_data_task(code_str, result_path, expected_bytes)
        self.assertTrue(result["success"])
        self.assertTrue(result["match"])

    def test_task_execution_with_files(self):
        code_str = """
with open("file.txt") as f:
    print(f.read())
        """
        result_path = "stdout"
        expected_bytes = b"some_content\n"
        result = analyze_data_task(
            code_str,
            result_path,
            expected_bytes,
            input_files=[{"bind_at": "file.txt", "content": b"some_content"}],
        )
        print(result)
        self.assertTrue(result["success"])
        self.assertTrue(result["match"])
    
    
