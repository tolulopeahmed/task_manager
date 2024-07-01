from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, index, signup, task_list, task_status_list
from django.contrib.auth import views as auth_views
from . import views

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('signup/', signup, name='signup'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('api/', include(router.urls)),
    path('api/tasks/search/', TaskViewSet.as_view({'get': 'search'}), name='task-search'),
    path('tasks/', task_list, name='task_list'),
    path('tasks/<str:status>/', task_status_list, name='task_status_list'),
    path('tasks/<int:pk>/delete/', TaskViewSet.as_view({'delete': 'delete_task'}), name='task-delete'),
    path('main/', views.main_page, name='main_page'),
]
