from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Assignment, Submission

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_admin')
    search_fields = ('email', 'name')
    ordering = ('email',)
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(User, UserAdmin)
admin.site.register(Assignment)
admin.site.register(Submission)

