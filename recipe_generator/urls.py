from django.contrib import admin
from django.urls import path, include
from recipe.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('recipe/', include('recipe.urls')),
    path('accounts/', include('accounts.urls')),
]
