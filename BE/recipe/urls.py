# recipe/urls.py
from django.urls import include, path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('recipe', views.RecipeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
