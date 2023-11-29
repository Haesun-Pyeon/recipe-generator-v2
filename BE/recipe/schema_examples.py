from drf_spectacular.utils import OpenApiExample

response = {
    "id": 1,
    "input_ingredient": "밀가루, 감자, 버섯",
    "oven": False,
    "air_fryer": False,
    "gas_stove": True,
    "microwave": False,
    "additional": True,
    "content": "밀가루, 감자, 버섯을/를 이용한 요리의 레시피를 한 가지 알려줘. 가열할 수 있는 기구는 가스레인지만 있어. 레피시명:, 재료:, 요리방법: 순서로 알려주고 다른 말은 하지 말아줘.",
    "answer": "레시피명: 감자 버섯 전\n\n재료:\n- 밀가루 1컵\n- 감자 2개 (중간 크기)\n- 버섯 100g\n- 식용유\n- 소금\n- 후추\n\n요리방법:\n1. 감자를 깨끗이 씻어 껍질을 벗긴 후, 가늘게 채 썰어주세요.\n2. 버섯은 깨끗이 닦아서 얇게 슬라이스 해주세요.\n3. 밀가루를 그릇에 넣고, 소금과 후추를 넣어 가루에 골고루 섞어주세요.\n4. 감자와 버섯을 가루에 넣고, 가루에 잘 묻히도록 버무려주세요.\n5. 가스레인지에 팬을 달고, 중간 불로 예열해주세요.\n6. 예열이 끝나면 팬에 식용유를 넉넉히 두르고, 가루에 버무려진 감자와 버섯을 올려주세요.\n7. 한쪽 면이 바삭하게 익을 때까지 약 3분 정도 구워주세요.\n8. 접시에 옮겨서 소금과 후추로 간을 해주세요.\n9. 남은 감자와 버섯도 같은 방법으로 전을 만들어주세요.\n10. 완성된 감자 버섯 전을 맛있게 즐겨주세요.",
    "title": "감자 버섯 전",
    "ingredient": "밀가루 1컵, 감자 2개 (중간 크기), 버섯 100g, 식용유, 소금, 후추",
    "recipe": "<li>감자를 깨끗이 씻어 껍질을 벗긴 후, 가늘게 채 썰어주세요.</li><li>버섯은 깨끗이 닦아서 얇게 슬라이스 해주세요.</li><li>밀가루를 그릇에 넣고, 소금과 후추를 넣어 가루에 골고루 섞어주세요.</li><li>감자와 버섯을 가루에 넣고, 가루에 잘 묻히도록 버무려주세요.</li><li>가스레인지에 팬을 달고, 중간 불로 예열해주세요.</li><li>예열이 끝나면 팬에 식용유를 넉넉히 두르고, 가루에 버무려진 감자와 버섯을 올려주세요.</li><li>한쪽 면이 바삭하게 익을 때까지 약 </li><li>정도 구워주세요.</li><li>접시에 옮겨서 소금과 후추로 간을 해주세요.</li><li>남은 감자와 버섯도 같은 방법으로 전을 만들어주세요.</li><li>완성된 감자 버섯 전을 맛있게 즐겨주세요.</li>",
    "img_url": "https://images.unsplash.com/photo-1597585588073-091447702d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzIzMjZ8MHwxfHNlYXJjaHwxfHwlRUElQjAlOTAlRUMlOUUlOTAlMjAlRUIlQjIlODQlRUMlODQlQUYlMjAlRUMlQTAlODR8a298MHx8fHwxNzAxMjMyNDUxfDA&ixlib=rb-4.0.3&q=80&w=1080",
    "created_at": "2023-11-28T18:22:45.393447+09:00",
    "updated_at": "2023-11-29",
    "user": 2
}

RECIPE_REQUEST = OpenApiExample(
    request_only=True,
    name="레시피 추천 받기",
    value={
        "input_ingredient": "밀가루, 감자, 버섯",
        "oven": False,
        "air_fryer": False,
        "gas_stove": True,
        "microwave": False,
        "additional": True
    },
)

RECIPE_RESPONSE = OpenApiExample(
    response_only=True,
    name="추천된 레시피",
    value=response,
)

RECIPE_LIST = OpenApiExample(
    response_only=True,
    name="레시피 목록 조회",
    value=response,
)
