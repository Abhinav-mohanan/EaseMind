from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from authentication_app.serializer import LoginSerializer
from authentication_app.utils import set_token_cookies

# Create your views here.


# Admin login
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        data = request.data
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if user.role != 'admin':
                return Response({"error":"You do not have the permission to access the admin panel"},status=status.HTTP_403_FORBIDDEN)
            tokens = serializer.get_token_for_users(user)
            response = Response({"message":"Login Successful"},status=status.HTTP_200_OK)
            return set_token_cookies(response,tokens['access'],tokens['refresh'])
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        