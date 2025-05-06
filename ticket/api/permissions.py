from rest_framework.permissions import BasePermission

class IsAdminOnly(BasePermission):
    """
    Only admin users can view, create, update, or delete.
    Non-admins have no access at all.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff
