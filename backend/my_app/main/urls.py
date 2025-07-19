from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    CreateAssignmentView,
    ListAssignmentsView,
    SubmitAssignmentView,
    ViewSubmissionsView,
    UserRegistrationView, UserLoginView,
    
)

urlpatterns = [

  
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),

    # teacher
    path('create-assignment/', CreateAssignmentView.as_view(), name='create-assignment'),
    path('view-submissions/', ViewSubmissionsView.as_view(), name='view-submissions'),
    
  
    # student
   path('submit-assignment/<int:pk>/', SubmitAssignmentView.as_view(), name='submit-assignment'),
   path('view-assignments/', ListAssignmentsView.as_view(), name='list-assignments'),
]

