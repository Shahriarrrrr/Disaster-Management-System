from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from datetime import date, timedelta

from campaign.models import Campaign, CampaignUpdate, CampaignComment

User = get_user_model()


class CampaignModelTest(TestCase):
    def setUp(self):
        self.campaign = Campaign.objects.create(
            title="Save the Forest",
            location="Dhaka",
            slug="save-the-forest",
            description="A campaign to save the forest.",
            goal_amount=50000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            featured=True,
        )

    def test_campaign_str(self):
        self.assertEqual(str(self.campaign), "Save the Forest")

    def test_campaign_fields(self):
        self.assertEqual(self.campaign.location, "Dhaka")
        self.assertTrue(self.campaign.featured)
        self.assertTrue(self.campaign.is_active)
        self.assertIsNotNone(self.campaign.created_at)

    def test_campaign_slug_unique(self):
        with self.assertRaises(Exception):
            Campaign.objects.create(
                title="Duplicate Slug",
                location="Chittagong",
                slug="save-the-forest",  # duplicate
                description="Another campaign",
                goal_amount=10000.00,
                start_date=date.today(),
                end_date=date.today() + timedelta(days=10),
            )


class CampaignUpdateModelTest(TestCase):
    def setUp(self):
        self.campaign = Campaign.objects.create(
            title="Ocean Cleanup",
            location="Cox’s Bazar",
            slug="ocean-cleanup",
            description="Clean the ocean of plastics.",
            goal_amount=100000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=60),
        )

        self.update = CampaignUpdate.objects.create(
            campaign=self.campaign,
            title="Progress Report 1",
            content="We have cleaned 2 tons of plastic!",
            total_collected=20000.00,
        )

    def test_update_str(self):
        expected_str = "Progress Report 1 - Ocean Cleanup"
        self.assertEqual(str(self.update), expected_str)

    def test_update_relationship(self):
        self.assertEqual(self.update.campaign, self.campaign)
        self.assertEqual(self.campaign.updates.count(), 1)


class CampaignCommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="john", password="password123")
        self.campaign = Campaign.objects.create(
            title="Tree Plantation Drive",
            location="Sylhet",
            slug="tree-plantation",
            description="Let’s plant 10,000 trees.",
            goal_amount=80000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=20),
        )

        self.comment = CampaignComment.objects.create(
            campaign=self.campaign,
            user=self.user,
            content="This is a great initiative!"
        )

    def test_comment_str(self):
        expected_str = f"Comment by {self.user} on {self.campaign.title}"
        self.assertEqual(str(self.comment), expected_str)

    def test_comment_relationship(self):
        self.assertEqual(self.comment.campaign, self.campaign)
        self.assertEqual(self.comment.user.username, "john")
        self.assertEqual(self.campaign.comments.count(), 1)
