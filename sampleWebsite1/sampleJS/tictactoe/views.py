from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


def index(request):
    import os
    print(os.getcwd())
    return render(request, os.getcwd()+"/templates/index.html")