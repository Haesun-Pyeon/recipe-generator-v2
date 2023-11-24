from rest_framework.exceptions import APIException


class UsageExcessException(APIException):
    status_code = 403
    default_detail = '하루에 5번만 사용 가능합니다. 내일 다시 시도해주세요.'
    default_code = 'UsageExcess'
