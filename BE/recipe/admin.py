from django.contrib import admin
from .models import Recipe, UsageCount

admin.site.register(Recipe)
admin.site.register(UsageCount)
