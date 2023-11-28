import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('detail.js 연결');

const token = await getToken();
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (token){
    // 레시피 상세보기 데이터 요청
    const response = await fetch(`${backend}recipe/${id}/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'GET',
    })

    // 실패시 목록으로 돌아감
    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail);
        window.location.replace(frontend + 'list.html');
    }
    const res = await response.json();

    // 받아온 데이터로 내용 채우기
    const $img = document.querySelector('img');
    const $title = document.querySelector('h2');
    const $ingredient = document.querySelector('.ingredient p');
    const $recipe = document.querySelector('.recipe ol');

    if (res.img_url){
        $img.setAttribute('src', res.img_url);
    }
    $title.innerText = res.title
    $ingredient.innerText = res.ingredient;
    $recipe.innerHTML = res.recipe;

    const $edit = document.querySelector('#edit');
    const $del = document.querySelector('#del');

    // 수정하기: id와 함께 입력받는 창으로 넘어감
    $edit.addEventListener('click', async function(e){
        window.location.replace(`${frontend}recipe.html?id=${id}`);
    });
    // 삭제하기: DELETE요청으로 삭제함
    $del.addEventListener('click', async function(e){
        const response = await fetch(`${backend}recipe/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: 'DELETE',
        })

        if(response.ok) {
            alert('삭제되었습니다.');
            window.location.replace(frontend + 'list.html');
        }
    });
} else {
    // 토큰이 없을 시 로그인창으로 넘어가고 성공 시 다시 돌아옴
    alert("로그인을 해주세요."); 
    window.location.replace(`${frontend}login.html?next=detail.html?id=${id}`);
}