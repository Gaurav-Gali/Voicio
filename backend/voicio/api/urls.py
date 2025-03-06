from django.urls import path
from .views import (
    supplier_list, supplier_detail,
    product_list, product_detail,
    transaction_list, transaction_detail
)

urlpatterns = [
    # Supplier URLs
    path('suppliers/', supplier_list, name='supplier_list'),
    path('suppliers/<int:supplier_id>/', supplier_detail, name='supplier_detail'),

    # Product URLs
    path('products/', product_list, name='product_list'),
    path('products/<int:product_id>/', product_detail, name='product_detail'),

    # Transaction URLs
    path('transactions/', transaction_list, name='transaction_list'),
    path('transactions/<int:transaction_id>/', transaction_detail, name='transaction_detail'),
]
