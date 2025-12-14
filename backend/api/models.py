from django.db import models

# Create your models here.


class LeaderboardEntry(models.Model):
    repo_name = models.CharField(max_length=255)
    repo_owner = models.CharField(max_length=255)
    repo_url = models.URLField(unique=True)
    score_overall = models.PositiveSmallIntegerField()  # 0-100
    rank = models.CharField(max_length=50)  # Bronze / Silver / Gold / Beginner / Intermediate / Advanced
    analyzed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score_overall', 'repo_name']
        unique_together = ('repo_owner', 'repo_name')

    def __str__(self):
        return f"{self.repo_owner}/{self.repo_name} ({self.score_overall})"