from django.test import TestCase
from django.contrib.auth.models import User
from .models import Task

class TaskModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.task = Task.objects.create(
            title='Test Task',
            description='This is a test task.',
            status='In Progress',
            priority='High',
            due_date='2024-06-30T12:00:00Z',
            category='Test',
            assigned_to=self.user
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.assigned_to.username, 'testuser')
