import unittest
from unittest.mock import patch

import fetch_github_data
import fetch_profile_data


class ProfileDataAvailabilityTests(unittest.TestCase):
    def test_numeric_zero_is_a_real_public_value(self):
        self.assertTrue(fetch_profile_data.has_public_data({'points': 0, 'rank': 'N/A'}))
        self.assertTrue(fetch_profile_data.has_public_data({'rooms_completed': '0'}))

    def test_empty_and_unavailable_values_are_not_public_data(self):
        self.assertFalse(fetch_profile_data.has_public_data({'points': 'N/A', 'rank': ''}))
        self.assertFalse(fetch_profile_data.has_public_data(None))

    def test_public_field_count_includes_zero(self):
        self.assertEqual(
            fetch_profile_data.count_public_fields({
                'points': 0,
                'rank': 'N/A',
                'rooms': '0',
                'name': '',
            }),
            2,
        )


class GitHubSourceStatusTests(unittest.TestCase):
    def test_successful_empty_repository_response_is_a_real_zero(self):
        with patch.object(fetch_github_data, 'run_gh_api', side_effect=[[], []]):
            repos, statuses = fetch_github_data.fetch_repos(checked_at='2026-10-30T12:00:00Z')
        self.assertEqual(repos, [])
        self.assertEqual(statuses['user_repositories']['status'], 'ok')
        self.assertEqual(statuses['user_repositories']['record_count'], 0)
        self.assertEqual(statuses['organization_repositories']['status'], 'ok')

    def test_failed_source_retains_its_previous_records_and_is_not_zero(self):
        existing = [
            {'name': 'old-personal', 'url': 'https://github.com/itsdarklikehell/old-personal', 'stars': 2},
            {'name': 'old-org', 'url': 'https://github.com/itsdarklikehell-interactive/old-org', 'stars': 3},
        ]
        with patch.object(fetch_github_data, 'run_gh_api', side_effect=[None, []]):
            repos, statuses = fetch_github_data.fetch_repos(
                existing,
                {'user_repositories': {'last_successful_at': '2026-10-20T12:00:00Z'}},
                '2026-10-30T12:00:00Z',
            )
        self.assertEqual([repo['name'] for repo in repos], ['old-personal'])
        self.assertEqual(statuses['user_repositories']['status'], 'unavailable')
        self.assertTrue(statuses['user_repositories']['retained'])
        self.assertEqual(statuses['user_repositories']['record_count'], 1)
        self.assertEqual(statuses['organization_repositories']['status'], 'ok')
        self.assertEqual(statuses['organization_repositories']['record_count'], 0)

    def test_empty_contributions_are_success_but_api_failure_retains_previous(self):
        with patch.object(fetch_github_data, 'run_gh_api', return_value=[]):
            empty, empty_status = fetch_github_data.fetch_contributions(checked_at='2026-10-30T12:00:00Z')
        self.assertEqual(empty, [])
        self.assertEqual(empty_status['status'], 'ok')
        self.assertEqual(empty_status['record_count'], 0)

        previous = [{'repo': 'owner/repo', 'date': '2026-10-20T12:00:00Z'}]
        with patch.object(fetch_github_data, 'run_gh_api', return_value=None):
            retained, failed_status = fetch_github_data.fetch_contributions(
                previous,
                {'contributions': {'last_successful_at': '2026-10-20T12:00:00Z'}},
                '2026-10-30T12:00:00Z',
            )
        self.assertEqual(retained, previous)
        self.assertEqual(failed_status['status'], 'unavailable')
        self.assertTrue(failed_status['retained'])

    def test_language_percentages_are_repository_shares(self):
        skills = fetch_github_data.generate_skill_data([
            {'language': 'Python'},
            {'language': 'Python'},
            {'language': 'Shell'},
            {'language': 'Unknown'},
        ])
        self.assertEqual(skills['Python']['percentage'], 67)
        self.assertEqual(skills['Shell']['percentage'], 33)
        self.assertNotIn('Unknown', skills)


if __name__ == '__main__':
    unittest.main()
