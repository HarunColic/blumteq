from django.urls import path

from .views import (
    HoursAPIView,
    HoursAPIListView
)


urlpatterns = [
    path('', HoursAPIListView.as_view(), name='entry-list'),
    path('<int:id>/', HoursAPIView.as_view(), name='entry-detail'),
]