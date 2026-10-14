#!/usr/bin/env python3
"""
Fetch live profile data from various platforms and update profile-data.json.
This script is called by the GitHub Actions workflow.
It expects optional API keys as environment variables:
- TRYHACKME_API_KEY (if needed)
- HACKTHEBOX_API_KEY (if needed)
- CYLAB_API_KEY (if needed)
- MICROSOFTLEARN_API_KEY (if needed)
If API keys are not provided, the script will retain existing values for those platforms.
"""
import json
import os
import subprocess
import sys
from datetime import datetime

def run_curl(url, headers=None):
    """Run curl and return parsed JSON if possible, else None."""
    cmd = ['curl', '-s']
    if headers:
        for h in headers:
            cmd.extend(['-H', h])
    cmd.append(url)
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error fetching {url}: {result.stderr}", file=sys.stderr)
        return None
    # Try to parse JSON
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        # Not JSON; maybe the endpoint requires challenge or returns HTML
        print(f"Warning: response from {url} is not JSON", file=sys.stderr)
        return None

def fetch_tryhackme():
    """Fetch TryHackMe data. Placeholder: requires API key or not publicly available."""
    # Example endpoint (if available)
    url = f"https://tryhackme.com/api/v2/user/profile?username={os.getenv('TRYHACKME_USERNAME', 'SgtStroopwafel')}"
    headers = []
    api_key = os.getenv('TRYHACKME_API_KEY')
    if api_key:
        headers.append(f"Authorization: Bearer {api_key}")
    else:
        # If no API key, we cannot reliably fetch; return None to indicate skip
        print("TryHackMe: No API key provided; skipping live fetch.")
        return None
    data = run_curl(url, headers=headers if headers else None)
    if data and isinstance(data, dict):
        # Adjust according to actual API response structure
        rank = data.get('rank', {}).get('name', 'N/A')
        points = data.get('score', 0)
        return {'rank': rank, 'points': points}
    return None

def fetch_hackthebox():
    """Fetch HackTheBox data. Placeholder."""
    url = "https://www.hackthebox.com/api/v4/user/info"
    headers = []
    api_key = os.getenv('HACKTHEBOX_API_KEY')
    if api_key:
        headers.append(f"Authorization: Bearer {api_key}")
    else:
        print("HackTheBox: No API key provided; skipping live fetch.")
        return None
    data = run_curl(url, headers=headers if headers else None)
    if data and isinstance(data, dict):
        # Adjust according to actual API response
        rank = data.get('data', {}).get('profile', {}).get('rank', 'N/A')
        points = data.get('data', {}).get('profile', {}).get('points', 0)
        return {'rank': rank, 'points': points}
    return None

def fetch_cylab():
    """Fetch CyLab data. Placeholder."""
    # No known public API; placeholder
    print("CyLab: No known public API; skipping.")
    return None

def fetch_microsoft_learn():
    """Fetch Microsoft Learn data. Placeholder."""
    url = f"https://learn.microsoft.com/api/users/{os.getenv('MICROSOFTLEARN_USERNAME', 'SgtStroopwafel')}/profile"
    headers = []
    api_key = os.getenv('MICROSOFTLEARN_API_KEY')
    if api_key:
        headers.append(f"Authorization: Bearer {api_key}")
    else:
        print("Microsoft Learn: No API key provided; skipping live fetch.")
        return None
    data = run_curl(url, headers=headers if headers else None)
    if data and isinstance(data, dict):
        # Adjust according to actual API response
        rank = data.get('rank', 'N/A')
        points = data.get('points', 0)
        return {'rank': rank, 'points': points}
    return None

def main():
    print("Fetching live profile data...")
    profile_path = os.path.join(os.path.dirname(__file__), '..', 'profile-data.json')
    # Load existing data to preserve fields if fetch fails
    try:
        with open(profile_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except Exception as e:
        print(f"Error reading existing {profile_path}: {e}", file=sys.stderr)
        existing = {}
    # Ensure subkeys exist
    for key in ['tryhackme', 'hackthebox', 'cylab', 'microsoft', 'generated_at']:
        if key not in existing:
            existing[key] = {} if key != 'generated_at' else ''
    # Attempt to fetch each platform
    platforms = [
        ('tryhackme', fetch_tryhackme),
        ('hackthebox', fetch_hackthebox),
        ('cylab', fetch_cylab),
        ('microsoft', fetch_microsoft_learn),
    ]
    for key, fetch_func in platforms:
        print(f"Fetching {key}...")
        fetched = fetch_func()
        if fetched is not None:
            existing[key] = fetched
            print(f"  Updated {key}: {fetched}")
        else:
            print(f"  Keeping existing {key}: {existing.get(key)}")
    # Update timestamp
    existing['generated_at'] = datetime.utcnow().isoformat() + 'Z'
    # Write back
    with open(profile_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, indent=2)
    print(f"Updated {profile_path}")

if __name__ == '__main__':
    main()