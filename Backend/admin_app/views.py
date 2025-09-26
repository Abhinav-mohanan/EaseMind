from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from authentication_app.serializer import LoginSerializer,PsychologistProfileSerializer
from authentication_app.utils import set_token_cookies
from authentication_app.models import CustomUser,PsychologistProfile
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken,OutstandingToken
import logging


logger = logging.getLogger(__name__)

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


class BaseAdminView(APIView):

    def validate(self,user):
        if user.role != 'admin':
            return Response({"error":"Access denied"},status=status.HTTP_403_FORBIDDEN)
        return None
    

class AdminUserManageView(BaseAdminView):
    def get(self,request):
        authorization_error = self.validate(request.user)
        if authorization_error:
            return authorization_error
        users = CustomUser.objects.filter(role='user').order_by('created_at')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(users,request)
        user_list = [
            {
                'id':user.id,
                'name':f"{user.first_name} {user.last_name}",
                'email':user.email,
                'phone_number':user.phone_number,
                'is_blocked':user.is_blocked

            }
            for user in page
        ]
        return paginator.get_paginated_response(user_list)
    
    def patch(self,request,user_id=None):
        authorization_error = self.validate(request.user)
        if authorization_error:
            return authorization_error
        if not user_id:
            return Response({"error":"User ID is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user =CustomUser.objects.get(id=user_id,role='user')
        except CustomUser.DoesNotExist:
            return Response({"error":"User not found"},status=status.HTTP_404_NOT_FOUND)
        
        is_blocked = request.data.get('is_blocked')
        was_blocked = user.is_blocked

        if is_blocked is not None:
            if isinstance(is_blocked,str):  
                is_blocked = is_blocked.lower() == 'true'  # if the is_block is str update in to bool

            user.is_blocked = is_blocked
        else:
            user.is_blocked = not user.is_blocked # Toggle current status
        
        user.save()
        if not was_blocked and user.is_blocked:
            try:
                for token in OutstandingToken.objects.filter(user=user):
                    BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                logger.warning(f'Failed to blacklist token of user : {str(e)}')
        return Response({"message":f"User {'blocked' if user.is_blocked else 'unblocked'} successfully",
                         'is_blocked':user.is_blocked},status=status.HTTP_200_OK)


class ManagePsychologistView(BaseAdminView):
    def get(self,request):
        authorization_error = self.validate(request.user)
        if authorization_error:
            return authorization_error
        psychologists = CustomUser.objects.filter(role ='psychologist').order_by('created_at').select_related(
            'psychologist_profile'
        )
        psychologists = psychologists.filter(psychologist_profile__is_verified='verified')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(psychologists,request)
        psychologist_list = [
            {
                'id':psychologist.id,
                'name':f"{psychologist.first_name} {psychologist.last_name}",
                'email':psychologist.email,
                'phone_number':psychologist.phone_number,
                'is_blocked':psychologist.is_blocked
            }
            for psychologist in page
        ]
        return paginator.get_paginated_response(psychologist_list)
    
    def patch(self,request,psychologist_id=None):
        authorization_error = self.validate(request.user)
        if authorization_error:
            return authorization_error
        if not psychologist_id:
            return Response({"error":"Psychologist ID is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            psychologist = CustomUser.objects.get(id=psychologist_id,role='psychologist')
        except CustomUser.DoesNotExist:
            return Response({"error":"Psychologist Not found"},status=status.HTTP_404_NOT_FOUND)
        
        is_blocked = request.data.get('is_blocked')
        was_block = psychologist.is_blocked
        if is_blocked is not None:
            if isinstance(is_blocked,str):
                is_blocked = is_blocked.lower() == 'true'
            psychologist.is_blocked = is_blocked
        else:
            psychologist.is_blocked = not psychologist.is_blocked
        psychologist.save()
        if not was_block and psychologist.is_blocked:
            try:
                for token in OutstandingToken.objects.filter(user=psychologist):
                    BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                logger.warning(f'Failed to blacklist token of user : {str(e)}')
        return Response({'message':f"Psychologsit {'blocked' if psychologist.is_blocked else 'unblocked'} successfully",
                         'is_blocked':is_blocked},status=status.HTTP_200_OK)
    

class PsychologistVerificationView(BaseAdminView):
    def get(self,request):
        authorization_error = self.validate(request.user)
        if authorization_error:
            return authorization_error
        
        status_param = request.query_params.get('status','pending').lower()  
        if status_param not in ['pending','rejected']:
            return Response({"error":"Invalid status. Use pending or rejected"},
                            status=status.HTTP_400_BAD_REQUEST)
        
        profiles = PsychologistProfile.objects.filter(is_verified=status_param,is_submitted=True)

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(profiles,request)
        serializer = PsychologistProfileSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def patch(self,request,psychologist_id):
        authorization_error = self.validate(request.user)
        if authorization_error:
            return authorization_error
        
        action =request.data.get('action')
        if action not in ['reject','verify']:
            return Response({
                'error': "Invalid action.User verify or Reject"
            },status=status.HTTP_400_BAD_REQUEST)
        
        try:
            psychologist_profile = PsychologistProfile.objects.get(user__id=psychologist_id)
        except PsychologistProfile.DoesNotExist:
            return Response({"error":"Psychologist profile not found"},status=status.HTTP_404_NOT_FOUND )
        
        psychologist_profile.is_verified = 'verified' if action == 'verify' else 'rejected'
        psychologist_profile.save()
        serializer = PsychologistProfileSerializer(psychologist_profile)
        return Response(serializer.data,status=status.HTTP_200_OK)
