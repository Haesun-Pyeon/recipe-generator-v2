from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, 'home.html')


def recipe_input(request):
    return render(request, 'input.html')


def recipe_detail(request):
    return render(request, 'detail.html')


def recipe_list(request):
    return render(request, 'list.html')
