from django.urls import path
from health_check.views import MainView

from api.v1.router import router as api_v1_router

urlpatterns = [
    path("api/v1/", api_v1_router.urls),
    # Health endpoint
    path("api/health", MainView.as_view(), name="health_check_home"),
]
