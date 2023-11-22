from django.urls import path
from . import views

urlpatterns = [
    path('', views.recipe_input, name='recipe_input'),
    path('<int:pk>/', views.recipe_detail, name='recipe_detail'),
    path('list/', views.recipe_list, name='recipe_list'),
]
