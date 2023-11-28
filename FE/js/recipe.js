import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('recipe.js 연결');

const token = await getToken();
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (token){
    // 파라미터에 id가 있을경우 -> 기존 정보의 입력 수정후 재추천
    if (id) {
        // 기존 정보를 받아오기 위한 GET요청
        const editResponse = await fetch(`${backend}recipe/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: 'GET',
        })
    
        if(!editResponse.ok) {
            const errorData = await editResponse.json();
            alert(errorData.detail + ' 수정이 불가능합니다.');
            window.location.replace(`${frontend}list.html`);
        }

        // 입력 항목에 기존 정보들을 채워줌
        const originRes = await editResponse.json();
        document.querySelector('#ingredient').value = originRes.input_ingredient;
        document.querySelector('#method1').checked = originRes.oven
        document.querySelector('#method2').checked = originRes.air_fryer
        document.querySelector('#method3').checked = originRes.gas_stove
        document.querySelector('#method4').checked = originRes.microwave
        document.querySelector('#ok').checked = originRes.additional
        document.querySelector('#no').checked = !originRes.additional

    }

    const $loading = document.querySelector("#loading");
    const $mainDiv = document.querySelector("#main-div");
    const $submit = document.querySelector('button[type="submit"]');
    $submit.addEventListener('click', async function(e) {
        e.preventDefault();
        // 통신하는 동안 로딩창 띄우기
        $mainDiv.setAttribute("style", "display:none;");
        $loading.setAttribute("style", "display:block;");

        // 입력값 가져오기
        const inputData = {
            "input_ingredient" : document.querySelector('#ingredient').value,
            "oven" : document.querySelector('#method1').checked,
            "air_fryer" : document.querySelector('#method2').checked,
            "gas_stove" : document.querySelector('#method3').checked,
            "microwave" : document.querySelector('#method4').checked,
            "additional" : document.querySelector('#ok').checked,
        }
        let url, method;
        if (id){ // 수정
            url = `${backend}recipe/${id}/`;
            method = "PATCH";
        }else{ // 생성
            url = `${backend}recipe/`;
            method = "POST"
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: method,
            body: JSON.stringify(inputData),
        });
        
        if(!response.ok) {
            const errorData = await response.json();
            alert(errorData.detail);
            window.location.reload(); 
        }
        
        // 성공 시 상세보기 창으로 넘어감
        const res = await response.json();
        window.location.replace(`${frontend}detail.html?id=${res.id}`);
    });
} else {
    // 토큰이 없을 시 로그인창으로 넘어가고 성공 시 다시 돌아옴
    alert("로그인을 해주세요.");
    window.location.replace(`${frontend}login.html?next=recipe.html`);
}