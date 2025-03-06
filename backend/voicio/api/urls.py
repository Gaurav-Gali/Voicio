# Api urls
from django.urls import path
from .views import (
    get_all_products
)

urlpatterns = [
    path("", view=get_all_products, name="get-all-products")
]