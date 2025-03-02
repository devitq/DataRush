import httpx
from celery import shared_task
from django.core.files.base import ContentFile

from django.conf import settings


@shared_task(bind=True, max_retries=3)
def analyze_data_task(self, submission_id):
    from .models import CompetitionTaskSubmission

    submission = CompetitionTaskSubmission.objects.get(id=submission_id)
    try:
        code = submission.content.read().decode()
        files = [
            (f.name, f.file.open("rb"))
            for f in submission.task.attachments.filter(public=True)
        ]

        response = httpx.post(
            f"{settings.CHECKER_API_ENDPOINT}/execute",
            files=[("files", (f.name, f)) for f in files]
            + [
                ("code", code),
                ("expected_hash", submission.task.correct_answer_hash),
            ],
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()

        submission.stdout.save("output.txt", ContentFile(result["output"]))
        submission.result = {
            "correct": result["hash_match"],
            "result_hash": result["result_hash"],
            "error": result.get("error"),
        }
        submission.earned_points = (
            submission.task.points if result["hash_match"] else 0
        )
        submission.status = CompetitionTaskSubmission.StatusChoices.CHECKED

    except httpx.RequestError as e:
        self.retry(countdown=2**self.request.retries)
    except Exception as e:
        submission.result = {"error": str(e), "success": False}
        submission.status = CompetitionTaskSubmission.StatusChoices.CHECKED
        submission.earned_points = 0
    finally:
        submission.save()
