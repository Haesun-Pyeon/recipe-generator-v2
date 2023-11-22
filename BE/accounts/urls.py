# accounts/urls.py
from django.urls import path, include
from . import views
urlpatterns = [
    path('join/', include("dj_rest_auth.registration.urls")),
    path("", include("dj_rest_auth.urls")),
    path('test/', views.example_view, name='test'),
    path('mypage/', views.MyPageView.as_view(), name='mypage'),
]
