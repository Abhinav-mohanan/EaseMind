from rest_framework import serializers
from . models import EmailOTP,CustomUser,PsychologistProfile
from django.utils.crypto import get_random_string

class SignupSerializer(serializers.ModelSerializer):
    # Write-only (not  returned in response)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name','last_name','email','phone_number','role','password','confirm_password']
    
    # Validate the data
    def validate(self,data):
        errors = {}
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        email = data.get('email')
        phone_number = data.get('phone_number')

        if password != confirm_password:
            errors['password'] = 'Password do not match'
        if CustomUser.objects.filter(email=email).exists():
            errors['email'] = 'Email already exists'
        if password and len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters'
        if phone_number and len(phone_number) < 10:
            errors['phone_number'] = 'Enter a valid Phone number'
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return data

    
    # create the instance
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email = validated_data['email'],
            phone_number = validated_data['phone_number'],
            role = validated_data['role'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
