# tasks/serializers.py
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {
            'title': {'error_messages': {'blank': 'Title cannot be blank.'}},
            'description': {'error_messages': {'blank': 'Description cannot be blank.'}},
            'status': {'error_messages': {'required': 'Status cannot be blank.'}},
            'priority': {'error_messages': {'required': 'Priority cannot be blank.'}},
            'due_date': {'error_messages': {'required': 'Due date cannot be blank.'}},
            'category': {'error_messages': {'required': 'Category cannot be blank.'}},
            'assigned_to': {'error_messages': {'required': 'Assigned to cannot be blank.'}},
        }