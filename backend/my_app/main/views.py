
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from main.serializers import  UserLoginSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions


from rest_framework.exceptions import PermissionDenied


from rest_framework import generics

from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from rest_framework.exceptions import NotFound
from rest_framework import parsers

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'teacher'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'
    
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
    

class CreateAssignmentView(generics.CreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        if self.request.user.role != 'teacher':
            raise PermissionDenied("Only teachers can create assignments")
        serializer.save(teacher=self.request.user)

class ListAssignmentsView(generics.ListAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
class SubmitAssignmentView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        if self.request.user.role != 'student':
            raise PermissionDenied("Only students can submit assignments")
        assignment_id = self.kwargs.get('pk') 
        try:
            assignment = Assignment.objects.get(pk=assignment_id)
        except Assignment.DoesNotExist:
            raise NotFound("Assignment not found")
        serializer.save(student=self.request.user, assignment=assignment)


class ViewSubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return Submission.objects.filter( assignment__teacher=self.request.user)