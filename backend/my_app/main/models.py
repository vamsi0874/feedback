from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser



class UserManager(BaseUserManager):
  
    def create_user(self, email, name, role='student', password=None):
        
        if not email:
            raise ValueError('User must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            role=role,
        )
        print(f"Creating user with role: {role}")  
        if role == 'teacher':
            user.is_superuser = True
            user.is_admin = True

        user.set_password(password)
        user.save(using=self._db)
        return user
  
    def create_superuser(self, email, name, password=None):
            
            user = self.create_user(email, name, role='teacher', password=password)
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
    role = models.CharField(max_length=20, default='student')  
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)


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
    



class Assignment(models.Model):

    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    file = models.FileField(upload_to='assignments/',blank=True,null=True)
  

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    file = models.FileField(upload_to='submissions/',blank=True,null=True)
    comment = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.assignment.title}"