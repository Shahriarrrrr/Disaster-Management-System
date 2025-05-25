from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow owners of an object or admins to view/edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Admins have full access
        if request.user and request.user.is_staff:
            return True

        # Safe methods like GET, HEAD, OPTIONS are allowed for the owner
        if request.method in SAFE_METHODS:
            return obj.user == request.user

        # For non-safe methods (PUT, PATCH, DELETE), only owner allowed
        return obj.user == request.user
