
from rest_framework import serializers
from main.models import User
from .models import Assignment, Submission

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        name = attrs.get('name', '')

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})

        if User.objects.filter(name=name).exists():
            raise serializers.ValidationError({'name': 'A user with this name already exists.'})

        return attrs

    def create(self, validated_data):
        validated_data['email'] = validated_data['email'].lower()  
        return User.objects.create_user(**validated_data)
    


class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role']


class AssignmentSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    class Meta:
        model = Assignment
        fields = '__all__'
        read_only_fields = ['teacher']

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['student', 'submitted_at','assignment']