from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . serializer import (SignupSerializer,VerifyOTPserializer,LoginSerializer)
from . models import CustomUser
from . utils import send_otp_email,set_token_cookies
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes


# Signup
class BaseSignupView(APIView):
    role = None
    
    def post(self,request):
        data = request.data.copy()
        data['role'] = self.role
        serializer = SignupSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':f'{self.role.capitalize()} signup successful'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserSignupView(BaseSignupView):
    permission_classes=[AllowAny]
    role = 'user'

class PsychologistSignupView(BaseSignupView):
    permission_classes = [AllowAny]
    role = 'psychologist'

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        data = request.data
        serializer = VerifyOTPserializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':"Email Verified Successfully Please Login"},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# Resend otp [email verification,password reset]
class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        email = request.data.get('email')
        purpose = request.data.get('purpose','email_verification')   
        if not email:
            return Response({'error':"Email is required"},status=status.HTTP_400_BAD_REQUEST)
        if not purpose in ['email_verification','password_reset']:
            return Response({'error':'Invalid Purpose for OTP'},status=status.HTTP_400_BAD_REQUEST)
        try:
            user = CustomUser.objects.get(email=email)
            send_otp_email(user,purpose=purpose)
            return Response({"message":"OTP Resend Successfully"})
        except CustomUser.DoesNotExist:
            return Response({'error':'User with this email does not exists'},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error':f'Failed to resend OTP {str(e)}'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BaseAuthView(APIView):
    role = None

    def handle_login(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            #Check role
            if user.role != self.role:
                return Response({"error":f'User is not {self.role} Please select valid role'},status=status.HTTP_403_FORBIDDEN)
            tokens = serializer.get_token_for_users(user)
            is_email_verified = user.is_email_verified
            response = Response({
                "message":f'{self.role.capitalize()} Login Successful',
                'is_email_verified':is_email_verified
            },status=status.HTTP_200_OK)
            return set_token_cookies(response,tokens['access'],tokens['refresh']) # set Jwt token is http only cookies
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def post(self,request):
        return self.handle_login(request)

class UserLoginView(BaseAuthView):
    permission_classes = [AllowAny]
    role = "user"

class PsychologistLoginView(BaseAuthView):
    permission_classes = [AllowAny]
    role = "psychologist"