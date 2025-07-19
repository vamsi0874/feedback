from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.utils import timezone


class UserManager(BaseUserManager):
  def create_user(self, email, name, role='employee', password=None):
      
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          name=name,
          role=role,
      )
      print(f"Creating user with role: {role}")  # Debugging line
      if role == 'Manager':
          user.is_superuser = True
          user.is_admin = True

      user.set_password(password)
      user.save(using=self._db)
      return user
  
  def create_superuser(self, email, name, password=None):
        
        user = self.create_user(email, name, role='manager', password=password)
        user.is_admin = True
        

        user.is_staff = True
        user.is_superuser = True
        

        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
  
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  name = models.CharField(max_length=200)
  role = models.CharField(max_length=20, default='employee')  # Default role is 'employee'
  is_active = models.BooleanField(default=True)
  is_admin = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
 #---------
  is_staff = models.BooleanField(default=False)
  is_superuser = models.BooleanField(default=False)
  #-----------

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name']

  def __str__(self):
      return self.email
  
  def has_perm(self, perm, obj=None):
      "Does the user have a specific permission?"

      return self.is_admin

  def has_module_perms(self, app_label):
      "Does the user have permissions to view the app `app_label`?"
      
      return True
  
  @property
  def is_staff(self):
    return self.is_admin

class Team(models.Model):
    manager = models.ForeignKey(User, related_name='team_members', on_delete=models.CASCADE, limit_choices_to={'role': 'manager'})
    employee = models.ForeignKey(User, related_name='manager_of', on_delete=models.CASCADE, limit_choices_to={'role': 'employee'})

    class Meta:
        unique_together = ('manager', 'employee')

    def __str__(self):
        return f"{self.manager.name} → {self.employee.name}"



class Feedback(models.Model):
    SENTIMENT_CHOICES = (
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    )

    manager = models.ForeignKey(User, related_name='given_feedbacks', on_delete=models.CASCADE, limit_choices_to={'role': 'manager'})
    employee = models.ForeignKey(User, related_name='received_feedbacks', on_delete=models.CASCADE, limit_choices_to={'role': 'employee'})
    
    strengths = models.TextField()
    areas_to_improve = models.TextField()
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES)
    
    tags = models.JSONField(blank=True, null=True)  # Example: ["leadership", "communication"]
    employee_comments = models.TextField(blank=True, null=True)
    acknowledged = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Feedback from {self.manager.name} to {self.employee.name}"
    
