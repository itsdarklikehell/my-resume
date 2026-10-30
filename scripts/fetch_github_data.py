#!/usr/bin/env python3
"""
Fetch GitHub data for the portfolio.

Each API source is tracked independently. A successful empty response is a
valid zero; a failed request is marked unavailable and retains its last known
records instead of replacing them with an empty list.
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timezone


def utc_now():
    return datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')


def run_gh_api(endpoint):
    """Run gh api and return parsed JSON, or None when the source is unavailable."""
    result = subprocess.run(
        ['gh', 'api', endpoint, '--paginate'],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Error fetching {endpoint}: {result.stderr}", file=sys.stderr)
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"Invalid JSON from {endpoint}", file=sys.stderr)
        return None


def _repo_owner(repo):
    url = repo.get('url', '') if isinstance(repo, dict) else ''
    prefix = 'https://github.com/'
    if not isinstance(url, str) or not url.startswith(prefix):
        return None
    return url[len(prefix):].split('/', 1)[0].lower()


def _normalize_repo(repo):
    if not isinstance(repo, dict) or repo.get('fork', False) or not repo.get('name'):
        return None
    return {
        'name': repo.get('name', ''),
        'language': repo.get('language') or 'Unknown',
        'stars': repo.get('stargazers_count', 0),
        'description': repo.get('description') or '',
        'updated_at': repo.get('updated_at', ''),
        'url': repo.get('html_url', ''),
        'topics': repo.get('topics', []),
    }


def _source_status(status, record_count, checked_at, last_successful_at, retained=False):
    return {
        'status': status,
        'record_count': record_count,
        'checked_at': checked_at,
        'last_successful_at': last_successful_at,
        'retained': retained,
    }


def fetch_repos(existing_repos=None, previous_status=None, checked_at=None):
    """Fetch personal and organization repositories, retaining failed sources."""
    existing_repos = existing_repos if isinstance(existing_repos, list) else []
    previous_status = previous_status if isinstance(previous_status, dict) else {}
    checked_at = checked_at or utc_now()

    endpoints = [
        ('user_repositories', 'users/itsdarklikehell/repos', 'itsdarklikehell'),
        ('organization_repositories', 'orgs/itsdarklikehell-interactive/repos', 'itsdarklikehell-interactive'),
    ]
    combined = []
    statuses = {}

    for source_name, endpoint, owner in endpoints:
        response = run_gh_api(endpoint)
        if isinstance(response, list):
            records = [_normalize_repo(repo) for repo in response]
            records = [repo for repo in records if repo]
            combined.extend(records)
            statuses[source_name] = _source_status(
                'ok', len(records), checked_at, checked_at, False
            )
        else:
            retained = [
                repo for repo in existing_repos
                if isinstance(repo, dict) and _repo_owner(repo) == owner
            ]
            combined.extend(retained)
            previous = previous_status.get(source_name, {})
            last_success = previous.get('last_successful_at') if isinstance(previous, dict) else None
            statuses[source_name] = _source_status(
                'unavailable', len(retained), checked_at, last_success, bool(retained)
            )

    deduplicated = {}
    for repo in combined:
        key = repo.get('url') or f"{_repo_owner(repo)}/{repo.get('name', '')}"
        if key:
            deduplicated[key] = repo
    result = list(deduplicated.values())
    result.sort(key=lambda item: -(item.get('stars') if isinstance(item.get('stars'), int) else 0))
    return result, statuses


def fetch_contributions(existing_contributions=None, previous_status=None, checked_at=None):
    """Fetch public events; preserve prior events only when the API request fails."""
    existing_contributions = existing_contributions if isinstance(existing_contributions, list) else []
    previous_status = previous_status if isinstance(previous_status, dict) else {}
    checked_at = checked_at or utc_now()
    events = run_gh_api('users/itsdarklikehell/events/public')

    if not isinstance(events, list):
        previous = previous_status.get('contributions', {})
        last_success = previous.get('last_successful_at') if isinstance(previous, dict) else None
        return existing_contributions, _source_status(
            'unavailable', len(existing_contributions), checked_at, last_success,
            bool(existing_contributions),
        )

    contributions = []
    for event in events[:100]:
        if not isinstance(event, dict) or event.get('type') not in {
            'PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'
        }:
            continue
        repo_name = event.get('repo', {}).get('name', '')
        contributions.append({
            'type': event['type'],
            'repo': repo_name,
            'date': event.get('created_at', ''),
            'url': f"https://github.com/{repo_name}" if repo_name else '',
        })
    return contributions, _source_status(
        'ok', len(contributions), checked_at, checked_at, False
    )


def fetch_user_info(existing_user=None, previous_status=None, checked_at=None):
    """Fetch the GitHub user record, retaining the last good record on failure."""
    existing_user = existing_user if isinstance(existing_user, dict) else {}
    previous_status = previous_status if isinstance(previous_status, dict) else {}
    checked_at = checked_at or utc_now()
    data = run_gh_api('users/itsdarklikehell')

    if not isinstance(data, dict):
        previous = previous_status.get('user_profile', {})
        last_success = previous.get('last_successful_at') if isinstance(previous, dict) else None
        return existing_user, _source_status(
            'unavailable', 1 if existing_user else 0, checked_at, last_success,
            bool(existing_user),
        )

    user = {
        'login': data.get('login', ''),
        'name': data.get('name', ''),
        'bio': data.get('bio', ''),
        'public_repos': data.get('public_repos'),
        'followers': data.get('followers'),
        'following': data.get('following'),
        'created_at': data.get('created_at', ''),
        'avatar_url': data.get('avatar_url', ''),
    }
    return user, _source_status('ok', 1, checked_at, checked_at, False)


def generate_skill_data(repos):
    """Generate repository-language counts; no percentages imply proficiency."""
    languages = {}
    for repo in repos:
        language = repo.get('language') or 'Unknown'
        if language == 'Unknown':
            continue
        languages[language] = languages.get(language, 0) + 1
    total = sum(languages.values())
    return {
        language: {
            'repos': count,
            'percentage': round((count / total) * 100) if total else 0,
        }
        for language, count in sorted(languages.items())
    }


def main():
    print("Fetching live GitHub data...")
    output_path = os.path.join(os.path.dirname(__file__), '..', 'github-data.json')
    try:
        with open(output_path, 'r', encoding='utf-8') as file:
            existing = json.load(file)
    except (OSError, json.JSONDecodeError):
        existing = {}

    if not isinstance(existing, dict):
        existing = {}
    previous_status = existing.get('source_status', {})
    if not isinstance(previous_status, dict):
        previous_status = {}
    checked_at = utc_now()

    repos, repo_status = fetch_repos(
        existing.get('repos', []), previous_status, checked_at
    )
    contributions, contribution_status = fetch_contributions(
        existing.get('contributions', []), previous_status, checked_at
    )
    user, user_status = fetch_user_info(
        existing.get('user', {}), previous_status, checked_at
    )
    source_status = {
        **repo_status,
        'contributions': contribution_status,
        'user_profile': user_status,
    }
    skills = generate_skill_data(repos)
    data = {
        'generated_at': checked_at,
        'source_status': source_status,
        'user': user,
        'repos': repos,
        'contributions': contributions,
        'skills': skills,
        'stats': {
            'total_repos': len(repos),
            'total_stars': sum(
                repo.get('stars', 0) for repo in repos
                if isinstance(repo.get('stars'), int)
            ),
            'languages': len(skills),
        },
    }

    with open(output_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)

    print(f"Generated {output_path}")
    print(f"  Repositories: {len(repos)}")
    print(f"  Stars: {data['stats']['total_stars']}")
    print(f"  Languages: {len(skills)}")
    print(f"  Contributions: {len(contributions)}")
    for source, status in source_status.items():
        print(f"  {source}: {status['status']} ({status['record_count']} records)")


if __name__ == '__main__':
    main()
