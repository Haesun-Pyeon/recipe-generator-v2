# recipe/views.py
from .models import Recipe, UsageCount
from .permissions import CustomPermission
from .serializers import RecipeSerializer
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from datetime import date
from openai import OpenAI
import re

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [CustomPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(user=self.request.user)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        data = self.request.data
        usage_count = self.update_usage_count(user)
        if usage_count.count > 5:
            return Response({'message': '하루 사용량 5번을 초과했습니다.'}, status=status.HTTP_403_FORBIDDEN)

        content = self.make_content(data)
        gpt_response = self.send_gpt(content)
        answer = gpt_response.choices[0].message.content
        title, ingredient, recipe = self.process_answer(answer)

        serializer.validated_data['content'] = content
        serializer.validated_data['answer'] = answer
        serializer.validated_data['title'] = title
        serializer.validated_data['ingredient'] = ingredient
        serializer.validated_data['recipe'] = recipe
        serializer.save(user=user)

    def make_content(self, data):
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
    # ex) 감자, 대파, 버섯, 소세지, 밥을/를 이용한 요리의 레시피를 한 가지 알려줘. 가열할 수 있는 기구는 가스레인지, 에어프라이어만 있어. 추가재료는 안들어갔으면 좋겠어. 레피시명:, 재료:, 요리방법: 순서로 알려주고 다른 말은 하지 말아줘.

    def send_gpt(self, content):
        response = client.chat.completions.create(model="gpt-3.5-turbo", messages=[
            {"role": "system", "content": "assistant는 여러가지 요리 레시피에 대해 잘 아는 요리사입니다."},
            {"role": "user", "content": content},
        ],)
        return response

    def update_usage_count(self, user):
        today = date.today()
        usage_count, created = UsageCount.objects.get_or_create(user=user)
        if usage_count.used_date != today:
            usage_count.count = 0
        usage_count.count += 1
        usage_count.used_date = today
        usage_count.save()
        return usage_count

    def process_answer(self, answer):
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
        recipe = re.sub('\d+. ', '</li><li>', recipe)[5:] + '</li>'

        return title.strip(), ingredient.strip(), recipe.strip()
