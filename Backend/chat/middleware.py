from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.exceptions import DenyConnection

User = get_user_model()

@database_sync_to_async
def get_user(validated_token):
    try:
        user_id = validated_token['user_id']
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()
    
class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self,scope,receive,send):
        try:
            query_stirng = parse_qs(scope['query_string'].decode())
            token =query_stirng.get('token',[None])[0]

            if token is None:
                raise DenyConnection("missing token")
            
            validated_token = AccessToken(token)
            user = await get_user(validated_token)
            if not user:
                raise DenyConnection("Invalid token")
            scope['user'] = user
        except Exception as e:
            raise DenyConnection(str(e))
        return await super().__call__(scope,receive,send)