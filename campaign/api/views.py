from rest_framework import viewsets
#from rest_framework.permissions import IsAuthenticated
from .serializers import CampaignCommentSerializer,CampaignSerializer,CampaignUpdateSerializer
from .permissions import IsAdminOrReadOnly,IsOwnerOrReadOnly
from campaign import models


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = models.Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# class CampaignUpdateViewSet(viewsets.ModelViewSet):
#     queryset = models.CampaignUpdate.objects.all()
#     serializer_class = CampaignUpdateSerializer
#     permission_classes = [IsAdminOrReadOnly]

class CampaignUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignUpdateSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return models.CampaignUpdate.objects.filter(campaign_id=self.kwargs['campaign_pk'])

    def perform_create(self, serializer):
        campaign = models.Campaign.objects.get(pk=self.kwargs['campaign_pk'])
        serializer.save(campaign=campaign)

# class CampaignCommentViewSet(viewsets.ModelViewSet):
#     queryset = models.CampaignComment.objects.all()
#     serializer_class = CampaignCommentSerializer
#     permission_classes = [IsOwnerOrReadOnly]

class CampaignCommentViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignCommentSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return models.CampaignComment.objects.filter(campaign_id=self.kwargs['campaign_pk'])

    def perform_create(self, serializer):
        campaign = models.Campaign.objects.get(pk=self.kwargs['campaign_pk'])
        serializer.save(campaign=campaign, user=self.request.user)


