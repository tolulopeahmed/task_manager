# tasks/tests.py
from django.test import TestCase
from django.urls import reverse

class MainPageTests(TestCase):

    def test_main_page_loads(self):
        response = self.client.get(reverse('main_page'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'mainpage.html')

    def test_toggle_sidebar_function(self):
        # Assuming you need to simulate a POST request to toggle_sidebar function
        data = {
            # Add necessary data here for toggleSidebar function testing
        }
        response = self.client.post('/toggle_sidebar/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # Add assertions based on expected behavior of toggleSidebar function

    def test_load_tasks_function(self):
        # Simulate a GET request to load_tasks function
        response = self.client.get('/load_tasks/')
        self.assertEqual(response.status_code, 200)
        # Add assertions based on expected behavior of loadTasks function
