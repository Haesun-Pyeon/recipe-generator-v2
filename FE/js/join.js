import { backend, frontend } from "./url.js";
console.log('join.js 연결');

const $join = document.querySelector('#join');
$join.addEventListener('click', async function (e) {
    e.preventDefault();

    const joinData = {
        "email" : document.querySelector('input[name="email"]').value,
        "password1" : document.querySelector('input[name="password"]').value,
        "password2" : document.querySelector('input[name="password2"]').value
    }

    // 유저 데이터 생성 POST요청
    const response = await fetch(`${backend}accounts/join/`, {
        headers: {
            'Content-type' : 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(joinData),
    })

    // 실패 시 실패이유를 띄워주고 새로고침
    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.email || errorData.password1 || '이메일 또는 패스워드가 올바르지 않습니다.');
        window.location.reload(); 
    }

    // 성공 시 로컬스토리지에 access token, refresh token 저장
    const res = await response.json();
    localStorage.setItem('access', res.access_token);
    localStorage.setItem('refresh', res.refresh_token);

    alert('회원가입이 완료되었습니다.');
    window.location.replace(frontend);
});