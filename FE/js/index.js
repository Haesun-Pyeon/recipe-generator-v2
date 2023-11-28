import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('index.js 연결');

const token = await getToken();
const $btn1 = document.querySelector('#btn1');
const $btn2 = document.querySelector('#btn2');
const $message = document.querySelector('#message');

if (token){
    // 로그인 O -> 메인에 추천받기/불러오기 버튼
    await showLogin();
    $btn1.innerHTML = '추천받기'; 
    $btn1.setAttribute('onclick', `location.href='${frontend}recipe.html'`);
    $btn2.innerHTML = '불러오기';
    $btn2.setAttribute('onclick', `location.href='${frontend}list.html'`);
} else {
    // 로그인 X -> 메인에 로그인/회원가입 버튼, 헤더 우측(추천받기/불러오기/로그아웃) 안 보이게함
    $btn1.innerHTML = '로그인';
    $btn1.setAttribute('onclick', `location.href='${frontend}login.html'`);
    $btn2.innerHTML = '회원가입';
    $btn2.setAttribute('onclick', `location.href='${frontend}join.html'`);
    $message.innerHTML = '로그인을 해야 서비스 이용이 가능합니다!';

    const $headerAtag = document.querySelectorAll('header h1~a');
    $headerAtag.forEach(element => {
        element.setAttribute('style', 'display:none;')
    });
}

async function showLogin() {
    // 토큰으로 유저 정보 GET 요청
    const response = await fetch(`${backend}accounts/user/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'GET',
    })

    const res = await response.json();
    $message.innerHTML = '반갑습니다, ' + res.email + '님!';
}