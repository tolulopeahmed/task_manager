from django.db import models

class Task(models.Model):
    STATUS_CHOICES = [
        ('inprogress', 'In Progress'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    CATEGORY_CHOICES = [
        ('UX Design', 'UX Design'),
        ('Development', 'Development'),
        ('Production', 'Production'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    due_date = models.DateTimeField()
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    assigned_to = models.CharField(max_length=50)

    def __str__(self):
        return self.title
