from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from rest_framework.authtoken import views


router = DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('accounts/', views.obtain_auth_token),
    # path('register/', RegisterUserView.as_view(), name='register'),
]