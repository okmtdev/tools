import fire
import os
import httpx
from dotenv import load_dotenv as load
from collections import defaultdict

load()

class SubCommand:
    GH_OWNER = os.getenv("GH_OWNER")
    GH_REPO = os.getenv("GH_REPO")
    GH_TOKEN = os.getenv("GH_TOKEN")
    SINCE = os.getenv("SINCE")
    UNTIL = os.getenv("UNTIL")

    def get_commits(self, owner: str, repo: str, since: str, until: str, headers: dict):
        commits_url = f'https://api.github.com/repos/{owner}/{repo}/commits'
        params = {
            'since': since,
            'until': until,
            'per_page': 100,
        }
        commits = []
        page = 1
        with httpx.Client() as client:
            while True:
                params['page'] = page
                response = client.get(commits_url, headers=headers, params=params)
                data = response.json()
                if not data:
                    break
                commits.extend(data)
                page += 1
        return commits

    def get_user_stats(self, commits: list, owner: str, repo: str, headers: dict):
        user_stats = defaultdict(lambda: {'commits': 0, 'additions': 0, 'deletions': 0})
        with httpx.Client() as client:
            for commit in commits:
                sha = commit['sha']
                author = commit['commit']['author']['name']
                commit_url = f'https://api.github.com/repos/{owner}/{repo}/commits/{sha}'
                commit_data = client.get(commit_url, headers=headers).json()
                stats = commit_data['stats']
                user_stats[author]['commits'] += 1
                user_stats[author]['additions'] += stats['additions']
                user_stats[author]['deletions'] += stats['deletions']
        return user_stats

    def statics_by_user(self):
        print(f"* {self.SINCE} - {self.UNTIL} *")

        headers = {'Authorization': f'token {self.GH_TOKEN}'}
        commits = self.get_commits(self.GH_OWNER, self.GH_REPO, self.SINCE, self.UNTIL, headers)
        user_stats = self.get_user_stats(commits, self.GH_OWNER, self.GH_REPO, headers)

        for user, stats in user_stats.items():
            print(f"User: {user}")
            print(f"  Commits: {stats['commits']}")
            print(f"  Added lines: {stats['additions']}")
            print(f"  Deleted lines: {stats['deletions']}\n")

if __name__ == "__main__":
    fire.Fire(SubCommand)
