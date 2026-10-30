#!/usr/bin/env python3
"""
Fetch live GitHub data and generate a JSON file for the resume page.
This script is called by the GitHub Actions workflow.
"""

import json
import os
import subprocess
import sys
from datetime import datetime

def run_gh_api(endpoint):
    """Run gh api command and return parsed JSON."""
    result = subprocess.run(
        ['gh', 'api', endpoint, '--paginate'],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"Error fetching {endpoint}: {result.stderr}", file=sys.stderr)
        return []
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return []

def fetch_repos():
    """Fetch all non-fork repos for the user and org."""
    repos = run_gh_api('users/itsdarklikehell/repos') + run_gh_api('orgs/itsdarklikehell-interactive/repos')
    filtered = []
    for r in repos:
        if r.get('fork', False):
            continue
        filtered.append({
            'name': r['name'],
            'language': r.get('language') or 'Unknown',
            'stars': r.get('stargazers_count', 0),
            'description': r.get('description') or '',
            'updated_at': r.get('updated_at', ''),
            'url': r.get('html_url', ''),
            'topics': r.get('topics', [])
        })
    filtered.sort(key=lambda x: -x['stars'])
    return filtered

def fetch_contributions():
    """Fetch recent contribution activity."""
    # Get events for the user
    events = run_gh_api('users/itsdarklikehell/events/public')
    contributions = []
    for event in events[:100]:
        if event.get('type') in ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent']:
            repo_name = event.get('repo', {}).get('name', '')
            contributions.append({
                'type': event['type'],
                'repo': repo_name,
                'date': event.get('created_at', ''),
                'url': f"https://github.com/{repo_name}"
            })
    return contributions

def fetch_user_info():
    """Fetch user profile info."""
    result = subprocess.run(
        ['gh', 'api', 'users/itsdarklikehell'],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        data = json.loads(result.stdout)
        return {
            'login': data.get('login', ''),
            'name': data.get('name', ''),
            'bio': data.get('bio', ''),
            'public_repos': data.get('public_repos', 0),
            'followers': data.get('followers', 0),
            'following': data.get('following', 0),
            'created_at': data.get('created_at', ''),
            'avatar_url': data.get('avatar_url', '')
        }
    return {}

def generate_skill_data(repos):
    """Generate skill percentages based on repo languages."""
    langs = {}
    for r in repos:
        lang = r['language']
        if lang not in langs:
            langs[lang] = {'count': 0, 'stars': 0}
        langs[lang]['count'] += 1
        langs[lang]['stars'] += r['stars']
    
    # Calculate percentages based on repo count
    total = len(repos)
    skills = {}
    for lang, stats in langs.items():
        if lang == 'Unknown':
            continue
        pct = min(95, int((stats['count'] / total) * 100 * 2))  # Scale up a bit
        skills[lang] = {
            'percentage': pct,
            'repos': stats['count'],
            'stars': stats['stars']
        }
    
    return skills

def main():
    print("Fetching live GitHub data...")
    
    repos = fetch_repos()
    contributions = fetch_contributions()
    user_info = fetch_user_info()
    skills = generate_skill_data(repos)
    
    data = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'user': user_info,
        'repos': repos,
        'contributions': contributions,
        'skills': skills,
        'stats': {
            'total_repos': len(repos),
            'total_stars': sum(r['stars'] for r in repos),
            'languages': len([l for l in set(r['language'] for r in repos) if l != 'Unknown'])
        }
    }
    
    output_path = os.path.join(os.path.dirname(__file__), '..', 'github-data.json')
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Generated {output_path}")
    print(f"  Repos: {data['stats']['total_repos']}")
    print(f"  Stars: {data['stats']['total_stars']}")
    print(f"  Languages: {data['stats']['languages']}")
    print(f"  Contributions: {len(contributions)}")

if __name__ == '__main__':
    main()
