from rest_framework import serializers
from hours_api.models import HoursEntry
from djoser.serializers import UserSerializer, UserCreateSerializer as BaseUserSerializer

class HoursEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HoursEntry
        fields = ['date', 'hours', 'description', 'user', 'id']

class UserCreateSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'username', 'password']

class CurrentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ['id', 'email', 'username', 'password']