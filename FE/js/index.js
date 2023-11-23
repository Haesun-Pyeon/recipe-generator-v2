import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('index.js 연결');

const token = await getToken();
const $btn1 = document.querySelector('#btn1');
const $btn2 = document.querySelector('#btn2');
const $message = document.querySelector('#message');

if (token){
    await showLogin();
    $btn1.innerHTML = '추천받기';
    $btn1.setAttribute('onclick', "location.href='"+frontend+"./recipe.html'");
    $btn2.innerHTML = '불러오기';
    $btn2.setAttribute('onclick', "location.href='"+frontend+"./list.html'");
    // 로그인 O -> 로그아웃, (마이페이지), 추천받기, 불러오기 버튼
} else {
    $btn1.innerHTML = '로그인';
    $btn1.setAttribute('onclick', "location.href='"+frontend+"./login.html'");
    $btn2.innerHTML = '회원가입';
    $btn2.setAttribute('onclick', "location.href='"+frontend+"./join.html'");
    $message.innerHTML = '로그인을 해야 서비스 이용이 가능합니다!';
    // 로그인 X -> 로그인, 회원가입 버튼
}

async function showLogin() {
    const response = await fetch(backend + 'accounts/user/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    const res = await response.json();
    $message.innerHTML = '반갑습니다, ' + res.email + '님!';
}