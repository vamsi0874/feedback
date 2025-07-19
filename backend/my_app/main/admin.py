from django.contrib import admin
from .models import User, Feedback, Team
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_admin')
    search_fields = ('email', 'name')
    ordering = ('email',)
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(User, UserAdmin)
admin.site.register(Team)
admin.site.register(Feedback)
