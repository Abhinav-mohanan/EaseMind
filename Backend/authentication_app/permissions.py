from rest_framework.permissions import BasePermission
from authentication_app.models import PsychologistProfile

class IsNotBlocked(BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_blocked

class IsPsychologist(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'psychologist'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'user'

class IsVerifiedAndUnblock(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role != 'psychologist':
            return False
        try:
            psychologist = PsychologistProfile.objects.get(user=request.user)
            return psychologist.is_verified == 'verified' and psychologist.user.is_active
        except PsychologistProfile.DoesNotExist:
            return False
