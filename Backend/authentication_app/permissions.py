from rest_framework.permissions import BasePermission
from authentication_app.models import PsychologistProfile


class IsNotBlocked(BasePermission):
    message = 'Your account is blocked. Please contact support.'

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and not user.is_blocked)


class IsEmailVerified(BasePermission):
    message = 'Please verify your email to continue.'

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == 'admin':
            return True
        return bool(user.is_email_verified)


class IsPsychologist(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        return user.role == 'psychologist' and user.is_email_verified and not user.is_blocked


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        return user.role == 'admin' and not user.is_blocked


class IsUser(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        return user.role == 'user' and user.is_email_verified and not user.is_blocked


class IsVerifiedAndUnblock(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role != 'psychologist' or not user.is_email_verified or user.is_blocked:
            return False

        try:
            psychologist = PsychologistProfile.objects.get(user=user)
            return psychologist.is_verified == 'verified' and user.is_active
        except PsychologistProfile.DoesNotExist:
            return False
