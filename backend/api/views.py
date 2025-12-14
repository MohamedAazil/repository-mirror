from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import fetch_repo_data, extract_repo_signals, llm_evaluate_repository
from .models import LeaderboardEntry
# Create your views here.


class AnalyzeRepoView(APIView):
    def post(self, request):
        repo_url = request.data.get("repo_url")

        if not repo_url:
            return Response({"error": "repo_url is required"}, status=400)

        repo_info, contents = fetch_repo_data(repo_url)

        signals = extract_repo_signals(repo_info, contents)

        llm_result = llm_evaluate_repository(signals)

        return Response(llm_result)

class LeaderBoardView(APIView):
    def normalize_github_url(url: str) -> str:
        url = url.rstrip("/")
        if url.endswith(".git"):
            url = url[:-4]
        return url.lower()

    def get(self, request, *args, **kwargs):
        top_entries = LeaderboardEntry.objects.all()[:10]
        data = [
            {
                "repo_name": e.repo_name,
                "repo_owner": e.repo_owner,
                "repo_url": e.repo_url,
                "score": e.score_overall,
                "rank": e.rank
            }
            for e in top_entries
        ]
        return Response(data, status=status.HTTP_200_OK) 

    def post(self, request):
        repo_url = request.data.get("repo_url")
        score_overall = request.data.get("score_overall")
        rank = request.data.get("rank")

        if not repo_url or score_overall is None or not rank:
            return Response(
                {"error": "repo_url, score_overall, and rank are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Normalize URL to prevent duplicates
        normalized_url = repo_url.rstrip("/").lower()
        if normalized_url.endswith(".git"):
            normalized_url = normalized_url[:-4]

        # Optionally fetch signals for repo_name and repo_owner
        try:
            repo_info, contents = fetch_repo_data(normalized_url)
            signals = extract_repo_signals(repo_info, contents)
            repo_name = signals.get("name", "")
            repo_owner = normalized_url.split("/")[-2]
        except Exception:
            # fallback if fetching fails
            repo_name = ""
            repo_owner = normalized_url.split("/")[-2]

        # Update or create leaderboard entry
        entry, created = LeaderboardEntry.objects.update_or_create(
            repo_url=normalized_url,
            defaults={
                "score_overall": score_overall,
                "rank": rank,
                "repo_name": repo_name,
                "repo_owner": repo_owner,
            }
        )

        return Response(
            {
                "message": "Repository shared successfully!",
                "repo_url": normalized_url,
                "score_overall": score_overall,
                "rank": rank,
                "created": created,
            }
        )
