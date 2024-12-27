from datetime import datetime

from django.core.paginator import Paginator, EmptyPage
from django.http import JsonResponse
from rest_framework.generics import RetrieveUpdateDestroyAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from hours_api.models import HoursEntry
from hours_api.permissions import IsOwner
from hours_api.serializers import HoursEntrySerializer

class HoursAPIListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from_date = request.GET.get('date_from', None)
        to_date = request.GET.get('date_to', None)
        date = request.GET.get('date', None)
        page_number = request.GET.get('page', 1)

        if from_date:
            if date:
                return JsonResponse({'error': 'Cannot query both date and date range.'}, status=400)

            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d')
            except ValueError:
                return JsonResponse({'error': 'Invalid date format for "from". Use YYYY-MM-DD.'}, status=400)

        if to_date:
            if date:
                return JsonResponse({'error': 'Cannot query both date and date range.'}, status=400)

            try:
                to_date = datetime.strptime(to_date, '%Y-%m-%d')
            except ValueError:
                return JsonResponse({'error': 'Invalid date format for "to". Use YYYY-MM-DD.'}, status=400)

        if date:
            try:
                date = datetime.strptime(date, '%Y-%m-%d')
            except ValueError:
                return JsonResponse({'error': 'Invalid date format for "date". Use YYYY-MM-DD.'}, status=400)

        if from_date and to_date:
            entries = HoursEntry.objects.filter(date__range=[from_date, to_date], user=request.user.id)
        elif from_date:
            entries = HoursEntry.objects.filter(date__gte=from_date, user=request.user.id)
        elif to_date:
            entries = HoursEntry.objects.filter(date__lte=to_date, user=request.user.id)
        elif date:
            entries = HoursEntry.objects.filter(date=date, user=request.user.id)
        else:
            entries = HoursEntry.objects.filter(user=request.user.id)

        paginator = Paginator(entries.order_by('date'), 10)

        try:
            paginated_entries = paginator.page(page_number)
        except EmptyPage:
            return JsonResponse({'error': 'Page not found.'}, status=404)

        serializer = HoursEntrySerializer(paginated_entries, many=True)
        return Response({
            'total_pages': paginator.num_pages,
            'current_page': paginated_entries.number,
            'total_entries': paginator.count,
            'results': serializer.data
        }, status=status.HTTP_200_OK)


    def post(self, request):

        data = {
            'date': request.data.get('date'),
            'hours': request.data.get('hours'),
            'description': request.data.get('description'),
            'user': request.user.id
        }
        serializer = HoursEntrySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HoursAPIView(GenericAPIView):
    queryset = HoursEntry.objects.all()
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwner]


    def get(self, request, id):
        serializer = HoursEntrySerializer(self.get_object())
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        entry_instance = self.get_object()

        if not entry_instance:
            return Response(
                {"res": "Object with entry id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'date': request.data.get('date'),
            'hours': request.data.get('hours'),
            'description': request.data.get('description'),
            'user': request.user.id
        }
        serializer = HoursEntrySerializer(instance=entry_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        entry_instance = self.get_object()
        if not entry_instance:
            return Response(
                {"res": "Object with entry id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        entry_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        )
