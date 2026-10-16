#!/usr/bin/env python3
"""
Fetch live profile data from various platforms and update profile-data.json.

Platforms supported: TryHackMe, HackTheBox, CyLab Academy, Microsoft Learn,
CTFtime, itch.io.

Each platform entry in profile-data.json uses a consistent schema with the
following fields (all default to 'N/A' when not publicly available):

    level, xp, xp_last_year, weekly_streak, top_interests, skills,
    event_participation, yearly_activity, reputation_points, top_tools,
    badges, skill_matrix

Platform-specific extra fields are preserved underneath (e.g. tryhackme.rank,
tryhackme.highest_league, ctftime.position, itchio.games, itchio.followers).

The script tries each platform's public API first; if no API key is configured
or the API fails, it falls back to a headless-browser (Playwright) scrape.  If
both fail, existing values are retained.  A failed scrape in CI never
overwrites previously good scraped data (see the ``has_data`` guard in
``main()``).
"""
import json
import os
import subprocess
import sys
import re
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Canonical field set — every platform entry contains all of these keys.
# ---------------------------------------------------------------------------
CANONICAL_FIELDS = [
    'level', 'xp', 'xp_last_year', 'weekly_streak', 'top_interests', 'skills',
    'event_participation', 'yearly_activity', 'reputation_points', 'top_tools',
    'badges', 'skill_matrix',
]


def _blank_platform():
    """Return a fresh platform dict with every canonical field set to 'N/A'."""
    return {field: 'N/A' for field in CANONICAL_FIELDS}


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
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"Warning: response from {url} is not JSON", file=sys.stderr)
        return None


# ===========================================================================
# TryHackMe
# ===========================================================================
def fetch_tryhackme():
    """Fetch TryHackMe data via API or headless-browser scrape."""
    api_key = os.getenv('TRYHACKME_API_KEY')
    username = os.getenv('TRYHACKME_USERNAME', 'SgtStroopwafel')
    if api_key:
        url = f"https://tryhackme.com/api/v2/user/profile?username={username}"
        headers = [f"Authorization: Bearer ***"]
        data = run_curl(url, headers=headers)
        if data and isinstance(data, dict):
            d = _blank_platform()
            rank = data.get('rank', {}).get('name', 'N/A')
            points = data.get('score', 0)
            d['rank'] = str(rank)
            d['points'] = int(points) if isinstance(points, (int, float)) else str(points)
            d['level'] = str(rank)
            d['xp'] = str(points)
            d['reputation_points'] = str(points)
            d['badges'] = str(rank)
            return d
    # Fallback to scrape
    return scrape_tryhackme(username)


def scrape_tryhackme(username):
    """Scrape TryHackMe public profile."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            try:
                page.goto(f'https://tryhackme.com/p/{username}', timeout=20000)
                page.wait_for_timeout(2000)

                d = _blank_platform()

                rank = 'N/A'
                points = 'N/A'
                highest_league = 'N/A'
                highest_streak = 'N/A'

                # --- rank / capability score ---
                rank_elem = page.query_selector('text="Ranking"')
                if rank_elem:
                    parent = rank_elem.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines = [line.strip() for line in parent_text.split('\n') if line.strip()]
                        if len(lines) == 2:
                            if '%' in lines[0]:
                                rank = lines[0]
                            elif '%' in lines[1]:
                                rank = lines[1]

                score_elem = page.query_selector('text="Capability score"')
                if score_elem:
                    parent = score_elem.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines = [line.strip() for line in parent_text.split('\n') if line.strip()]
                        for line in lines:
                            if line != 'Capability score' and line.replace(',', '').isdigit():
                                points = line.replace(',', '')
                                break

                # --- highest league ---
                league_label = page.query_selector('text="Highest league"')
                if league_label:
                    parent = league_label.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines_l = [line.strip() for line in parent_text.split('\n') if line.strip()]
                        for line in lines_l:
                            if line != 'Highest league':
                                highest_league = line
                                break

                # --- highest streak ---
                streak_label = page.query_selector('text="Highest streak"')
                if streak_label:
                    parent = streak_label.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines_l = [line.strip() for line in parent_text.split('\n') if line.strip()]
                        for line in lines_l:
                            if line != 'Highest streak' and line.isdigit():
                                highest_streak = line
                                break

                d['rank'] = rank.strip()
                d['points'] = points.strip()
                d['highest_league'] = highest_league.strip()
                d['highest_streak'] = highest_streak.strip()
                # Map available data onto canonical fields
                d['level'] = d['rank']
                d['xp'] = d['points']
                d['weekly_streak'] = d['highest_streak']
                d['reputation_points'] = d['points']
                d['badges'] = d['highest_league']

                return d
            finally:
                browser.close()
    except Exception as e:
        print(f"TryHackMe scrape error: {e}")
        return _blank_platform()


# ===========================================================================
# HackTheBox
# ===========================================================================
def fetch_hackthebox():
    """Fetch HackTheBox data via API or headless-browser scrape."""
    api_key = os.getenv('HACKTHEBOX_API_KEY')
    if api_key:
        url = "https://www.hackthebox.com/api/v4/user/info"
        headers = [f"Authorization: Bearer ***"]
        data = run_curl(url, headers=headers)
        if data and isinstance(data, dict):
            d = _blank_platform()
            rank = data.get('data', {}).get('profile', {}).get('rank', 'N/A')
            points = data.get('data', {}).get('profile', {}).get('points', 0)
            d['rank'] = str(rank)
            d['points'] = int(points) if isinstance(points, (int, float)) else str(points)
            d['level'] = d['rank']
            d['xp'] = d['points']
            d['reputation_points'] = d['points']
            d['badges'] = d['rank']
            return d
    # Fallback to scrape
    return scrape_hackthebox()


def scrape_hackthebox():
    """Scrape HackTheBox public profile (usually blocked by Cloudflare)."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            try:
                page.goto('https://www.hackthebox.com/profile/01a0f22b-f959-73b9-925c-c2e2e350db97',
                          timeout=20000, wait_until='domcontentloaded')
                page.wait_for_timeout(3000)
                d = _blank_platform()
                # Check whether we hit a login/Cloudflare wall
                content = page.content()
                if 'isLoggedin' in content and 'false' in content:
                    print("HackTheBox: not logged in — profile data not public")
                    return d
                # If we get here, try to extract whatever is visible
                return d
            finally:
                browser.close()
    except Exception as e:
        print(f"HackTheBox scrape error: {e}")
        return _blank_platform()


# ===========================================================================
# CyLab Academy
# ===========================================================================
def fetch_cylab():
    """Fetch CyLab data (placeholder — requires authentication)."""
    print("CyLab: Placeholder — no public scraping implemented")
    return _blank_platform()


# ===========================================================================
# Microsoft Learn
# ===========================================================================
def fetch_microsoft_learn():
    """Fetch Microsoft Learn data (placeholder — requires login/specific user)."""
    print("Microsoft Learn: Placeholder — no public scraping implemented")
    return _blank_platform()


# ===========================================================================
# CTFtime
# ===========================================================================
def fetch_ctftime():
    """Fetch CTFtime data (no public API — scrape)."""
    return scrape_ctftime()


def scrape_ctftime():
    """Scrape CTFtime public profile for rating and position."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            try:
                page.goto('https://ctftime.org/user/127159', timeout=20000)
                page.wait_for_timeout(2000)

                d = _blank_platform()

                rating = 'N/A'
                position = 'N/A'

                rating_elements = page.query_selector_all('text=/Rating/i')
                for elem in rating_elements:
                    try:
                        parent = elem.evaluate_handle('el => el.parentElement')
                        if parent:
                            parent_text = parent.inner_text().strip()
                            numbers = re.findall(r'[0-9]+\.[0-9]+|[0-9]+', parent_text)
                            if numbers:
                                rating = numbers[0]
                                break
                    except:
                        pass

                position_elements = page.query_selector_all('text=/Position|Rank/i')
                for elem in position_elements:
                    try:
                        parent = elem.evaluate_handle('el => el.parentElement')
                        if parent:
                            parent_text = parent.inner_text().strip()
                            numbers = re.findall(r'[0-9]+', parent_text)
                            if numbers:
                                position = numbers[0]
                                break
                    except:
                        pass

                # Fallback
                if rating == 'N/A':
                    decimals = re.findall(r'[0-9]+\.[0-9]+', page.content())
                    if decimals:
                        rating = decimals[0]
                if position == 'N/A':
                    ints = re.findall(r'\b[0-9]+\b', page.content())
                    for num in ints:
                        if len(num) >= 2 and len(num) <= 6 and not (num.startswith('20') and len(num) == 4):
                            position = num
                            break

                d['rating'] = rating.strip()
                d['position'] = position.strip()
                # Map onto canonical fields
                d['xp'] = d['rating']
                d['reputation_points'] = d['rating']
                d['event_participation'] = d['position']

                return d
            finally:
                browser.close()
    except Exception as e:
        print(f"CTFtime scrape error: {e}")
        return _blank_platform()


# ===========================================================================
# itch.io
# ===========================================================================
def fetch_itchio():
    """Fetch itch.io data (no public API — scrape)."""
    return scrape_itchio()


def scrape_itchio():
    """Scrape itch.io public profile for game count and followers."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            try:
                page.goto('https://sgtstroopwafel.itch.io/', timeout=20000)
                page.wait_for_timeout(3000)

                d = _blank_platform()

                games = 'N/A'
                followers = 'N/A'

                game_elements = page.query_selector_all('text=/games/i')
                for elem in game_elements:
                    try:
                        parent = elem.evaluate_handle('el => el.parentElement')
                        if parent:
                            parent_text = parent.inner_text().strip()
                            numbers = re.findall(r'[0-9]+', parent_text)
                            if numbers:
                                games = numbers[0]
                                break
                    except:
                        pass

                follower_elements = page.query_selector_all('text=/followers/i')
                for elem in follower_elements:
                    try:
                        parent = elem.evaluate_handle('el => el.parentElement')
                        if parent:
                            parent_text = parent.inner_text().strip()
                            numbers = re.findall(r'[0-9]+', parent_text)
                            if numbers:
                                followers = numbers[0]
                                break
                    except:
                        pass

                # Fallback
                if games == 'N/A':
                    all_text = page.content()
                    nums = re.findall(r'[0-9]+', all_text)
                    for num in nums:
                        if 1 <= len(num) <= 3 and int(num) < 100:
                            games = num
                            break
                if followers == 'N/A':
                    all_text = page.content()
                    nums = re.findall(r'[0-9]+', all_text)
                    for num in nums:
                        if 1 <= len(num) <= 5 and int(num) < 10000:
                            followers = num
                            break

                d['games'] = games.strip()
                d['followers'] = followers.strip()
                # Map onto canonical fields
                d['xp'] = d['followers']
                d['reputation_points'] = d['followers']
                d['event_participation'] = d['games']

                return d
            finally:
                browser.close()
    except Exception as e:
        print(f"itch.io scrape error: {e}")
        return _blank_platform()


# ===========================================================================
# Main
# ===========================================================================
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
    # Ensure subkeys exist with canonical fields backfilled
    for key in ['tryhackme', 'hackthebox', 'cylab', 'microsoft', 'ctftime', 'itchio', 'generated_at']:
        if key not in existing:
            existing[key] = {} if key != 'generated_at' else ''
        elif key != 'generated_at':
            # Backfill any missing canonical fields on existing entries
            for field in CANONICAL_FIELDS:
                existing[key].setdefault(field, 'N/A')
    # Attempt to fetch each platform
    platforms = [
        ('tryhackme', fetch_tryhackme),
        ('hackthebox', fetch_hackthebox),
        ('cylab', fetch_cylab),
        ('microsoft', fetch_microsoft_learn),
        ('ctftime', fetch_ctftime),
        ('itchio', fetch_itchio),
    ]
    for key, fetch_func in platforms:
        print(f"Fetching {key}...")
        fetched = fetch_func()
        if fetched is not None:
            # Only update if the fetched data contains real (non-N/A, non-zero)
            # values, so a failed scrape in CI doesn't overwrite previously
            # good live data.
            has_data = any(
                v != 'N/A' and v != 0
                for v in fetched.values()
                if isinstance(v, (str, int))
            )
            if has_data:
                # Merge fetched fields over existing (preserves any extra
                # canonical fields that weren't re-scraped this run)
                merged = dict(existing.get(key, {}))
                merged.update(fetched)
                # Ensure all canonical fields exist
                for field in CANONICAL_FIELDS:
                    merged.setdefault(field, 'N/A')
                existing[key] = merged
                print(f"  Updated {key}: {merged}")
            else:
                print(f"  Keeping existing {key}: {existing.get(key)} (fetched all N/A)")
        else:
            print(f"  Keeping existing {key}: {existing.get(key)}")
    # Update timestamp
    existing['generated_at'] = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    # Write back
    with open(profile_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, indent=2)
    print(f"Updated {profile_path}")


if __name__ == '__main__':
    main()
