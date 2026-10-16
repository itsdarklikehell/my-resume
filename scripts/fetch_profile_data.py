#!/usr/bin/env python3
"""
Fetch live profile data from various platforms and update profile-data.json.

Platforms supported: TryHackMe, HackTheBox, CyLab Academy, Microsoft Learn,
CTFtime, itch.io, Codewars, DEV.to, LeetCode, Stack Overflow.

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
    # Additional scrapeable fields
    'badges_count', 'paths_completed', 'rooms_completed', 'rooms_created',
    'team_rankings', 'writeups_count', 'events_attended', 'kata_completed',
    'top_languages', 'recent_articles', 'comment_count',
    'gold_badges', 'silver_badges', 'bronze_badges', 'top_tags',
    'answer_count', 'question_count', 'game_rating', 'game_jams',
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

                # --- skill matrix ---
                skill_matrix = []
                # Try broader class match to capture all skill level elements
                skill_elems = page.query_selector_all('[class*="skill-matrix-card-styles"]')
                for elem in skill_elems:
                    try:
                        text = elem.inner_text().strip()
                    except Exception:
                        continue
                    known_levels = ['Entry level', 'Foundational', 'Security Analyst', 'Penetration Tester', 'Security Engineer']
                    if text in known_levels and text not in skill_matrix:
                        skill_matrix.append(text)
                d['skill_matrix'] = ', '.join(skill_matrix) if skill_matrix else 'N/A'

                # --- badges count ---
                badges_count = 'N/A'
                badges_elem = page.query_selector('text="Badges"')
                if badges_elem:
                    parent = badges_elem.evaluate_handle('el => el.parentElement')
                    if parent:
                        parent_text = parent.inner_text().strip()
                        lines = [l.strip() for l in parent_text.split('\n') if l.strip()]
                        for line in lines:
                            if line != 'Badges' and line.replace(',', '').isdigit():
                                badges_count = line
                                break
                d['badges_count'] = badges_count

                # --- paths completed ---
                paths_completed = 'N/A'
                page_text = page.evaluate('() => document.body.innerText')
                path_match = re.search(r'(\d+)\s+Path completed', page_text)
                if path_match:
                    paths_completed = path_match.group(1)
                d['paths_completed'] = paths_completed

                # --- rooms completed / created / saved ---
                rooms_completed = 'N/A'
                rooms_created = 'N/A'
                rooms_saved = 'N/A'
                rooms_match = re.search(r'(\d+)\s+Completed\s+(\d+)\s+Created\s+(\d+)\s+Saved', page_text)
                if rooms_match:
                    rooms_completed = rooms_match.group(1)
                    rooms_created = rooms_match.group(2)
                    rooms_saved = rooms_match.group(3)
                d['rooms_completed'] = rooms_completed
                d['rooms_created'] = rooms_created
                d['rooms_saved'] = rooms_saved

                # --- yearly activity ---
                yearly_activity = 'N/A'
                page_text = page.evaluate('() => document.body.innerText')
                m = None
                import re as _re
                m = _re.search(r'(\d+)\s+events?\s+in\s+the\s+last\s+year', page_text)
                if m:
                    yearly_activity = f"{m.group(1)} events in the last year"
                d['yearly_activity'] = yearly_activity

                # --- top tools ---
                top_tools = []
                page_text = page.evaluate('() => document.body.innerText')
                known_tools = ['Web', 'Windows', 'MacOs', 'Hydra', 'Volatility', 'Dirbuster', 'Burp Suite', 'Wireshark', 'Nmap', 'Metasploit', 'John the Ripper', 'Hashcat']
                for tool in known_tools:
                    if tool in page_text:
                        top_tools.append(tool)
                d['top_tools'] = ', '.join(top_tools) if top_tools else 'N/A'

                # --- badges breakdown (gold/silver/bronze) ---
                gold_badges = 'N/A'
                silver_badges = 'N/A'
                bronze_badges = 'N/A'
                badge_text = page.evaluate('() => document.body.innerText')
                gb_match = re.search(r'(\d+)\s*Gold\s*badge', badge_text, re.IGNORECASE)
                if gb_match:
                    gold_badges = gb_match.group(1)
                sb_match = re.search(r'(\d+)\s*Silver\s*badge', badge_text, re.IGNORECASE)
                if sb_match:
                    silver_badges = sb_match.group(1)
                bb_match = re.search(r'(\d+)\s*Bronze\s*badge', badge_text, re.IGNORECASE)
                if bb_match:
                    bronze_badges = bb_match.group(1)
                d['gold_badges'] = gold_badges
                d['silver_badges'] = silver_badges
                d['bronze_badges'] = bronze_badges

                # --- team rankings ---
                team_rankings = 'N/A'
                tm_match = re.search(r'Team[s]?\s*:?\s*([^\n]+)', page_text)
                if tm_match:
                    team_rankings = tm_match.group(1).strip()
                d['team_rankings'] = team_rankings

                # --- writeups count ---
                writeups_count = 'N/A'
                wu_match = re.search(r'(\d+)\s+writeups?', page_text, re.IGNORECASE)
                if wu_match:
                    writeups_count = wu_match.group(1)
                d['writeups_count'] = writeups_count

                # --- events attended ---
                events_attended = 'N/A'
                ea_match = re.search(r'(\d+)\s+events?\s+attended', page_text, re.IGNORECASE)
                if ea_match:
                    events_attended = ea_match.group(1)
                d['events_attended'] = events_attended

                # --- xp last year ---
                xp_last_year = 'N/A'
                xy_match = re.search(r'XP\s+last\s+year[:\s]*(\d+)', page_text, re.IGNORECASE)
                if xy_match:
                    xp_last_year = xy_match.group(1)
                d['xp_last_year'] = xp_last_year

                # --- top interests ---
                top_interests = 'N/A'
                ti_match = re.search(r'Interests?\s*:?\s*([^\n]+)', page_text, re.IGNORECASE)
                if ti_match:
                    top_interests = ti_match.group(1).strip()
                d['top_interests'] = top_interests

                # --- skills ---
                skills = 'N/A'
                sk_match = re.search(r'Skills?\s*:?\s*([^\n]+)', page_text, re.IGNORECASE)
                if sk_match:
                    skills = sk_match.group(1).strip()
                d['skills'] = skills

                # --- event participation ---
                event_participation = 'N/A'
                ep_match = re.search(r'Event\s+participation[:\s]*(\d+)', page_text, re.IGNORECASE)
                if ep_match:
                    event_participation = ep_match.group(1)
                d['event_participation'] = event_participation

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
                # --- team rankings ---
                team_rankings = 'N/A'
                page_text = page.evaluate('() => document.body.innerText')
                # Look for team names and rankings
                team_match = re.search(r'Team[s]?\s*:\s*([^\n]+)', page_text)
                if team_match:
                    team_rankings = team_match.group(1).strip()
                d['team_rankings'] = team_rankings

                # --- writeups count ---
                writeups_count = 'N/A'
                wu_match = re.search(r'(\d+)\s+writeups?', page_text, re.IGNORECASE)
                if wu_match:
                    writeups_count = wu_match.group(1)
                d['writeups_count'] = writeups_count

                # --- events attended ---
                events_attended = 'N/A'
                ea_match = re.search(r'(\d+)\s+events?\s+attended', page_text, re.IGNORECASE)
                if ea_match:
                    events_attended = ea_match.group(1)
                d['events_attended'] = events_attended

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
                # --- game rating ---
                game_rating = 'N/A'
                page_text = page.evaluate('() => document.body.innerText')
                rating_match = re.search(r'(\d[\.,]\d)\s*/\s*5', page_text)
                if rating_match:
                    game_rating = rating_match.group(1).replace(',', '.')
                d['game_rating'] = game_rating

                # --- game jams ---
                game_jams = 'N/A'
                jam_match = re.search(r'(\d+)\s+jam', page_text, re.IGNORECASE)
                if jam_match:
                    game_jams = jam_match.group(1)
                d['game_jams'] = game_jams

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
# ===========================================================================
# Codewars
# ===========================================================================
def fetch_codewars():
    """Fetch Codewars data via public API."""
    username = os.getenv('CODEWARS_USERNAME', 'itsdarklikehell')
    url = f"https://www.codewars.com/api/v1/users/{username}"
    data = run_curl(url)
    if data and isinstance(data, dict):
        d = _blank_platform()
        rank = data.get('ranks', {}).get('overall', {}).get('name', 'N/A')
        honor = data.get('honor', 0)
        total_completed = data.get('totalCompleted', 0)
        d['rank'] = str(rank)
        d['points'] = str(honor)
        d['level'] = str(rank)
        d['xp'] = str(honor)
        d['reputation_points'] = str(honor)
        d['event_participation'] = str(total_completed)
        d['kata_completed'] = str(total_completed)
        d['badges'] = str(rank)
        # --- top languages ---
        top_languages = 'N/A'
        lang_names = []
        languages = data.get('ranks', {}).get('languages', {})
        if isinstance(languages, dict):
            # Sort by score descending
            sorted_langs = sorted(languages.items(), key=lambda x: x[1].get('score', 0) if isinstance(x[1], dict) else 0, reverse=True)
            for lang_name, lang_data in sorted_langs[:5]:
                if isinstance(lang_data, dict):
                    name = lang_data.get('name', lang_name)
                else:
                    name = lang_name
                lang_names.append(name)
        if lang_names:
            top_languages = ', '.join(lang_names)
        d['top_languages'] = top_languages
        return d
    return _blank_platform()


# ===========================================================================
# DEV.to
# ===========================================================================
def fetch_devto():
    """Fetch DEV.to data via public API."""
    username = os.getenv('DEVTO_USERNAME', 'itsdarklikehell')
    url = f"https://dev.to/api/users/by_username?url={username}"
    data = run_curl(url)
    if data and isinstance(data, dict):
        d = _blank_platform()
        posts = data.get('post_count', 0)
        followers = data.get('followers_count', 0)
        d['xp'] = str(posts)
        d['reputation_points'] = str(followers)
        d['event_participation'] = str(posts)
        d['skills'] = 'N/A'
        d['badges'] = str(posts)
        # --- recent articles ---
        recent_articles = 'N/A'
        try:
            import json as _json
            articles_url = f"https://dev.to/api/articles?username={username}&per_page=5"
            articles_cmd = ['curl', '-s', articles_url]
            articles_result = subprocess.run(articles_cmd, capture_output=True, text=True, timeout=30)
            if articles_result.returncode == 0:
                articles = _json.loads(articles_result.stdout)
                if isinstance(articles, list) and articles:
                    titles = [a.get('title', '') for a in articles if a.get('title')]
                    recent_articles = ' | '.join(titles[:5])
        except Exception:
            pass
        d['recent_articles'] = recent_articles

        # --- comment count ---
        comment_count = 'N/A'
        try:
            comments_url = f"https://dev.to/api/comments?username={username}"
            comments_cmd = ['curl', '-s', comments_url]
            comments_result = subprocess.run(comments_cmd, capture_output=True, text=True, timeout=30)
            if comments_result.returncode == 0:
                comments = _json.loads(comments_result.stdout)
                if isinstance(comments, list):
                    comment_count = str(len(comments))
        except Exception:
            pass
        d['comment_count'] = comment_count
        return d
    return _blank_platform()


# ===========================================================================
# LeetCode
# ===========================================================================
def fetch_leetcode():
    """Fetch LeetCode data via public GraphQL API (scrape fallback)."""
    username = os.getenv('LEETCODE_USERNAME', 'SgtStroopwafel')
    # Try GraphQL API first
    query = {
        "query": """
        userContestRanking(username: "%s") {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
        userProfileUserQuestionProgressV2(userSlug: "%s") {
          numAcceptedQuestions
          numFailedQuestions
          numUntouchedQuestions
        }
        """ % (username, username)
    }
    try:
        import json as _json
        cmd = ['curl', '-s', '-X', 'POST', 'https://leetcode.com/graphql',
               '-H', 'Content-Type: application/json',
               '-d', _json.dumps(query)]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            resp = _json.loads(result.stdout)
            if resp and 'data' in resp and resp['data']:
                user_data = resp['data'].get('userContestRanking')
                progress = resp['data'].get('userProfileUserQuestionProgressV2')
                if user_data or progress:
                    d = _blank_platform()
                    if user_data:
                        rating = user_data.get('rating', 0)
                        ranking = user_data.get('globalRanking', 0)
                        d['xp'] = str(rating)
                        d['reputation_points'] = str(rating)
                        d['event_participation'] = str(user_data.get('attendedContestsCount', 0))
                        d['rank'] = str(ranking)
                    if progress:
                        accepted = progress.get('numAcceptedQuestions', 0)
                        d['xp_last_year'] = str(accepted)
                        d['skills'] = str(accepted)
                    return d
    except Exception as e:
        print(f"LeetCode API error: {e}")
    return _blank_platform()


# ===========================================================================
# Stack Overflow
# ===========================================================================
def fetch_stackoverflow():
    """Fetch Stack Overflow data via public API (needs user ID)."""
    user_id = os.getenv('STACKOVERFLOW_USER_ID', '9409286')
    if not user_id:
        print("Stack Overflow: STACKOVERFLOW_USER_ID not set — skipping")
        return _blank_platform()
    url = f"https://api.stackexchange.com/2.3/users/{user_id}?site=stackoverflow&filter=withbody"
    data = run_curl(url)
    if data and isinstance(data, dict):
        items = data.get('items', [])
        if items:
            profile = items[0]
            d = _blank_platform()
            rep = profile.get('reputation', 0)
            badges = profile.get('badge_counts', {})
            gold = badges.get('gold', 0) if isinstance(badges, dict) else 0
            silver = badges.get('silver', 0) if isinstance(badges, dict) else 0
            bronze = badges.get('bronze', 0) if isinstance(badges, dict) else 0
            total_badges = gold + silver + bronze
            q_count = profile.get('question_count', 0)
            a_count = profile.get('answer_count', 0)
            d['reputation_points'] = str(rep)
            d['badges'] = str(total_badges)
            d['gold_badges'] = str(gold)
            d['silver_badges'] = str(silver)
            d['bronze_badges'] = str(bronze)
            d['xp'] = str(rep)
            d['event_participation'] = str(q_count + a_count)
            d['answer_count'] = str(a_count)
            d['question_count'] = str(q_count)
            # --- top tags ---
            top_tags = 'N/A'
            try:
                tags_url = f"https://api.stackexchange.com/2.3/users/{user_id}/tags?site=stackoverflow&pagesize=5&sort=popular"
                tags_cmd = ['curl', '-s', tags_url]
                tags_result = subprocess.run(tags_cmd, capture_output=True, text=True, timeout=30)
                if tags_result.returncode == 0:
                    tags_resp = json.loads(tags_result.stdout)
                    tag_items = tags_resp.get('items', [])
                    if tag_items:
                        tag_names = [t.get('name', '') for t in tag_items if t.get('name')]
                        top_tags = ', '.join(tag_names)
            except Exception:
                pass
            d['top_tags'] = top_tags
            return d
    return _blank_platform()



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
    for key in ['tryhackme', 'hackthebox', 'cylab', 'microsoft', 'ctftime', 'itchio', 'codewars', 'devto', 'leetcode', 'stackoverflow', 'generated_at']:
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
        ('codewars', fetch_codewars),
        ('devto', fetch_devto),
        ('leetcode', fetch_leetcode),
        ('stackoverflow', fetch_stackoverflow),
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
