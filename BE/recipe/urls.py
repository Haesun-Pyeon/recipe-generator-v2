# recipe/urls.py
from . import views
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('recipe', views.RecipeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
