from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . serializer import SignupSerializer


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
    role = 'user'

class PsychologistSignupView(BaseSignupView):
    role = 'psychologist'