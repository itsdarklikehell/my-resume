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
from playwright.sync_api import sync_playwright

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
    """Fetch TryHackMe data. Try API if key available, else fallback to Playwright scrape."""
    api_key = os.getenv('TRYHACKME_API_KEY')
    username = os.getenv('TRYHACKME_USERNAME', 'SgtStroopwafel')
    if api_key:
        # Use API
        url = f"https://tryhackme.com/api/v2/user/profile?username={username}"
        headers = [f"Authorization: Bearer {api_key}"]
        data = run_curl(url, headers=headers)
        if data and isinstance(data, dict):
            rank = data.get('rank', {}).get('name', 'N/A')
            points = data.get('score', 0)
            return {'rank': rank, 'points': points}
        else:
            print("TryHackMe: API request failed; falling back to scrape.")
            # fall through to scrape
    # Scrape via Playwright
    return scrape_tryhackme(username)

def fetch_hackthebox():
    """Fetch HackTheBox data. Try API if key available."""
    api_key = os.getenv('HACKTHEBOX_API_KEY')
    if api_key:
        url = "https://www.hackthebox.com/api/v4/user/info"
        headers = [f"Authorization: Bearer {api_key}"]
        data = run_curl(url, headers=headers)
        if data and isinstance(data, dict):
            rank = data.get('data', {}).get('profile', {}).get('rank', 'N/A')
            points = data.get('data', {}).get('profile', {}).get('points', 0)
            return {'rank': rank, 'points': points}
        else:
            print("HackTheBox: API request failed; no fallback scraping implemented.")
            return None
    else:
        print("HackTheBox: No API key provided; skipping live fetch.")
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

def scrape_tryhackme(username):
    """Scrape TryHackMe public profile for rank and points using Playwright."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(f'https://tryhackme.com/p/{username}', timeout=20000)
            # Wait for rank element
            page.wait_for_selector('.profile-stats-styles__StyledProfileStatValue-sc-a1b7734d-4', timeout=5000)
            rank_elem = page.query_selector('.profile-stats-styles__StyledProfileStatValue-sc-a1b7734d-4')
            rank = rank_elem.inner_text() if rank_elem else 'N/A'
            points = 'N/A'
            # Try to find points/score via label
            stat_blocks = page.query_selector_all('.profile-stats-styles__StyledProfileStat-sc-a1b7734d-2')
            for block in stat_blocks:
                label = block.query_selector('.profile-stats-styles__StyledProfileStatLabel-sc-a1b7734d-3')
                if label:
                    label_text = label.inner_text().lower()
                    if 'score' in label_text or 'points' in label_text:
                        value = block.query_selector('.profile-stats-styles__StyledProfileStatValue-sc-a1b7734d-4')
                        if value:
                            points = value.inner_text()
                        break
            if points == 'N/A':
                import re
                m = re.search(r'Score\\s*[\\:\\-]?\\s*(\\d+)', page.content(), re.I)
                if m:
                    points = m.group(1)
        except Exception as e:
            print(f"TryHackMe scrape error: {e}")
            rank = 'N/A'
            points = 'N/A'
        finally:
            browser.close()
    return {'rank': rank.strip(), 'points': points.strip()}

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