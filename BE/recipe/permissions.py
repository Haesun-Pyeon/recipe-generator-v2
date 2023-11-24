from rest_framework.permissions import BasePermission


class CustomPermission(BasePermission):
    # /recipe/: 로그인 한 유저들만 추천레시피 목록 조회(GET), 새로 생성(POST) 가능
    def has_permission(self, request, view):
        return request.user.is_authenticated

    # /recipe/<int:pk>/: 본인의 추천레시피에만 접근(GET), 수정(PATCH), 삭제(DELETE) 가능
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
