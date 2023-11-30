# recipe/views.py
from .models import Recipe, UsageCount
from .exceptions import UsageExcessException
from .pagination import RecipePagination
from .permissions import RecipePermission
from .serializers import RecipeSerializer
from .schema_examples import RECIPE_LIST, RECIPE_REQUEST, RECIPE_RESPONSE
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.conf import settings
from datetime import date
from openai import OpenAI
import re
import requests


@extend_schema_view(
    list=extend_schema(  # GET recipe/
        description="요청을 보낸 유저가 생성한 레시피들을 전부 가져옵니다. 페이지네이션을 이용하여 한 페이지에 최대 10개씩 보여줍니다. 로그인을 한 유저만 이용 가능합니다.",
        request=RecipeSerializer,
        responses={200: RecipeSerializer},
        examples=[RECIPE_LIST],
    ),
    create=extend_schema(  # POST recipe/
        description="현재 가지고 있는 **식재료**, 사용 가능한 **조리기구**, 재료 **추가여부**를 입력 받아 추천 레시피를 생성해줍니다.  저장하기 전에, 입력값들로 1. `chatGPT`에게 물어볼 말을 만들고, 2. `chatGPT`에게 물어본 후, 3. 추천 받은 레시피를 **요리 제목**, **필요한 재료**, **만드는 방법**으로 나누고, 4. 요리와 연관된 **사진**도 `Unsplash API`를 이용하여 검색해서 링크를 같이 저장합니다.  `check_usage` 데코레이터를 이용하여 유저 당 하루 5회로 **사용횟수를 제한**합니다. 로그인을 한 유저만 이용 가능합니다.",
        request=RecipeSerializer,
        responses={201: RecipeSerializer},
        examples=[RECIPE_REQUEST, RECIPE_RESPONSE],
    ),
    retrieve=extend_schema(  # GET recipe/<id>/
        description="`id`를 이용해서 해당 레시피 정보를 가져옵니다. 로그인을 한 유저가 본인의 레시피만 가져올 수 있습니다.",
        request=RecipeSerializer,
        responses={200: RecipeSerializer},
        examples=[RECIPE_RESPONSE],
    ),
    partial_update=extend_schema(  # PATCH recipe/<id>/
        description="`id`를 이용해서 해당 레시피 객체에 새로운 입력값으로 새로운 레시피를 추천받아 정보를 업데이트합니다. 전체 수정이 아닌 부분만 수정이 될 수도 있으므로 `PUT`대신 `PATCH`를 이용합니다. 로그인을 한 유저가 본인의 레시피만 수정할 수 있습니다.",
        request=RecipeSerializer,
        responses={200: RecipeSerializer},
        examples=[RECIPE_REQUEST, RECIPE_RESPONSE],
    ),
    destroy=extend_schema(  # DELETE recipe/<id>/
        description="`id`를 이용해서 해당 레시피 정보를 삭제합니다. 로그인을 한 유저가 본인의 레시피만 삭제할 수 있습니다.",
        request=RecipeSerializer,
        responses={204: RecipeSerializer},
    ),
    all=extend_schema(  # DELETE recipe/all/
        description="요청을 보낸 유저가 생성했던 레시피를 전체 삭제합니다. 로그인을 한 유저가 본인의 레시피들만 전체 삭제할 수 있습니다.",
        request=RecipeSerializer,
        responses={204: RecipeSerializer},
    ),
    update=extend_schema(deprecated=True, exclude=True)
)
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [RecipePermission]
    pagination_class = RecipePagination

    # 해당 유저의 객체만 조회
    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(user=self.request.user)
        return qs

    def perform_create(self, serializer):
        self.perform_logic(serializer, is_create=True)

    def perform_update(self, serializer):
        self.perform_logic(serializer, is_create=False)

    # 전체 삭제
    @action(detail=False, methods=['delete'])
    def all(self, request):
        queryset = self.get_queryset()
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # 유저의 사용량을 체크하는 데코레이터 (하루 5회 제한)
    def check_usage(func):
        def wrapper(self, *args, **kwargs):
            today = date.today()
            usage_count, created = UsageCount.objects.get_or_create(
                user=self.request.user)
            if usage_count.used_date != today:
                usage_count.count = 0
                usage_count.used_date = today
            elif usage_count.count >= 5:
                raise UsageExcessException()
            func(self, *args, **kwargs)
            usage_count.count += 1
            usage_count.save()
        return wrapper

    # 객체 저장 전, 정보 추가 후 같이 저장
    @check_usage
    def perform_logic(self, serializer, is_create):
        data = self.request.data if is_create else serializer.validated_data
        user = self.request.user

        content = self.make_content(data)
        gpt_response = self.send_gpt(content)
        answer = gpt_response.choices[0].message.content
        title, ingredient, recipe = self.process_answer(answer)
        img_url = self.get_unsplash_img(title)

        serializer.save(user=user, content=content, answer=answer, title=title,
                        ingredient=ingredient, recipe=recipe, img_url=img_url)

    # chatGPT한테 물어볼 말 생성
    @staticmethod
    def make_content(data):
        ingredients = data.get('input_ingredient')
        oven = data.get('oven')
        air_fryer = data.get('air_fryer')
        gas_stove = data.get('gas_stove')
        microwave = data.get('microwave')
        additional = data.get('additional')

        content = f'{ingredients}을/를 이용한 요리의 레시피를 한 가지 알려줘. 가열할 수 있는 기구는 '
        equipments = [oven, air_fryer, gas_stove, microwave]
        equipments_trans = ['오븐', '에어프라이어', '가스레인지', '전자레인지']
        for is_checked, equipment in zip(equipments, equipments_trans):
            if is_checked:
                content += equipment + ', '
        if not (oven or air_fryer or gas_stove or microwave):
            content += '없어. '
        else:
            content = content[:-2] + '만 있어. '
        if not additional:
            content += "추가재료는 안들어갔으면 좋겠어. "
        content += "레피시명:, 재료:, 요리방법: 순서로 알려주고 다른 말은 하지 말아줘."
        return content

    # chatGPT에게 요청
    @staticmethod
    def send_gpt(content):
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(model="gpt-3.5-turbo", temperature=0.5, messages=[
            {"role": "system", "content": "assistant는 여러가지 요리 레시피에 대해 잘 아는 요리사입니다."},
            {"role": "user", "content": content},
        ],)
        return response

    # chatGPT에게 받은 답변 가공
    @staticmethod
    def process_answer(answer):
        title, ingredient = answer.split("재료:")
        if ':' in title:
            title = title.split(":")[1]

        ingredient, recipe = ingredient.split("요리방법:")
        ingredient = ingredient.replace("- ", "")
        ingredient = ingredient.replace("\n\n", "")
        ingredient = re.sub("\n", ', ', ingredient)[2:]

        if '\n\n' in recipe:
            recipe = recipe.split('\n\n')[0]
        recipe = re.sub("\n", '', recipe)
        recipe = re.sub('(\d+\. )', '</li><li>', recipe)[5:] + '</li>'

        return title.strip(), ingredient.strip(), recipe.strip()

    # Unsplash 사진 검색
    @staticmethod
    def get_unsplash_img(title):
        unsplash_key = settings.UNSPLASH_ACCESS_KEY
        url = f'https://api.unsplash.com/search/photos?query={title}&client_id={unsplash_key}&lang=ko&orientaion=squarish'
        response = requests.get(url)
        return response.json()['results'][0]['urls']['regular']
