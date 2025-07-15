from django.views import View
from django.http import JsonResponse

# Create your views here.
class TestView(View):
    def get(self,request):
        return JsonResponse({'message':"Welcome"})