from django.db import models
# Create your models here.

class Supplier(models.Model):
    supplier_name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.supplier_name

class Product(models.Model):
    product_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.IntegerField()
    reorder_level = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name

class Transaction(models.Model):
    TRANSACTION_TYPES = [('purchase', 'Purchase'), ('sale', 'Sale'), ('return', 'Return')]
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    transaction_date = models.DateTimeField(auto_now_add=True)

    
