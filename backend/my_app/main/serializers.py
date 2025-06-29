
from rest_framework import serializers
from main.models import User

from main.models import Team, Feedback

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

# class TeamSerializer(serializers.ModelSerializer):
#     manager = serializers.PrimaryKeyRelatedField(read_only=True)
#     employee = UserSerializer(read_only=True)  
#     employee_id = serializers.PrimaryKeyRelatedField( 
#         source='employee',
#         queryset=User.objects.filter(role='employee'),
#         write_only=True
#     )

#     class Meta:
#         model = Team
#         fields = ['id', 'manager', 'employee', 'employee_id']

#     def validate(self, data):
#         employee = data.get('employee')
#         if employee and employee.role != 'employee':
#             raise serializers.ValidationError("Selected employee must have role 'employee'")
#         return data



class FeedbackSerializer(serializers.ModelSerializer):
    # manager = serializers.PrimaryKeyRelatedField(read_only=True)

    manager = UserSerializer(read_only=True)  
    employee = UserSerializer(read_only=True) 

   
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='employee'),
        source='employee',
        write_only=True,
        required=False
    )
    

    class Meta:
        model = Feedback
        fields = [
            'id', 'manager', 'employee', 'strengths', 'areas_to_improve',
            'sentiment', 'tags', 'employee_comments', 'acknowledged',
            'created_at', 'updated_at','employee_id'
        ]
        read_only_fields = ['created_at', 'updated_at', ]
       

    def create(self, validated_data):
        
        validated_data['manager'] = self.context['request'].user
        return super().create(validated_data)

class FeedbackAcknowledgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['acknowledged']

class FeedbackCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['employee_comments']

class TeamSerializer(serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.filter(role='manager'))
    employee = serializers.PrimaryKeyRelatedField(write_only=True, queryset=User.objects.filter(role='employee'))

    class Meta:
        model = Team
        fields = ['id', 'manager', 'employee']