from django.urls import include

from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('base.api.urls')),  # Include the API URLs from the base app
    path('api/', include('main.urls')),  # Include the API URLs from the base app
]
