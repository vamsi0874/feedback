
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from main.serializers import  UserLoginSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions
from main.models import  Team, Feedback

from rest_framework.exceptions import PermissionDenied
from main.serializers import  FeedbackSerializer, FeedbackCommentSerializer

from .serializers import TeamSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework import generics
from main.models import User


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'manager' or 'Manager'

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'Employee' or 'employee'
    
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  refresh['email'] = user.email
  refresh['name'] = user.name
  refresh['role'] = user.role
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()
        token = get_tokens_for_user(user)

        return Response(
            {
                'message': 'User registered successfully.',
                'tokens': token
            },
            status=status.HTTP_201_CREATED
        )

class UserLoginView(APIView):
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    user = authenticate(email=email, password=password)
    
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'tokens':token}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':"User not found"}, status=status.HTTP_400_BAD_REQUEST)


class AcknowledgeFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            feedback = Feedback.objects.get(pk=pk)
        except Feedback.DoesNotExist:
            return Response({'error': 'Feedback not found'}, status=404)

        if feedback.employee != request.user:
            raise PermissionDenied("You can only acknowledge feedback assigned to you.")

        feedback.acknowledged = True
        feedback.save()
        return Response({'status': 'acknowledged'})
    
class CommentOnFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployee]

    def patch(self, request, pk):
        try:
            feedback = Feedback.objects.get(pk=pk, employee=request.user)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FeedbackCommentSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Comment added"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'manager':
            return Response({"detail": "Only managers can access this dashboard."}, status=403)

     
        teams = Team.objects.filter(manager=user).select_related('employee')
        employee_ids = teams.values_list('employee__id', flat=True)
        employees = list({t.employee for t in teams})

        data = {
            "team_size": len(employees),
            "total_feedbacks": Feedback.objects.filter(manager=user).count(),
            "employees": []
        }

        for emp in employees:
            feedbacks = Feedback.objects.filter(manager=user, employee=emp)
            sentiment_summary = {
                "positive": feedbacks.filter(sentiment="positive").count(),
                "neutral": feedbacks.filter(sentiment="neutral").count(),
                "negative": feedbacks.filter(sentiment="negative").count(),
            }

            data["employees"].append({
                "id": emp.id,
                "name": emp.name,
                "feedback_count": feedbacks.count(),
                "sentiment_summary": sentiment_summary
            })

        return Response(data)

class ManagerFeedbackForEmployeeView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        manager = self.request.user
        employee_id = self.kwargs.get("employee_id")

        return Feedback.objects.filter(manager=manager, employee__id=employee_id)
    
class FeedbackByEmployeeView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        employee_id = self.kwargs.get("employee_id")
        return Feedback.objects.filter(employee__id=employee_id)

# create feedback for employee
class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)




class FeedbackUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        print(f"Manager {self.request.user.email} is updating feedback with ID {obj.id}")
        if obj.manager != self.request.user:
            raise PermissionDenied("You are not allowed to update this feedback.")
        return obj
    

class EmployeeFeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Feedback.objects.filter(employee=user)
    

class TeamCreateView(generics.CreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        manager_id = request.data.get('manager')
        employee_id = request.data.get('employee')

        if not manager_id or not employee_id:
            return Response({"detail": "Both manager and employee IDs are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate roles
        try:
            manager = User.objects.get(id=manager_id, role='manager')
            employee = User.objects.get(id=employee_id, role='employee')
        except User.DoesNotExist:
            return Response({"detail": "Invalid manager or employee."}, status=status.HTTP_400_BAD_REQUEST)

        # Check for duplicate team assignment
        if Team.objects.filter(manager=manager, employee=employee).exists():
            return Response({"detail": "This employee is already assigned to the manager."}, status=status.HTTP_409_CONFLICT)

        team = Team.objects.create(manager=manager, employee=employee)
        serializer = TeamSerializer(team)
        return Response(serializer.data, status=status.HTTP_201_CREATED)