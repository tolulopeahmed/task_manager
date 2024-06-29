from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer
from rest_framework.parsers import JSONParser

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    parser_classes = [JSONParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='in_progress')
    def in_progress(self, request):
        tasks = Task.objects.filter(status='in_progress')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='completed')
    def completed(self, request):
        tasks = Task.objects.filter(status='completed')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='overdue')
    def overdue(self, request):
        tasks = Task.objects.filter(status='overdue')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        tasks = Task.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

def index(request):
    return render(request, 'index.html')  # Ensure you have an 'index.html' template

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

def task_list(request):
    return render(request, 'task_list.html')  # Ensure you have a 'task_list.html' template

def task_status_list(request, status):
    return render(request, 'task_status_list.html', {'status': status})  # Ensure you have a 'task_status_list.html' template
