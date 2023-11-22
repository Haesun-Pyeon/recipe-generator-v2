# recipe.views.py
from django.shortcuts import render


def recipe_input(request):
    return render(request, 'input.html')


def recipe_detail(request):
    return render(request, 'detail.html')


def recipe_list(request):
    return render(request, 'list.html')
