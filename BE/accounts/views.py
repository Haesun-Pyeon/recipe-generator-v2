# accounts/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def userinfo(request):
    # request.user는 인증된 사용자의 정보를 담고 있습니다.
    print(request.data)
    content = {'message': '님 어서오세요!', 'user': str(request.user)}
    return Response(content)


class MyPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'message': f"반갑습니다, {user.email}님!"})
