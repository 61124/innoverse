from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    education_level = models.CharField(max_length=100, null=True, blank=True)
    education_details = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    profile_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        app_label = 'backend'  # Explicitly setting the app_label
