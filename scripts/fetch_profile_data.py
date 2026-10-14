#!/usr/bin/env python3
"""
Fetch live profile data from various platforms and update profile-data.json.
"""
import json
import os
import subprocess
import sys
import re
from datetime import datetime, timezone

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

def fetch_tryhackme():
    """Fetch TryHackMe data."""
    api_key = os.getenv('TRYHACKME_API_KEY')
    username = os.getenv('TRYHACKME_USERNAME', 'SgtStroopwafel')
    if api_key:
        url = f"https://tryhackme.com/api/v2/user/profile?username={username}"
        headers = [f"Authorization: Bearer {api_key}"]
        data = run_curl(url, headers=headers)
        if data and isinstance(data, dict):
            rank = data.get('rank', {}).get('name', 'N/A')
            points = data.get('score', 0)
            return {'rank': str(rank), 'points': int(points) if isinstance(points, (int, float)) else str(points)}
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
                
                rank = 'N/A'
                points = 'N/A'
                
                # Look for the specific values we know are present
                # Based on inspection: "Top 3%" and "35" with labels "Ranking" and "Capability score"
                rank_elem = page.query_selector('text="Top 3%"')
                if rank_elem:
                    parent = rank_elem.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines = [line.strip() for line in parent_text.split('\n') if line.strip()]
                        if len(lines) == 2:
                            # Check which is the rank (should be the one with %)
                            if '%' in lines[0]:
                                rank = lines[0]
                            elif '%' in lines[1]:
                                rank = lines[1]
                
                score_elem = page.query_selector('text="35"')
                if score_elem:
                    parent = score_elem.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines = [line.strip() for line in parent_text.split('\n') if line.strip()]
                        if len(lines) == 2:
                            # Check which is the points (should be the number)
                            if lines[0] == '35' and not ('%' in lines[1] or any(w in lines[1].lower() for w in ['rank', 'level'])):
                                points = lines[0]
                            elif lines[1] == '35' and not ('%' in lines[0] or any(w in lines[0].lower() for w in ['rank', 'level'])):
                                points = lines[0]
                                
                # Fallback selectors
                if rank == 'N/A':
                    # Look for any element containing rank-like text
                    rank_indicators = page.query_selector_all('text=/Top \\d+%/i, text=/Bronze|Silver|Gold|Platinum|Diamond/i')
                    for elem in rank_indicators:
                        try:
                            parent = elem.evaluate_handle('el => el.parentElement')
                            if parent:
                                parent_text = parent.inner_text().strip()
                                lines = [line.strip() for line in parent_text.split('\n') if line.strip()]
                                if len(lines) == 2:
                                    if '%' in lines[0]:
                                        rank = lines[0]
                                    elif '%' in lines[1]:
                                        rank = lines[1]
                                    break
                        except:
                            pass
                
                if points == 'N/A':
                    # Look for numbers in score/points context
                    score_labels = page.query_selector_all('text=/score|points|capability/i')
                    for label in score_labels:
                        try:
                            parent = label.evaluate_handle('el => el.parentElement')
                            if parent:
                                # Look for number siblings
                                siblings = parent.query_selector_all('*')
                                for sib in siblings:
                                    try:
                                        sib_text = sib.inner_text().strip()
                                        if sib_text.replace(',', '').isdigit() and 1 <= len(sib_text.replace(',', '')) <= 10:
                                            points = sib_text.replace(',', '')
                                            break
                                    except:
                                        pass
                                if points != 'N/A':
                                    break
                        except:
                            pass
                            
                return {'rank': rank.strip(), 'points': points.strip()}
            finally:
                browser.close()
    except Exception as e:
        print(f"TryHackMe scrape error: {e}")
        return {'rank': 'N/A', 'points': 'N/A'}

def fetch_hackthebox():
    """Fetch HackTheBox data."""
    api_key = os.getenv('HACKTHEBOX_API_KEY')
    if api_key:
        url = "https://www.hackthebox.com/api/v4/user/info"
        headers = [f"Authorization: Bearer {api_key}"]
        data = run_curl(url, headers=headers)
        if data and isinstance(data, dict):
            rank = data.get('data', {}).get('profile', {}).get('rank', 'N/A')
            points = data.get('data', {}).get('profile', {}).get('points', 0)
            return {'rank': str(rank), 'points': int(points) if isinstance(points, (int, float)) else str(points)}
    # Fallback to scrape
    return scrape_hackthebox()

def scrape_hackthebox():
    """Scrape HackTheBox public profile."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            try:
                page.goto('https://www.hackthebox.com/profile/01a0f22b-f959-73b9-925c-c2e2e350db97', timeout=20000)
                page.wait_for_timeout(2000)
                
                rank = 'N/A'
                points = 'N/A'
                
                # Look for rank indicators
                rank_indicators = page.query_selector_all('text=/Bronze|Silver|Gold|Platinum|Diamond|Champion|Hero/i')
                for elem in rank_indicators:
                    try:
                        text = elem.inner_text().strip()
                        if text:
                            # Extract the actual rank
                            for r in ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Champion', 'Hero']:
                                if r in text:
                                    rank = r
                                    break
                            if rank == 'N/A':
                                rank = text
                            break
                    except:
                        pass
                
                # Look for points
                point_indicators = page.query_selector_all('text=/\\d[\\d,]*/i')
                for elem in point_indicators:
                    try:
                        text = elem.inner_text().strip()
                        clean_text = text.replace(',', '')
                        if clean_text.isdigit() and 1 <= len(clean_text) <= 10:
                            # Check if it's likely points (not a small ID or count)
                            if int(clean_text) >= 100:  # HTB points are usually 100+
                                # Additional context check
                                parent = elem.evaluate_handle('el => el.parentElement')
                                if parent:
                                    parent_text = parent.inner_text().lower()
                                    if 'point' in parent_text or 'score' in parent_text:
                                        points = clean_text
                                        break
                            elif int(clean_text) >= 1000:  # Definitely points if large number
                                points = clean_text
                                break
                    except:
                        pass
                        
                return {'rank': rank.strip(), 'points': points.strip()}
            finally:
                browser.close()
    except Exception as e:
        print(f"HackTheBox scrape error: {e}")
        return {'rank': 'N/A', 'points': 'N/A'}

def fetch_ctftime():
    """Fetch CTFtime data."""
    # CTFtime does not have a public API, so we scrape.
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
                
                rating = 'N/A'
                position = 'N/A'
                
                # CTFtime user page shows a table with info; we can look for specific labels.
                # Commonly there is a "Rating" field and a "Position" (global rank) field.
                # We'll attempt to extract numbers from the page.
                
                # Look for text containing "Rating" and nearby number.
                rating_elements = page.query_selector_all('text=/Rating/i')
                for elem in rating_elements:
                    try:
                        # Get parent or nearby element that contains the value
                        parent = elem.evaluate_handle('el => el.parentElement')
                        if parent:
                            parent_text = parent.inner_text().strip()
                            # Extract numbers (including decimal)
                            numbers = re.findall(r'[0-9]+\.[0-9]+|[0-9]+', parent_text)
                            if numbers:
                                # Take the first number that looks like a rating (could be like 123.45)
                                rating = numbers[0]
                                break
                    except:
                        pass
                # Look for "Position" or "Rank"
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
                # Fallback: look for any decimal number that could be rating, and any integer that could be position.
                if rating == 'N/A':
                    # Find all numbers with decimal point
                    decimals = re.findall(r'[0-9]+\.[0-9]+', page.content())
                    if decimals:
                        rating = decimals[0]
                if position == 'N/A':
                    # Find all integers, exclude those that are likely years or small numbers.
                    ints = re.findall(r'\b[0-9]+\b', page.content())
                    # Filter out numbers that are likely not a rank (e.g., years like 2020, small counts)
                    for num in ints:
                        if len(num) >= 2 and len(num) <= 6 and not (num.startswith('20') and len(num) == 4):  # simple filter
                            position = num
                            break
                return {'rating': rating.strip(), 'position': position.strip()}
            finally:
                browser.close()
    except Exception as e:
        print(f"CTFtime scrape error: {e}")
        return {'rating': 'N/A', 'position': 'N/A'}

def fetch_itchio():
    """Fetch itch.io data."""
    # itch.io does not have a public API for user stats, so we scrape.
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
                page.wait_for_timeout(2000)
                
                games = 'N/A'
                followers = 'N/A'
                
                # itch.io user profile shows number of games and followers.
                # Look for text like "X games" and "Y followers"
                game_elements = page.query_selector_all('text=/games/i')
                for elem in game_elements:
                    try:
                        parent = elem.evaluate_handle('el => el.parentElement')
                        if parent:
                            parent_text = parent.inner_text().strip()
                            # Extract number
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
                # Fallback: look for any numbers that seem plausible.
                if games == 'N/A':
                    # Look for numbers in contexts that might be game count
                    all_text = page.content()
                    nums = re.findall(r'[0-9]+', all_text)
                    for num in nums:
                        if 1 <= len(num) <= 3 and int(num) < 100:  # reasonable game count
                            games = num
                            break
                if followers == 'N/A':
                    all_text = page.content()
                    nums = re.findall(r'[0-9]+', all_text)
                    for num in nums:
                        if 1 <= len(num) <= 5 and int(num) < 10000:  # reasonable follower count
                            followers = num
                            break
                return {'games': games.strip(), 'followers': followers.strip()}
            finally:
                browser.close()
    except Exception as e:
        print(f"itch.io scrape error: {e}")
        return {'games': 'N/A', 'followers': 'N/A'}

def fetch_cylab():
    """Fetch CyLab data."""
    # For now, return placeholder - CyLab scraping is complex and may require authentication
    # In a production setting, this would need proper implementation
    print("CyLab: Placeholder - no public scraping implemented")
    return {'rank': 'N/A', 'points': 0}

def fetch_microsoft_learn():
    """Fetch Microsoft Learn data."""
    # For now, return placeholder - Microsoft Learn API/scraping is complex
    # In a production setting, this would need proper implementation or API key
    print("Microsoft Learn: Placeholder - no public scraping implemented")
    return {'rank': 'N/A', 'points': 0}

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
    for key in ['tryhackme', 'hackthebox', 'cylab', 'microsoft', 'ctftime', 'itchio', 'generated_at']:
        if key not in existing:
            existing[key] = {} if key != 'generated_at' else ''
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
            existing[key] = fetched
            print(f"  Updated {key}: {fetched}")
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
