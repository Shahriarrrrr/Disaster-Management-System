from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class AidRequestPermissions(permissions.BasePermission):
    """
    Custom permissions for AidRequest:
    - Users can CREATE (POST), UPDATE (PATCH), and DELETE their own requests.
    - Users CANNOT modify `is_verified`, `is_funded`, `status`, or `review_note`.
    - Admins (staff/superusers) can modify ANY field.
    """

    def has_permission(self, request, view):
        # Allow anyone to create a new request (POST)
        if request.method == 'POST':
            return True
        
        # Allow authenticated users to PATCH/DELETE their own requests
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow admins/staff to do anything (full access)
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Allow users to DELETE their own requests
        if request.method == 'DELETE':
            return obj.user == request.user

        # Allow users to PATCH their own requests, but restrict certain fields
        if request.method == 'PATCH':
            if obj.user != request.user:
                return False  # Users can only edit their own requests
            
            # Check if the user is trying to modify restricted fields
            restricted_fields = {'is_verified', 'is_funded', 'status', 'review_note'}
            if any(field in request.data for field in restricted_fields):
                raise PermissionDenied("You cannot modify 'is_verified', 'is_funded', 'status', or 'review_note'.")
            
            return True

        # Default: Only allow safe methods (GET, OPTIONS, HEAD)
        return request.method in permissions.SAFE_METHODS