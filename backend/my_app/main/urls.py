from django.urls import path
# from rest_framework_simplejwt.views import (
#     TokenRefreshView,
# )
# from .views import MyTokenObtainPairView

from .views import (
    UserRegistrationView,
    UserLoginView,
    AcknowledgeFeedbackView,
    FeedbackUpdateView,
    ManagerDashboardView,
    EmployeeFeedbackListView,
    ManagerFeedbackForEmployeeView,
    FeedbackCreateView,
    CommentOnFeedbackView,
    TeamCreateView,
)

urlpatterns = [
    
  
  

    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

     path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    
    path('dashboard/', ManagerDashboardView.as_view(), name='manager-dashboard'),

    path('feedbacks/manager/employee/<int:employee_id>/', ManagerFeedbackForEmployeeView.as_view(), name='manager-feedback-employee'),


    path('feedbacks/create/', FeedbackCreateView.as_view(), name='create-feedback'),

    # update
    path('feedbacks/<int:pk>/update/', FeedbackUpdateView.as_view(), name='feedback-update'),

     #my feedbacks
    path('my-feedbacks/', EmployeeFeedbackListView.as_view(), name='my-feedbacks'),


    path('feedbacks/<int:pk>/acknowledge/', AcknowledgeFeedbackView.as_view(), name='acknowledge-feedback'),

    path('feedbacks/<int:pk>/comment/', CommentOnFeedbackView.as_view(), name='feedback-comment'),
    
    path('teams/create/', TeamCreateView.as_view(), name='create-team'),

]

