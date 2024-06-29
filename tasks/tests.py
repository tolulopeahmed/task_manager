from django.test import TestCase
from django.contrib.auth.models import User
from .models import Task

class TaskModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            status='In Progress',
            priority='High',
            due_date='2024-07-01 12:00:00',
            category='Work',
            assigned_to=self.user
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.status, 'In Progress')
        self.assertEqual(self.task.priority, 'High')

