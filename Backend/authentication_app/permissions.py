from rest_framework.permissions import BasePermission

class IsNotBlocked(BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_blocked

class IsPsychologist(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'psychologist'