import logging

from django.conf import settings
from django.contrib.auth import logout
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView

from notification.utils import create_notification

from .models import CustomUser, PsychologistProfile
from .permissions import IsEmailVerified, IsNotBlocked, IsPsychologist
from .serializer import (
    ForgotPasswordSerializer,
    LoginSerializer,
    PsychologistProfileSerializer,
    PsychologistProfileWriterSerializer,
    ResetPasswordSerializer,
    SignupSerializer,
    UserProfileSerializer,
    UserProfileWriterSerializer,
    VerifyOTPserializer,
)
from .utils import send_otp_email, set_token_cookies

logger = logging.getLogger(__name__)


class BaseSignupView(APIView):
    role = None

    def post(self, request):
        data = request.data.copy()
        data['role'] = self.role
        serializer = SignupSerializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
            except RuntimeError as exc:
                return Response({'error': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            return Response(
                {'message': f'{self.role.capitalize()} signup successful'},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSignupView(BaseSignupView):
    permission_classes = [AllowAny]
    role = 'user'


class PsychologistSignupView(BaseSignupView):
    permission_classes = [AllowAny]
    role = 'psychologist'


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Email Verified Successfully Please Login'},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        purpose = request.data.get('purpose', 'email_verification')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        if purpose not in ['email_verification', 'password_reset']:
            return Response({'error': 'Invalid Purpose for OTP'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            cache_key = f'otp_resend_{email}_{purpose}'
            last_request = cache.get(cache_key)
            if last_request:
                time_diff = (timezone.now() - last_request).total_seconds()
                if time_diff < 60:
                    return Response(
                        {'error': f'Please wait {int(60 - time_diff)} seconds before requesting again.'},
                        status=status.HTTP_429_TOO_MANY_REQUESTS,
                    )

            send_otp_email(user, purpose=purpose)
            otp_expire = settings.OTP_EXPIRY_MINUTES * 60
            cache.set(cache_key, timezone.now(), timeout=otp_expire)
            return Response({'message': 'OTP Resend Successfully'})

        except CustomUser.DoesNotExist:
            logger.warning('OTP resend attempted with non-existing email')
            return Response(
                {'error': 'User with this email does not exists'},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as exc:
            logger.error('Unexpected error while resending OTP', exc_info=True)
            return Response(
                {'error': f'Failed to resend OTP. {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BaseAuthView(APIView):
    role = None

    def handle_login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            if user.role != self.role:
                return Response(
                    {'error': f'User is not {self.role} Please select valid role'},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if not user.is_email_verified:
                return Response(
                    {'error': 'Please verify your email before logging in'},
                    status=status.HTTP_403_FORBIDDEN,
                )

            tokens = serializer.get_token_for_users(user)
            response = Response(
                {'message': f'{self.role.capitalize()} Login Successful'},
                status=status.HTTP_200_OK,
            )
            return set_token_cookies(response, tokens['access'], tokens['refresh'])

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        return self.handle_login(request)


class UserLoginView(BaseAuthView):
    permission_classes = [AllowAny]
    role = 'user'


class PsychologistLoginView(BaseAuthView):
    permission_classes = [AllowAny]
    role = 'psychologist'


class AuthStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            role = user.role
            is_verified = False
            try:
                profile = PsychologistProfile.objects.get(user=user)
                is_verified = profile.is_verified == 'verified'
            except PsychologistProfile.DoesNotExist:
                is_verified = False
            return Response({'isAuthenticated': True, 'role': role, 'is_verified': is_verified})
        return Response({'isAuthenticated': False})


class CustomRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token not found'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            data = {'access': str(token.access_token)}
            response = Response(data, status=status.HTTP_200_OK)
            return set_token_cookies(response, data['access'], str(token))
        except Exception:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


class Logoutview(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        logout(request)

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                logger.warning('Logout attempt with an invalid or already blacklisted refresh token.')

        response = Response({'message': 'Logout Succesful'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
            except RuntimeError as exc:
                return Response({'error': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            return Response(
                {'message': 'OTP sent to your email for password reset'},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated, IsEmailVerified, IsNotBlocked]

    def get(self, request):
        try:
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {'error': 'Something went wrong while retrieving profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request):
        try:
            user = request.user
            serializer = UserProfileWriterSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_serializer = UserProfileSerializer(user)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.error('Unexpected error while updating user profile', exc_info=True)
            return Response(
                {'error': 'Something went wrong while updating profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PsychologistProfileView(APIView):
    permission_classes = [IsAuthenticated, IsEmailVerified, IsNotBlocked, IsPsychologist]

    def get(self, request):
        user = request.user
        try:
            profile = user.psychologist_profile
            serializer = PsychologistProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response(
                {'error': 'Something went wrong while retrieving profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request):
        user = request.user
        try:
            profile = user.psychologist_profile
            was_rejected = profile.is_verified == 'rejected'
            if was_rejected:
                profile.is_verified = 'pending'

            serializer = PsychologistProfileWriterSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                admin_user = CustomUser.objects.filter(is_superuser=True).first()

                if was_rejected and admin_user:
                    create_notification(
                        user=admin_user,
                        message=(
                            f'A psychologist {user.get_full_name()} has resubmitted their profile '
                            'for verification.'
                        ),
                    )
                elif admin_user:
                    create_notification(
                        user=admin_user,
                        message=(
                            f'A new psychologist {user.get_full_name()} has submitted their profile '
                            'for verification.'
                        ),
                    )

                response_serializer = PsychologistProfileSerializer(profile)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error': 'Psychologist profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.error('Unexpected error while updating psychologist profile', exc_info=True)
            return Response(
                {'error': 'Something went wrong while updating profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
