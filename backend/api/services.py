import requests
import os
from django.conf import settings
from openai import OpenAI
import json 

client = OpenAI(api_key=settings.OPENAI_APIKEY)

def fetch_repo_data(repo_url):
    GITHUB_API = settings.GITHUB_API
    GITHUB_TOKEN = settings.GITHUB_TOKEN
    owner, repo = repo_url.rstrip("/").split("/")[-2:]
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}"
    }

    repo_info = requests.get(
        f"{GITHUB_API}/repos/{owner}/{repo}",
        headers=headers
    ).json()

    contents = requests.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/contents",
        headers=headers
    ).json()

    return repo_info, contents

def extract_repo_signals(repo_info, contents):
    return {
        "name": repo_info.get("name"),
        "description": repo_info.get("description"),
        "stars": repo_info.get("stargazers_count"),
        "forks": repo_info.get("forks_count"),
        "open_issues": repo_info.get("open_issues_count"),
        "language": repo_info.get("language"),
        "default_branch": repo_info.get("default_branch"),

        # structure signals
        "file_count": len(contents),
        "has_readme": any(
            "readme" in f["name"].lower() for f in contents
        ),
        "has_tests": any(
            "test" in f["name"].lower() for f in contents
        ),
        "top_level_files": [f["name"] for f in contents],
    }


def llm_evaluate_repository(signals):
    prompt = f"""
        You are a senior software engineer and technical recruiter.

        Evaluate the following GitHub repository objectively.

        Repository signals:
        {json.dumps(signals, indent=2)}

        RULES:
        - Be honest and strict.
        - Score must reflect real-world recruiter expectations.
        - Do NOT inflate scores.
        - If tests or documentation are missing, penalize clearly.

        Return ONLY valid JSON in the following schema:

        {{
        "score": {{
            "overall": number (0-100),
            "rank": "Beginner" | "Intermediate" | "Advanced",
            "breakdown": {{
            "code_quality": number (0-100),
            "documentation": number (0-100),
            "testing": number (0-100),
            "project_structure": number (0-100),
            "real_world_value": number (0-100)
            }}
        }},
        "summary": "Short recruiter-style evaluation (exaplin the why behind the scores)",
        "roadmap": {{
            "short_term": [string],
            "mid_term": [string],
            "long_term": [string]
        }}
        }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return json.loads(response.choices[0].message.content)
