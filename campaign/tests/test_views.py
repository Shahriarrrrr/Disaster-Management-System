from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, timedelta
from decimal import Decimal

from ..models import Campaign, CampaignUpdate, CampaignComment

User = get_user_model()


class CampaignViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="adminpass123",
            user_name="Admin User",
            user_gender="M",
            user_phone="01711111111",
            user_state="Dhaka",
            user_address="Admin Address",
            is_staff=True,
            is_superuser=True
        )
        
        # Create regular user
        self.regular_user = User.objects.create_user(
            email="user@example.com",
            password="userpass123",
            user_name="Regular User",
            user_gender="F",
            user_phone="01722222222",
            user_state="Dhaka",
            user_address="User Address"
        )
        
        # Create test campaign
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
        
        self.campaign_list_url = reverse('campaign-list')
        self.campaign_detail_url = reverse('campaign-detail', kwargs={'pk': self.campaign.pk})

    def test_list_campaigns_unauthenticated(self):
        """Unauthenticated users can view campaigns (read-only)"""
        response = self.client.get(self.campaign_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Save the Forest")

    def test_list_campaigns_authenticated(self):
        """Authenticated users can view campaigns"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.campaign_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_campaign(self):
        """Anyone can retrieve a specific campaign"""
        response = self.client.get(self.campaign_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Save the Forest")
        self.assertEqual(response.data['slug'], "save-the-forest")

    def test_create_campaign_as_admin(self):
        """Admin users can create campaigns"""
        self.client.force_authenticate(user=self.admin_user)
        
        data = {
            'title': 'New Campaign',
            'location': 'Chittagong',
            'slug': 'new-campaign',
            'description': 'A new campaign description',
            'goal_amount': 75000.00,
            'start_date': date.today().isoformat(),
            'end_date': (date.today() + timedelta(days=45)).isoformat(),
            'featured': False
        }
        
        response = self.client.post(self.campaign_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 2)
        self.assertEqual(response.data['title'], 'New Campaign')

    def test_create_campaign_as_regular_user(self):
        """Regular users cannot create campaigns"""
        self.client.force_authenticate(user=self.regular_user)
        
        data = {
            'title': 'Unauthorized Campaign',
            'location': 'Dhaka',
            'slug': 'unauthorized',
            'description': 'Should not be created',
            'goal_amount': 10000.00,
            'start_date': date.today().isoformat(),
            'end_date': (date.today() + timedelta(days=10)).isoformat(),
        }
        
        response = self.client.post(self.campaign_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Campaign.objects.count(), 1)

    def test_create_campaign_unauthenticated(self):
        """Unauthenticated users cannot create campaigns"""
        data = {
            'title': 'Unauthorized Campaign',
            'location': 'Dhaka',
            'slug': 'unauthorized',
            'description': 'Should not be created',
            'goal_amount': 10000.00,
            'start_date': date.today().isoformat(),
            'end_date': (date.today() + timedelta(days=10)).isoformat(),
        }
        
        response = self.client.post(self.campaign_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_campaign_as_admin(self):
        """Admin users can update campaigns"""
        self.client.force_authenticate(user=self.admin_user)
        
        data = {
            'title': 'Updated Title',
            'location': 'Dhaka',
            'slug': 'save-the-forest',
            'description': 'Updated description',
            'goal_amount': 60000.00,
            'start_date': self.campaign.start_date.isoformat(),
            'end_date': self.campaign.end_date.isoformat(),
            'featured': False
        }
        
        response = self.client.put(self.campaign_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.campaign.refresh_from_db()
        self.assertEqual(self.campaign.title, 'Updated Title')
        self.assertFalse(self.campaign.featured)

    def test_update_campaign_as_regular_user(self):
        """Regular users cannot update campaigns"""
        self.client.force_authenticate(user=self.regular_user)
        
        data = {
            'title': 'Should Not Update',
            'location': 'Dhaka',
            'slug': 'save-the-forest',
            'description': 'Updated description',
            'goal_amount': 60000.00,
            'start_date': self.campaign.start_date.isoformat(),
            'end_date': self.campaign.end_date.isoformat(),
        }
        
        response = self.client.put(self.campaign_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.campaign.refresh_from_db()
        self.assertEqual(self.campaign.title, 'Save the Forest')

    def test_partial_update_campaign_as_admin(self):
        """Admin users can partially update campaigns"""
        self.client.force_authenticate(user=self.admin_user)
        
        data = {'title': 'Partially Updated'}
        
        response = self.client.patch(self.campaign_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.campaign.refresh_from_db()
        self.assertEqual(self.campaign.title, 'Partially Updated')

    def test_delete_campaign_as_admin(self):
        """Admin users can delete campaigns"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.delete(self.campaign_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Campaign.objects.count(), 0)

    def test_delete_campaign_as_regular_user(self):
        """Regular users cannot delete campaigns"""
        self.client.force_authenticate(user=self.regular_user)
        
        response = self.client.delete(self.campaign_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Campaign.objects.count(), 1)


class CampaignUpdateViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create admin user
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="adminpass123",
            user_name="Admin User",
            user_gender="M",
            user_phone="01711111111",
            user_state="Dhaka",
            user_address="Admin Address",
            is_staff=True,
            is_superuser=True
        )
        
        # Create regular user
        self.regular_user = User.objects.create_user(
            email="user@example.com",
            password="userpass123",
            user_name="Regular User",
            user_gender="F",
            user_phone="01722222222",
            user_state="Dhaka",
            user_address="User Address"
        )
        
        # Create campaign
        self.campaign = Campaign.objects.create(
            title="Ocean Cleanup",
            location="Cox's Bazar",
            slug="ocean-cleanup",
            description="Clean the ocean of plastics.",
            goal_amount=100000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=60),
        )
        
        # Create campaign update
        self.update = CampaignUpdate.objects.create(
            campaign=self.campaign,
            title="Progress Report 1",
            content="We have cleaned 2 tons of plastic!",
            total_collected=20000.00,
        )
        
        self.update_list_url = reverse('campaign-updates-list', kwargs={'campaign_pk': self.campaign.pk})
        self.update_detail_url = reverse('campaign-updates-detail', kwargs={
            'campaign_pk': self.campaign.pk,
            'pk': self.update.pk
        })

    def test_list_updates_for_campaign(self):
        """Anyone can list updates for a campaign"""
        response = self.client.get(self.update_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Progress Report 1")

    def test_retrieve_update(self):
        """Anyone can retrieve a specific update"""
        response = self.client.get(self.update_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Progress Report 1")

    def test_create_update_as_admin(self):
        """Admin users can create campaign updates"""
        self.client.force_authenticate(user=self.admin_user)
        
        data = {
            'title': 'Progress Report 2',
            'content': 'We have cleaned 5 tons now!',
            'total_collected': 50000.00
        }
        
        response = self.client.post(self.update_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CampaignUpdate.objects.count(), 2)
        self.assertEqual(response.data['title'], 'Progress Report 2')
        
        # Verify the update is associated with the correct campaign
        new_update = CampaignUpdate.objects.get(title='Progress Report 2')
        self.assertEqual(new_update.campaign, self.campaign)

    def test_create_update_as_regular_user(self):
        """Regular users cannot create campaign updates"""
        self.client.force_authenticate(user=self.regular_user)
        
        data = {
            'title': 'Unauthorized Update',
            'content': 'Should not be created',
            'total_collected': 10000.00
        }
        
        response = self.client.post(self.update_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(CampaignUpdate.objects.count(), 1)

    def test_update_campaign_update_as_admin(self):
        """Admin users can update campaign updates"""
        self.client.force_authenticate(user=self.admin_user)
        
        data = {
            'title': 'Updated Report',
            'content': 'Updated content',
            'total_collected': 25000.00
        }
        
        response = self.client.put(self.update_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.update.refresh_from_db()
        self.assertEqual(self.update.title, 'Updated Report')

    def test_delete_update_as_admin(self):
        """Admin users can delete campaign updates"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.delete(self.update_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CampaignUpdate.objects.count(), 0)

    def test_updates_filtered_by_campaign(self):
        """Updates are properly filtered by campaign"""
        # Create another campaign with its own update
        other_campaign = Campaign.objects.create(
            title="Another Campaign",
            location="Dhaka",
            slug="another-campaign",
            description="Different campaign",
            goal_amount=50000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
        )
        
        other_update = CampaignUpdate.objects.create(
            campaign=other_campaign,
            title="Other Campaign Update",
            content="Different update",
            total_collected=10000.00,
        )
        
        response = self.client.get(self.update_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Progress Report 1")


class CampaignCommentViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create users
        self.user1 = User.objects.create_user(
            email="user1@example.com",
            password="password123",
            user_name="User One",
            user_gender="M",
            user_phone="01711111111",
            user_state="Dhaka",
            user_address="Address 1"
        )
        
        self.user2 = User.objects.create_user(
            email="user2@example.com",
            password="password123",
            user_name="User Two",
            user_gender="F",
            user_phone="01722222222",
            user_state="Dhaka",
            user_address="Address 2"
        )
        
        # Create campaign
        self.campaign = Campaign.objects.create(
            title="Tree Plantation Drive",
            location="Sylhet",
            slug="tree-plantation",
            description="Let's plant 10,000 trees.",
            goal_amount=80000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=20),
        )
        
        # Create comment by user1
        self.comment = CampaignComment.objects.create(
            campaign=self.campaign,
            user=self.user1,
            content="This is a great initiative!"
        )
        
        self.comment_list_url = reverse('campaign-comments-list', kwargs={'campaign_pk': self.campaign.pk})
        self.comment_detail_url = reverse('campaign-comments-detail', kwargs={
            'campaign_pk': self.campaign.pk,
            'pk': self.comment.pk
        })

    def test_list_comments_for_campaign(self):
        """Anyone can list comments for a campaign"""
        response = self.client.get(self.comment_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], "This is a great initiative!")

    def test_retrieve_comment(self):
        """Anyone can retrieve a specific comment"""
        response = self.client.get(self.comment_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], "This is a great initiative!")

    def test_create_comment_authenticated(self):
        """Authenticated users can create comments"""
        self.client.force_authenticate(user=self.user2)
        
        data = {
            'content': 'Another great comment!'
        }
        
        response = self.client.post(self.comment_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CampaignComment.objects.count(), 2)
        self.assertEqual(response.data['content'], 'Another great comment!')
        
        # Verify the comment is associated with the correct user and campaign
        new_comment = CampaignComment.objects.get(content='Another great comment!')
        self.assertEqual(new_comment.user, self.user2)
        self.assertEqual(new_comment.campaign, self.campaign)

    def test_create_comment_unauthenticated(self):
        """Unauthenticated users cannot create comments"""
        data = {
            'content': 'Unauthorized comment'
        }
        
        response = self.client.post(self.comment_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(CampaignComment.objects.count(), 1)

    def test_update_own_comment(self):
        """Users can update their own comments"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            'content': 'Updated comment content'
        }
        
        response = self.client.put(self.comment_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, 'Updated comment content')

    def test_update_others_comment(self):
        """Users cannot update others' comments"""
        self.client.force_authenticate(user=self.user2)
        
        data = {
            'content': 'Trying to update someone else comment'
        }
        
        response = self.client.put(self.comment_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, "This is a great initiative!")

    def test_delete_own_comment(self):
        """Users can delete their own comments"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.delete(self.comment_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CampaignComment.objects.count(), 0)

    def test_delete_others_comment(self):
        """Users cannot delete others' comments"""
        self.client.force_authenticate(user=self.user2)
        
        response = self.client.delete(self.comment_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(CampaignComment.objects.count(), 1)

    def test_comments_filtered_by_campaign(self):
        """Comments are properly filtered by campaign"""
        # Create another campaign with its own comment
        other_campaign = Campaign.objects.create(
            title="Another Campaign",
            location="Dhaka",
            slug="another-campaign",
            description="Different campaign",
            goal_amount=50000.00,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
        )
        
        other_comment = CampaignComment.objects.create(
            campaign=other_campaign,
            user=self.user2,
            content="Comment on different campaign"
        )
        
        response = self.client.get(self.comment_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], "This is a great initiative!")

    def test_partial_update_own_comment(self):
        """Users can partially update their own comments"""
        self.client.force_authenticate(user=self.user1)
        
        data = {'content': 'Partially updated'}
        
        response = self.client.patch(self.comment_detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, 'Partially updated')