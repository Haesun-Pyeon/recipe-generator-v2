from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def example_view(request):
    # request.user는 인증된 사용자의 정보를 담고 있습니다.
    print(request.data)
    content = {'message': 'Hello, World!', 'user': str(request.user)}
    return Response(content)


class MyPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return HttpResponse(f"<h1>반갑습니다, {user.email}님!</h1>")
