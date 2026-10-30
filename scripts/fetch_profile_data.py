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
    # Authenticated-source fields
    'respects', 'follows', 'followers', 'machines_owned', 'country',
    'member_since', 'next_rank', 'apps_published', 'communities',
    'games', 'sites_active', 'reached',
]


def _blank_platform():
    """Return a fresh platform dict with every canonical field set to 'N/A'."""
    return {field: 'N/A' for field in CANONICAL_FIELDS}


def _jwt_subject(token):
    """Return the ``sub`` claim of a JWT, or None if it cannot be decoded.

    HackTheBox API keys are JWTs; the subject is the numeric labs user id
    needed to address the v4 profile endpoint.
    """
    try:
        import base64
        payload = token.split('.')[1]
        payload += '=' * (-len(payload) % 4)
        claims = json.loads(base64.urlsafe_b64decode(payload))
        subject = claims.get('sub')
        return str(subject) if subject else None
    except Exception:
        return None


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

                # --- rooms completed / created / saved via tab clicks ---
                rooms_completed = 'N/A'
                rooms_created = 'N/A'
                rooms_saved = 'N/A'
                try:
                    completed_tab = page.query_selector('[id*="trigger-completed"]')
                    if completed_tab:
                        completed_tab.click()
                        page.wait_for_timeout(2000)
                        completed_content = page.query_selector('[id*="content-completed"]')
                        if completed_content:
                            ctext = completed_content.inner_text().strip()
                            if 'No rooms' in ctext or 'Nothing' in ctext:
                                rooms_completed = '0'
                            else:
                                cards = completed_content.query_selector_all(
                                    '[class*="room-card"], [class*="roomCard"], a[href*="/room/"]'
                                )
                                rooms_completed = str(len(cards)) if cards else 'N/A'
                except Exception:
                    pass

                try:
                    created_tab = page.query_selector('[id*="trigger-created"]')
                    if created_tab:
                        created_tab.click()
                        page.wait_for_timeout(2000)
                        created_content = page.query_selector('[id*="content-created"]')
                        if created_content:
                            ctext = created_content.inner_text().strip()
                            if 'No rooms' in ctext or 'Nothing' in ctext:
                                rooms_created = '0'
                            else:
                                cards = created_content.query_selector_all(
                                    '[class*="room-card"], [class*="roomCard"], a[href*="/room/"]'
                                )
                                rooms_created = str(len(cards)) if cards else 'N/A'
                except Exception:
                    pass

                try:
                    saved_tab = page.query_selector('[id*="trigger-saved"]')
                    if saved_tab:
                        saved_tab.click()
                        page.wait_for_timeout(2000)
                        saved_content = page.query_selector('[id*="content-saved"]')
                        if saved_content:
                            ctext = saved_content.inner_text().strip()
                            if 'No rooms' in ctext or 'Nothing' in ctext:
                                rooms_saved = '0'
                            else:
                                cards = saved_content.query_selector_all(
                                    '[class*="room-card"], [class*="roomCard"], a[href*="/room/"]'
                                )
                                rooms_saved = str(len(cards)) if cards else 'N/A'
                except Exception:
                    pass

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

                # --- skills --- (not publicly listed on TryHackMe profile page)
                d['skills'] = 'N/A'

                # --- event participation ---
                event_participation = 'N/A'
                ep_match = re.search(r'Event\s+participation[:\s]*(\d+)', page_text, re.IGNORECASE)
                if ep_match:
                    event_participation = ep_match.group(1)
                d['event_participation'] = event_participation

                # --- Playwright element-based fallback for fields regex missed ---
                # TryHackMe renders stats as label/value pairs; query common containers
                stat_containers = page.query_selector_all('[class*="stat"], [class*="profile-stat"], [class*="user-stat"]')
                for container in stat_containers:
                    try:
                        text = container.inner_text().strip()
                        lines = [l.strip() for l in text.split('\n') if l.strip()]
                        if len(lines) >= 2:
                            label = lines[0].lower()
                            value = lines[1]
                            if 'xp last year' in label or 'xp_last_year' in label:
                                if value.replace(',', '').isdigit() and d['xp_last_year'] == 'N/A':
                                    d['xp_last_year'] = value
                            elif 'interest' in label and d['top_interests'] == 'N/A':
                                d['top_interests'] = value
                            elif 'skill' in label and d['skills'] == 'N/A':
                                d['skills'] = value
                            elif 'event' in label and 'participation' in label and d['event_participation'] == 'N/A':
                                if value.replace(',', '').isdigit():
                                    d['event_participation'] = value
                    except Exception:
                        continue

                # Also scan all elements with text containing known labels
                for label_text, field_key in [
                    ('XP last year', 'xp_last_year'),
                    ('Interests', 'top_interests'),
                    ('Skills', 'skills'),
                    ('Event participation', 'event_participation'),
                ]:
                    if d[field_key] != 'N/A':
                        continue
                    elems = page.query_selector_all(f'text=/{label_text}/i')
                    for elem in elems:
                        try:
                            parent = elem.evaluate_handle('el => el.parentElement')
                            if parent:
                                ptext = parent.inner_text().strip()
                                lines = [l.strip() for l in ptext.split('\n') if l.strip()]
                                for line in lines:
                                    if line.lower() != label_text.lower():
                                        d[field_key] = line
                                        break
                        except Exception:
                            continue
                    if d[field_key] != 'N/A':
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
    """Fetch HackTheBox data via API or headless-browser scrape.

    The HTB API key is a JWT whose ``sub`` claim is the numeric labs user id,
    so the profile endpoint can be addressed without a second hard-coded id.
    """
    api_key = os.getenv('HACKTHEBOX_API_KEY') or os.getenv('HTB_API_KEY')
    if api_key:
        user_id = os.getenv('HACKTHEBOX_USER_ID') or _jwt_subject(api_key)
        if user_id:
            url = f"https://labs.hackthebox.com/api/v4/profile/{user_id}"
            headers = [f"Authorization: Bearer {api_key}"]
            data = run_curl(url, headers=headers)
            profile = data.get('profile') if isinstance(data, dict) else None
            if isinstance(profile, dict):
                d = _blank_platform()
                rank = profile.get('rank', 'N/A')
                points = profile.get('points', 0)
                respects = profile.get('respects', 0)
                follows = profile.get('user_follows', 0)
                followers = profile.get('followed_by_count', 0)
                machines = (profile.get('user_owns', 0) or 0) + (profile.get('system_owns', 0) or 0)
                d['rank'] = str(rank)
                d['points'] = str(points)
                d['level'] = str(rank)
                d['xp'] = str(points)
                d['reputation_points'] = str(respects)
                d['badges'] = str(rank)
                d['next_rank'] = str(profile.get('next_rank', 'N/A'))
                d['respects'] = str(respects)
                d['follows'] = str(follows)
                d['followers'] = str(followers)
                d['machines_owned'] = str(machines)
                d['country'] = str(profile.get('country_name', 'N/A'))
                d['github'] = str(profile.get('github', 'N/A'))
                d['member_since'] = str(profile.get('joined_date', 'N/A'))[:10]
                return d
            print("HackTheBox: profile endpoint returned no profile — falling back to scrape")
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
    """Fetch itch.io data.

    The public profile renders no counters for this account, so the metric
    source is the authenticated API: ``my-games`` is the one documented route
    that answers for the key holder and reports published games.
    """
    api_key = os.getenv('ICHIO_API_KEY')
    d = scrape_itchio()
    if not api_key:
        return d

    # Confirmed route: GET /api/1/key/my-games with a bearer token.
    result = subprocess.run(
        ['curl', '-s', '-H', f'Authorization: Bearer {api_key}',
         'https://itch.io/api/1/key/my-games'],
        capture_output=True, text=True, timeout=30)
    if result.returncode != 0 or not result.stdout:
        return d
    try:
        payload = json.loads(result.stdout)
    except ValueError:
        return d
    if not isinstance(payload, dict):
        return d

    games = payload.get('games')
    if isinstance(games, dict):
        games = list(games.values())
    if isinstance(games, list):
        d['games'] = [
            {
                'title': game.get('title') or game.get('short_text') or 'Untitled',
                'url': game.get('url') or '',
                'description': game.get('short_text') or game.get('description') or '',
            }
            for game in games
            if isinstance(game, dict) and game.get('url')
        ]
        d['games_published'] = str(len(games))
    return d


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

                # The itch.io profile renders its counters as "<n> games" /
                # "<n> followers" inside the visible text. Read them from the
                # rendered text only — never from raw HTML, whose numbers come
                # from CSS/JS and would fabricate statistics.
                page_text = page.evaluate('() => document.body.innerText')

                games_match = re.search(r'([\d.,]+)\s*games?\b', page_text, re.IGNORECASE)
                if games_match:
                    games = games_match.group(1).replace(',', '')

                followers_match = re.search(r'([\d.,]+)\s*followers?\b', page_text, re.IGNORECASE)
                if followers_match:
                    followers = followers_match.group(1).replace(',', '')

                # Read actual published game cards from the public profile.
                game_cards = page.locator('a.game_cell, .game_cell a, a[href*=".itch.io/"]')
                scraped_games = []
                for index in range(min(game_cards.count(), 30)):
                    card = game_cards.nth(index)
                    href = card.get_attribute('href') or ''
                    title = (card.get_attribute('title') or card.inner_text() or '').strip()
                    if not href.startswith('http') or '.itch.io/' not in href or not title:
                        continue
                    if any(part in href for part in ['/jam/', '/community/']):
                        continue
                    if not any(game.get('url') == href for game in scraped_games):
                        scraped_games.append({'title': title, 'url': href, 'description': ''})
                d['games'] = scraped_games
                if scraped_games:
                    d['games_published'] = str(len(scraped_games))
                d['followers'] = followers.strip()
                # --- game rating ---
                game_rating = 'N/A'
                rating_match = re.search(r'(\d[\.,]\d)\s*/\s*5', page_text)
                if rating_match:
                    game_rating = rating_match.group(1).replace(',', '.')
                d['game_rating'] = game_rating

                # --- game jams ---
                game_jams = 'N/A'
                jam_match = re.search(r'(\d+)\s*jam', page_text, re.IGNORECASE)
                if jam_match:
                    game_jams = jam_match.group(1)
                d['game_jams'] = game_jams

                # Map onto canonical fields. itch.io exposes no XP or reputation
                # metric, so those stay N/A rather than being aliased to the
                # follower count.
                d['xp'] = 'N/A'
                d['reputation_points'] = 'N/A'
                d['event_participation'] = 'N/A'

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
    """Fetch DEV.to data via public API.

    The public ``by_username`` endpoint only returns identity fields — it does
    not expose post/follower counts, so article and comment listings are used
    to derive real activity numbers instead of reporting fabricated zeros.
    """
    username = os.getenv('DEVTO_USERNAME', 'itsdarklikehell')
    api_key = os.getenv('DEV_TO_API_KEY') or os.getenv('DEVTO_API_KEY')
    headers = [f"api-key: {api_key}"] if api_key else None
    url = f"https://dev.to/api/users/by_username?url={username}"
    data = run_curl(url, headers=headers)
    if data and isinstance(data, dict):
        d = _blank_platform()
        articles = _devto_fetch_articles(username, headers, limit=5)
        posts = _devto_list_count(
            f"https://dev.to/api/articles?username={username}&per_page=100", headers)
        comments = _devto_list_count(
            f"https://dev.to/api/comments?username={username}&per_page=100", headers)
        # DEV.to exposes no XP, reputation or badge metric. Map the confirmed
        # article/comment counts onto their own rows instead of aliasing them
        # onto fields DEV.to does not have.
        d['articles'] = articles;
        d['xp'] = 'N/A'
        d['reputation_points'] = 'N/A'
        d['event_participation'] = 'N/A'
        d['badges'] = 'N/A'
        d['comment_count'] = str(comments) if comments is not None else 'N/A'
        d['recent_articles'] = 'N/A'
        d['member_since'] = str(data.get('joined_at', 'N/A'))
        d['github'] = str(data.get('github_username', 'N/A'))
        # Keep the legacy summary in sync with the actual article cards.
        if articles:
            d['recent_articles'] = ' | '.join(a['title'] for a in articles if a.get('title'))
        return d
    return _blank_platform()


def _devto_fetch_articles(username, headers=None, limit=5):
    """Return real DEV.to article records in the shape consumed by the site."""
    try:
        cmd = ['curl', '-s']
        for header in headers or []:
            cmd.extend(['-H', header])
        cmd.append(f"https://dev.to/api/articles?username={username}&per_page={limit}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0 or not result.stdout:
            return []
        payload = json.loads(result.stdout)
        if not isinstance(payload, list):
            return []
        articles = []
        for item in payload:
            if not isinstance(item, dict) or not item.get('title') or not item.get('url'):
                continue
            articles.append({
                'title': item['title'],
                'url': item['url'],
                'excerpt': item.get('description') or item.get('description_html') or '',
                'published_at': item.get('published_at') or '',
            })
        return articles[:limit]
    except Exception as exc:
        print(f"DEV.to articles error: {exc}")
        return []


def _devto_list_count(url, headers=None):
    """Return the number of items in a DEV.to list endpoint, or None on error.

    A failed request returns a JSON error object rather than a list, so the
    type is checked before counting — otherwise the count would silently
    become the number of keys in the error payload.
    """
    try:
        cmd = ['curl', '-s']
        for header in headers or []:
            cmd.extend(['-H', header])
        cmd.append(url)
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            payload = json.loads(result.stdout)
            if isinstance(payload, list):
                return len(payload)
    except Exception:
        pass
    return None


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
    # Fallback: scrape profile page (GraphQL often requires auth)
    return scrape_leetcode(username)


def scrape_leetcode(username):
    """Scrape LeetCode public profile via Playwright."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            try:
                page.goto(f'https://leetcode.com/u/{username}/', timeout=30000)
                page.wait_for_timeout(5000)

                d = _blank_platform()
                page_text = page.evaluate('() => document.body.innerText')

                # Ranking
                rank_match = re.search(r'Ranking\s*(\d+)', page_text)
                if rank_match:
                    d['rank'] = rank_match.group(1)
                    d['level'] = rank_match.group(1)

                # Rating / XP
                rating_match = re.search(r'Rating\s*(\d+)', page_text)
                if rating_match:
                    d['xp'] = rating_match.group(1)
                    d['reputation_points'] = rating_match.group(1)

                # Accepted questions
                accepted_match = re.search(r'(\d+)\s+accepted?\s*questions?', page_text, re.IGNORECASE)
                if accepted_match:
                    d['kata_completed'] = accepted_match.group(1)
                    d['xp_last_year'] = accepted_match.group(1)

                # Contests attended
                contests_match = re.search(r'(\d+)\s+contests?\s*attended', page_text, re.IGNORECASE)
                if contests_match:
                    d['event_participation'] = contests_match.group(1)

                return d
            finally:
                browser.close()
    except Exception as e:
        print(f"LeetCode scrape error: {e}")
        return _blank_platform()


# ===========================================================================
# Stack Overflow
# ===========================================================================
def fetch_stackoverflow():
    """Fetch Stack Exchange network data via API (needs user ID).

    Stack Exchange public profile URLs use the network-wide ``account_id``
    (e.g. 7015377), while the API addresses a profile by the per-site
    ``user_id``.  Querying account_id as a user_id returns an unrelated
    account, so every site the user belongs to is queried with its own id
    and the results are aggregated.
    """
    api_key = os.getenv('STACK_API_KEY')
    sites = _se_site_user_ids(api_key)
    if not sites:
        sites = {'stackoverflow': os.getenv('STACKOVERFLOW_USER_ID', '9409286')}

    gold = silver = bronze = 0
    reputation = 0
    answers = 0
    questions = 0
    tag_names = []
    active = 0

    for site, user_id in sites.items():
        base = f"https://api.stackexchange.com/2.3/users/{user_id}"
        suffix = f"?site={site}"
        if api_key:
            suffix += f"&key={api_key}"
        data = run_curl(base + suffix)
        items = data.get('items', []) if isinstance(data, dict) else []
        if not items:
            continue
        active += 1
        profile = items[0]
        counts = profile.get('badge_counts') or {}
        gold += counts.get('gold', 0) or 0
        silver += counts.get('silver', 0) or 0
        bronze += counts.get('bronze', 0) or 0
        reputation += profile.get('reputation', 0) or 0

        # The default profile filter omits answer_count/question_count, so the
        # totals endpoints are queried explicitly for real post counts.
        for kind in ('answers', 'questions'):
            totals_url = (f"https://api.stackexchange.com/2.3/users/{user_id}"
                          f"/{kind}?site={site}&filter=total"
                          + (f"&key={api_key}" if api_key else ""))
            totals = run_curl(totals_url)
            total = totals.get('total', 0) if isinstance(totals, dict) else 0
            if kind == 'answers':
                answers += total or 0
            else:
                questions += total or 0

        if not tag_names:
            tags_url = (f"https://api.stackexchange.com/2.3/users/{user_id}"
                        f"/tags?site={site}&pagesize=5&sort=popular"
                        + (f"&key={api_key}" if api_key else ""))
            tags_resp = run_curl(tags_url)
            tag_items = tags_resp.get('items', []) if isinstance(tags_resp, dict) else []
            tag_names = [t.get('name', '') for t in tag_items if t.get('name')]

    if not active:
        return _blank_platform()

    d = _blank_platform()
    total_badges = gold + silver + bronze
    d['reputation_points'] = str(reputation)
    d['badges'] = str(total_badges)
    d['badges_count'] = str(total_badges)
    d['gold_badges'] = str(gold)
    d['silver_badges'] = str(silver)
    d['bronze_badges'] = str(bronze)
    d['xp'] = 'N/A'
    d['event_participation'] = str(answers + questions)
    d['answer_count'] = str(answers)
    d['question_count'] = str(questions)
    d['top_tags'] = ', '.join(tag_names) if tag_names else 'N/A'
    d['sites_active'] = str(active)
    d['communities'] = ', '.join(sorted(sites.keys()))
    return d


def _se_site_user_ids(api_key):
    """Return {site: user_id} for every Stack Exchange site the user belongs to.

    The StackApps profile page lists the account link for every community the
    user participates in, which is where the per-site user ids come from.
    """
    user_id = os.getenv('STACK_USER_ID', '167126')
    result = subprocess.run(
        ['curl', '-sL', f'https://stackapps.com/users/{user_id}'],
        capture_output=True, text=True, timeout=30)
    if result.returncode != 0 or not result.stdout:
        return {}
    html = result.stdout
    sites = {}
    for match in re.finditer(r'https?://([a-z0-9.]+)\.com/users/(\d+)/', html):
        site, site_user_id = match.group(1), match.group(2)
        if site == 'stackexchange':
            continue  # account_id namespace, not a per-site id
        sites.setdefault(site, site_user_id)
    return sites


# ===========================================================================
# Stack Apps
# ===========================================================================
def fetch_stackapps():
    """Fetch Stack Apps data from the public profile page and RSS feed.

    Stack Apps has no public JSON API, but the user page exposes reputation
    statistics and the per-user feed lists published applications.
    """
    user_id = os.getenv('STACK_USER_ID', '167126')
    result = subprocess.run(
        ['curl', '-sL', f'https://stackapps.com/users/{user_id}'],
        capture_output=True, text=True, timeout=30)
    if result.returncode != 0 or not result.stdout:
        return _blank_platform()
    html = result.stdout

    d = _blank_platform()
    stats = _html_stats(html)
    if not stats:
        return d
    d['reputation_points'] = str(stats.get('reputation', 0))
    d['xp'] = 'N/A'
    d['answer_count'] = str(stats.get('answers', 0))
    d['question_count'] = str(stats.get('questions', 0))
    d['event_participation'] = str(stats.get('answers', 0) + stats.get('questions', 0))
    d['reached'] = str(stats.get('reached', 0))
    d['communities'] = str(_stackapps_community_count(html))
    d['apps_published'] = str(_stackapps_app_count(user_id))
    return d


def _html_stats(html):
    """Extract reputation/answers/questions/reached counts from HTML.

    The stats are read from the profile's "Stats" block, whose layout is a
    fixed sequence of label/value pairs. Matching the sequence as a whole
    avoids picking up unrelated numbers from the marketing header (for example
    the site-wide "184 communities for the curious" tagline).
    """
    stats = {}
    flat = re.sub(r'<[^>]+>', ' ', html)
    flat = re.sub(r'\s+', ' ', flat)

    block = re.search(
        r'([\d.,]+)\s+reputation\s+([\d.,]+)\s+reached\s+'
        r'([\d.,]+)\s+answers\s+([\d.,]+)\s+questions',
        flat, re.IGNORECASE)
    if block:
        for key, raw in zip(('reputation', 'reached', 'answers', 'questions'), block.groups()):
            try:
                stats[key] = int(raw.replace(',', ''))
            except ValueError:
                stats[key] = 0
    return stats


def _stackapps_community_count(html):
    """Count the communities the profile lists under its "Communities" section.

    The "View all" link points at the network accounts tab, and each listed
    community is one link to a per-site user profile.
    """
    sites = set()
    for match in re.finditer(r'https?://([a-z0-9.]+)\.com/users/\d+/"', html):
        site = match.group(1)
        if site != 'stackexchange':
            sites.add(site)
    return len(sites)


def _stackapps_app_count(user_id):
    """Count published applications in the Stack Apps per-user RSS feed."""
    result = subprocess.run(
        ['curl', '-sL', f'https://stackapps.com/feeds/user/{user_id}'],
        capture_output=True, text=True, timeout=30)
    if result.returncode != 0 or not result.stdout:
        return 0
    return len(re.findall(r'<entry>', result.stdout))



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
    for key in ['tryhackme', 'hackthebox', 'cylab', 'microsoft', 'ctftime', 'itchio', 'codewars', 'devto', 'leetcode', 'stackoverflow', 'stackapps', 'generated_at']:
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
        ('stackapps', fetch_stackapps),
    ]
    for key, fetch_func in platforms:
        print(f"Fetching {key}...")
        fetched = fetch_func()
        if fetched is not None:
            # Only update if the fetched data contains real (non-N/A, non-zero)
            # values, so a failed scrape in CI doesn't overwrite previously
            # good live data.
            has_data = any(
                v != 'N/A' and v != 0 and v != '0'
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
