import { backend, frontend } from "./url.js";
console.log('login.js 연결');

const $login = document.querySelector('#login');
$login.addEventListener('click', async function(e) {
    e.preventDefault();

    const loginData = {
        "email" : document.querySelector('input[name="email"]').value,
        "password" : document.querySelector('input[name="password"]').value
    }

    // 유저 로그인 POST요청
    const response = await fetch(`${backend}accounts/login/`, {
        headers: {
            'Content-type' : 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(loginData),
    })
    
    // 실패 시 실패이유를 띄워주고 새로고침
    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.email || '이메일 또는 패스워드가 틀렸습니다.');
        return window.location.reload(); 
    }

    // 성공 시 로컬스토리지에 access token, refresh token 저장
    const res = await response.json();
    localStorage.setItem('access', res.access_token);
    localStorage.setItem('refresh', res.refresh_token);
    
    // next 파라미터가 있을 시 그 페이지로 이동, 없으면 홈으로 이동
    const urlParams = new URLSearchParams(window.location.search);
    const nextPage = urlParams.get('next');
    if (nextPage) {
        window.location.replace(frontend + nextPage);
    } else {
        window.location.replace(frontend);
    }
});