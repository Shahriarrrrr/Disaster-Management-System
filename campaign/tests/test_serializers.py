from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import date, timedelta
from decimal import Decimal

from ..models import Campaign, CampaignUpdate, CampaignComment
from ..api.serializers import (
    CampaignSerializer,
    CampaignUpdateSerializer,
    CampaignCommentSerializer
)

User = get_user_model()


class CampaignUpdateSerializerTest(TestCase):
    def setUp(self):
        self.campaign = Campaign.objects.create(
            title="Ocean Cleanup",
            location="Cox's Bazar",
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

    def test_update_serializer_fields(self):
        serializer = CampaignUpdateSerializer(instance=self.update)
        data = serializer.data
        
        self.assertEqual(set(data.keys()), {
            'id', 'title', 'content', 'image', 'created_at', 'total_collected'
        })

    def test_update_serializer_content(self):
        serializer = CampaignUpdateSerializer(instance=self.update)
        data = serializer.data
        
        self.assertEqual(data['title'], "Progress Report 1")
        self.assertEqual(data['content'], "We have cleaned 2 tons of plastic!")
        self.assertEqual(Decimal(data['total_collected']), Decimal('20000.00'))

    def test_update_serializer_create(self):
        data = {
            'campaign': self.campaign.id,
            'title': 'Progress Report 2',
            'content': 'We have cleaned 3 tons of plastic!',
            'total_collected': 30000.00
        }
        serializer = CampaignUpdateSerializer(data=data)
        
        self.assertTrue(serializer.is_valid())
        update = serializer.save(campaign=self.campaign)
        
        self.assertEqual(update.title, 'Progress Report 2')
        self.assertEqual(update.campaign, self.campaign)


class CampaignCommentSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="john@example.com",
            password="password123",
            user_name="John Doe",
            user_gender="M",
            user_phone="01712345678",
            user_state="Dhaka",
            user_address="123 Main St, Dhaka"
        )

        self.campaign = Campaign.objects.create(
            title="Tree Plantation Drive",
            location="Sylhet",
            slug="tree-plantation",
            description="Let's plant 10,000 trees.",
            goal_amount=80000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=20),
        )

        self.comment = CampaignComment.objects.create(
            campaign=self.campaign,
            user=self.user,
            content="This is a great initiative!"
        )

    def test_comment_serializer_fields(self):
        serializer = CampaignCommentSerializer(instance=self.comment)
        data = serializer.data
        
        self.assertEqual(set(data.keys()), {
            'id', 'user', 'content', 'posted_at'
        })

    def test_comment_serializer_content(self):
        serializer = CampaignCommentSerializer(instance=self.comment)
        data = serializer.data
        
        self.assertEqual(data['user'], self.user.id)
        self.assertEqual(data['content'], "This is a great initiative!")
        self.assertIsNotNone(data['posted_at'])

    def test_comment_serializer_create(self):
        data = {
            'user': self.user.id,
            'content': 'Another great comment!'
        }
        serializer = CampaignCommentSerializer(data=data)
        
        self.assertTrue(serializer.is_valid())
        comment = serializer.save(campaign=self.campaign)
        
        self.assertEqual(comment.content, 'Another great comment!')
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.campaign, self.campaign)


class CampaignSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="jane@example.com",
            password="password123",
            user_name="Jane Doe",
            user_gender="F",
            user_phone="01798765432",
            user_state="Dhaka",
            user_address="456 Main St, Dhaka"
        )

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

        self.update1 = CampaignUpdate.objects.create(
            campaign=self.campaign,
            title="Update 1",
            content="First update",
            total_collected=10000.00,
        )

        self.update2 = CampaignUpdate.objects.create(
            campaign=self.campaign,
            title="Update 2",
            content="Second update",
            total_collected=15000.00,
        )

        self.comment = CampaignComment.objects.create(
            campaign=self.campaign,
            user=self.user,
            content="Great campaign!"
        )

    def test_campaign_serializer_fields(self):
        serializer = CampaignSerializer(instance=self.campaign)
        data = serializer.data
        
        expected_fields = {
            'id', 'title', 'location', 'slug', 'description', 'goal_amount',
            'image', 'start_date', 'end_date', 'is_active', 'created_at',
            'updates', 'comments', 'featured'
        }
        self.assertEqual(set(data.keys()), expected_fields)

    def test_campaign_serializer_content(self):
        serializer = CampaignSerializer(instance=self.campaign)
        data = serializer.data
        
        self.assertEqual(data['title'], "Save the Forest")
        self.assertEqual(data['location'], "Dhaka")
        self.assertEqual(data['slug'], "save-the-forest")
        self.assertEqual(Decimal(data['goal_amount']), Decimal('50000.00'))
        self.assertTrue(data['featured'])
        self.assertTrue(data['is_active'])

    def test_campaign_serializer_nested_updates(self):
        serializer = CampaignSerializer(instance=self.campaign)
        data = serializer.data
        
        self.assertEqual(len(data['updates']), 2)
        self.assertEqual(data['updates'][0]['title'], "Update 1")
        self.assertEqual(data['updates'][1]['title'], "Update 2")

    def test_campaign_serializer_nested_comments(self):
        serializer = CampaignSerializer(instance=self.campaign)
        data = serializer.data
        
        self.assertEqual(len(data['comments']), 1)
        self.assertEqual(data['comments'][0]['content'], "Great campaign!")

    def test_campaign_serializer_create(self):
        data = {
            'title': 'New Campaign',
            'location': 'Chittagong',
            'slug': 'new-campaign',
            'description': 'A new campaign description',
            'goal_amount': 75000.00,
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=45),
            'featured': False
        }
        serializer = CampaignSerializer(data=data)
        
        self.assertTrue(serializer.is_valid())
        campaign = serializer.save()
        
        self.assertEqual(campaign.title, 'New Campaign')
        self.assertEqual(campaign.location, 'Chittagong')
        self.assertEqual(campaign.slug, 'new-campaign')
        self.assertFalse(campaign.featured)

    def test_campaign_serializer_update(self):
        data = {
            'title': 'Updated Title',
            'location': 'Dhaka',
            'slug': 'save-the-forest',
            'description': 'Updated description',
            'goal_amount': 60000.00,
            'start_date': self.campaign.start_date,
            'end_date': self.campaign.end_date,
            'featured': False
        }
        serializer = CampaignSerializer(instance=self.campaign, data=data)
        
        self.assertTrue(serializer.is_valid())
        campaign = serializer.save()
        
        self.assertEqual(campaign.title, 'Updated Title')
        self.assertEqual(campaign.description, 'Updated description')
        self.assertFalse(campaign.featured)

    def test_campaign_serializer_read_only_fields(self):
        # Updates and comments should be read-only
        data = {
            'title': 'Test Campaign',
            'location': 'Dhaka',
            'slug': 'test-campaign',
            'description': 'Test description',
            'goal_amount': 10000.00,
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=10),
            'updates': [{'title': 'Should be ignored'}],
            'comments': [{'content': 'Should be ignored'}]
        }
        serializer = CampaignSerializer(data=data)
        
        self.assertTrue(serializer.is_valid())
        campaign = serializer.save()
        
        # Updates and comments should not be created from nested data
        self.assertEqual(campaign.updates.count(), 0)
        self.assertEqual(campaign.comments.count(), 0)

    def test_campaign_serializer_invalid_data(self):
        data = {
            'title': '',  # Empty title
            'location': 'Dhaka',
            'slug': 'invalid',
            'description': 'Test',
            'goal_amount': -1000,  # Negative amount
        }
        serializer = CampaignSerializer(data=data)
        
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_campaign_serializer_multiple_instances(self):
        campaign2 = Campaign.objects.create(
            title="Water Conservation",
            location="Rajshahi",
            slug="water-conservation",
            description="Save water for future.",
            goal_amount=40000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=25),
        )

        campaigns = Campaign.objects.all()
        serializer = CampaignSerializer(campaigns, many=True)
        data = serializer.data
        
        self.assertEqual(len(data), 2)
        titles = [campaign['title'] for campaign in data]
        self.assertIn("Save the Forest", titles)
        self.assertIn("Water Conservation", titles)