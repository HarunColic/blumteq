from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.

class HoursEntry(models.Model):
    date = models.DateField(
        blank=False,
        validators=[MaxValueValidator(limit_value=now().date(), message="Date cannot be in the future.")]
    )
    id = models.AutoField(primary_key=True)
    hours = models.IntegerField(blank=False, validators=[
            MaxValueValidator(24),
            MinValueValidator(1)
        ])
    description = models.CharField(max_length=250)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)