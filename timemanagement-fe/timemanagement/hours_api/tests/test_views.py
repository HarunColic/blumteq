import pytest
from rest_framework import status
from django.contrib.auth.models import User
from hours_api.models import HoursEntry
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.test import APIClient



@pytest.fixture
def user_and_token():
    user = User.objects.create_user(username='probni', password='JakiPassSkroz1')
    access_token = AccessToken.for_user(user)
    return user, access_token


@pytest.fixture
def hours_entry(user_and_token):
    user, _ = user_and_token
    entry = HoursEntry.objects.create(
        user=user,
        date="2024-12-01",
        hours=8,
        description="Worked on project"
    )
    return entry

@pytest.mark.django_db
def test_create_hours_entry(client, user_and_token):
    user, access_token = user_and_token

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    data = {
        "date": "2024-12-02",
        "hours": 6,
        "description": "Worked on another task"
    }

    response = client.post('/hour-entries/', data, format='json', HTTP_AUTHORIZATION=f'Bearer {access_token}')

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['description'] == 'Worked on another task'

@pytest.mark.django_db
def test_get_hours_entries(client, user_and_token, hours_entry):
    user, access_token = user_and_token

    api_client = APIClient()
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    response = api_client.get('/hour-entries/', format='json')

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['description'] == 'Worked on project'


@pytest.mark.django_db
def test_get_single_hours_entry(client, user_and_token, hours_entry):
    user, access_token = user_and_token

    # Create an instance of APIClient and set the credentials
    api_client = APIClient()
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    response = api_client.get(f'/hour-entries/{hours_entry.id}/', format='json')

    assert response.status_code == status.HTTP_200_OK
    assert response.data['description'] == 'Worked on project'


@pytest.mark.django_db
def test_unauthorized_access(client):
    response = client.get('/hour-entries/', format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_update_hours_entry(client, user_and_token, hours_entry):
    user, access_token = user_and_token

    # Create an instance of APIClient and set the credentials
    api_client = APIClient()
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    data = {
        "date": "2024-12-01",
        "hours": 10,
        "description": "Updated description"
    }
    response = api_client.put(f'/hour-entries/{hours_entry.id}/', data, format='json')

    assert response.status_code == status.HTTP_200_OK
    assert response.data['description'] == 'Updated description'


@pytest.mark.django_db
def test_delete_hours_entry(client, user_and_token, hours_entry):
    user, access_token = user_and_token

    # Create an instance of APIClient and set the credentials
    api_client = APIClient()
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    response = api_client.delete(f'/hour-entries/{hours_entry.id}/')

    assert response.status_code == status.HTTP_200_OK
    assert HoursEntry.objects.count() == 0

@pytest.mark.django_db
def test_restricted_access(client, user_and_token, hours_entry):

    user2 = User.objects.create_user(username='drugi', password='JakiPassSkroz1')
    access_token2 = AccessToken.for_user(user2)
    api_client = APIClient()
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token2}')
    response = api_client.get(f'/hour-entries/{hours_entry.id}/')

    assert response.status_code == status.HTTP_403_FORBIDDEN
