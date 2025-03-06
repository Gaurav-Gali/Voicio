from rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.

@api_view(["get"])
def get_all_products(request):
    return Response("All products" ,status=200)