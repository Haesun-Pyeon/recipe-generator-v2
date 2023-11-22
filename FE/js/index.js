import { backend } from "./url.js";
import { frontend } from "./url.js";

const token = localStorage.getItem('access_token')

if (token){
    showLogin()
    // 로그인 O -> 로그아웃, (마이페이지), 추천받기, 불러오기 버튼
} else {
    alert('로그인X 상태')
    // 로그인 X -> 로그인, 회원가입 버튼
}

async function showLogin() {
    const response = await fetch(backend + 'accounts/mypage/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    const res = await response.json();
    const $data = document.getElementById('data')
    $data.innerHTML = res.message;
}

const $logout = document.querySelector('#logout');
$logout.addEventListener('click', e => logout(e));

// 로그아웃은 굳이 안보내고 로컬스토리지 토큰만 삭제해도 되긴함..
async function logout(e) {
    e.preventDefault();
    const response = await fetch(backend + "accounts/logout/", {
        headers: {
            'Content-type' : 'application/json',
        },
        method: 'POST',
    })
    const res = await response.json();
    localStorage.removeItem('access_token');
    alert(res.detail);
    window.location.href = frontend
}