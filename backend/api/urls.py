from django.urls import path
from .views import AnalyzeRepoView, LeaderBoardView

urlpatterns = [
    path("analyze-repo/", AnalyzeRepoView.as_view(), name='analyze-repo'),
    path("leaderboard/", LeaderBoardView.as_view(), name='leaderboard'),
]
