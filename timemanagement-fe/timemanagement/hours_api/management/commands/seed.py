import datetime
import random
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.template.base import logger
from passlib.hash import django_pbkdf2_sha256 as handler
from hours_api.models import HoursEntry

# python manage.py seed --mode=refresh

""" Clear all data and creates addresses """
MODE_REFRESH = 'refresh'

""" Clear all data and do not create any object """
MODE_CLEAR = 'clear'

class Command(BaseCommand):
    help = "seed database for testing and development."

    def add_arguments(self, parser):
        parser.add_argument('--mode', type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write('seeding data...')
        run_seed(self, options['mode'])
        self.stdout.write('done.')

users = []

def clear_data():
    logger.info("Delete Users and Entries instances")
    User.objects.all().delete()
    HoursEntry.objects.all().delete()

def create_users():
    logger.info("Creating users")

    usernames = ['PrviUser', 'DrugiUser', 'TreciUser']
    emails = ['prvi@mail.com', 'drugi@mail.com', 'treci@mail.com']
    passwords = ['DobraSifraPosve123']

    for i in range(0,3):
        user = User(
            username=usernames[i],
            email=emails[i],
            password=handler.hash(passwords[0]),
        )

        user.save()
        users.append(user)
        logger.info("{} user created.".format(user))



def create_entries():
    logger.info("Creating entries")

    dates = [datetime.date(year=2024, month=12, day=11),
            datetime.date(year=2024, month=12, day=12),
            datetime.date(year=2024, month=12, day=13),
            datetime.date(year=2024, month=12, day=14),
            datetime.date(year=2024, month=12, day=15),
            datetime.date(year=2024, month=12, day=16),
            datetime.date(year=2024, month=12, day=17),
            datetime.date(year=2024, month=12, day=18),
            datetime.date(year=2024, month=12, day=19),
            datetime.date(year=2024, month=12, day=10),
            datetime.date(year=2024, month=12, day=9),
            datetime.date(year=2024, month=12, day=8),]

    for i in range(len(dates)):
        entry = HoursEntry(
            date=dates[i],
            hours=random.randint(1,8),
            description=f'Description {[i]}',
            user=users[0]
        )
        entry.save()
        logger.info("{} Hours entry created.".format(entry))

    for i in range(5):
        entry = HoursEntry(
            date=dates[i],
            hours=random.randint(1, 8),
            description=f'Description {[i]}',
            user=users[1]
        )
        entry.save()
        logger.info("{} Hours entry created.".format(entry))

    for i in range(3):
        entry = HoursEntry(
            date=dates[i],
            hours=random.randint(1, 8),
            description=f'Description {[i]}',
            user=users[2]
        )
        entry.save()
        logger.info("{} Hours entry created.".format(entry))


def run_seed(self, mode):

    clear_data()
    if mode == MODE_CLEAR:
        return

    create_users()
    create_entries()