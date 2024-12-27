from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .tokens import CustomAccessToken

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        # Use CustomAccessToken here
        access = CustomAccessToken.for_user(self.user)
        data['access'] = str(access)
        data['refresh'] = str(refresh)

        return data