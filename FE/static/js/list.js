import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('list.js 연결');

const urlParams = new URLSearchParams(window.location.search);
// page 파라미터가 없을 경우 첫페이지로 설정
let page = parseInt(urlParams.get('page'));
if (!page) {
    page = 1;
}

const token = await getToken();
if (token){
    // 유저의 레시피 목록 GET요청
    const response = await fetch(`${backend}recipe/?page=${page}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'GET',
    })
    // 실패 시 에러메세지를 띄우고 홈으로 감
    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail);
        window.location.replace(frontend);
    }
    const res = await response.json();
    
    // 앞 뒤 페이지가 있을 경우 링크설정
    const $left = document.querySelector('.fa-angle-left');
    const $right = document.querySelector('.fa-angle-right');
    if (res.previous){
        $left.setAttribute('onclick', `location.href='${frontend}list/?page=${page-1}'`)
    } else {
        $left.setAttribute('onclick', "alert('이전 페이지가 없습니다.');")
    }
    if (res.next){
        $right.setAttribute('onclick', `location.href='${frontend}list/?page=${page+1}'`)
    } else {
        $right.setAttribute('onclick', "alert('다음 페이지가 없습니다.');")
    }

    // 유저의 레시피항목이 있을 경우 목록 테이블에 추가
    if (res.count > 0) {
        const $tbody = document.querySelector('tbody');
        const $none = document.querySelector('#none');
        $none.setAttribute('style', 'display:none;');

        for (let i = 0; i < res.count; i++) {
            const url = `${frontend}detail/?id=${res.results[i].id}`;
    
            const $tr = document.createElement('tr');
            $tr.setAttribute('class', 'click-tr');
            $tr.setAttribute('onclick', "location.href='"+url+"'");
    
            const $order = document.createElement('td');
            $order.innerText = res.count - (page-1)*10 - i;
    
            const $inputs = document.createElement('td');
            $inputs.setAttribute('class', 'tal');
            $inputs.innerText = res.results[i].input_ingredient;
    
            const $title = document.createElement('td');
            $title.setAttribute('class', 'tal');
            $title.innerText = res.results[i].title;
    
            const date = new Date(res.results[i].created_at);
            const $date = document.createElement('td');
            $date.innerText = `${date.getMonth()}/${date.getDate()}`;
    
            $tbody.appendChild($tr);
            $tr.appendChild($order);
            $tr.appendChild($inputs);
            $tr.appendChild($title);
            $tr.appendChild($date);
        }
    }

    // 전체삭제 버튼
    const $deleteAll = document.querySelector('.delete-all');
    $deleteAll.addEventListener('click', async function(e) {
        e.preventDefault();
        alert("정말 전부 삭제하시겠습니까?");

        // 전체삭제함수에 delete요청
        const response = await fetch(`${backend}recipe/all/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: 'DELETE',
        })
    
        if(!response.ok) {
            const errorData = await response.json();
            alert(errorData.detail);
            window.location.replace(`${frontend}list/`);
        }

        alert('전부 삭제되었습니다.');
        window.location.reload();
    });
} else {
    // 토큰이 없을 시 로그인창으로 넘어가고 성공 시 다시 돌아옴
    alert("로그인을 해주세요.")
    window.location.replace(`${frontend}login/?next=list/`);
}