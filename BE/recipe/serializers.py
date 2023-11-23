from rest_framework.serializers import ModelSerializer
from .models import Recipe


class RecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['user', 'input_ingredient', 'oven',
                  'air_fryer', 'gas_stove', 'microwave', 'additional']
