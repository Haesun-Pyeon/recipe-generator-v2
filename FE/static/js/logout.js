import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('logout.js 연결');

const token = await getToken();
const $logout = document.querySelector('#logout');

$logout.addEventListener('click', async function (e){
    e.preventDefault();
    logout();
});

// 유저 로그아웃 POST 요청
async function logout() {
    const response = await fetch(`${backend}accounts/logout/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type' : 'application/json',
        },
        method: 'POST',
    })
    const res = await response.json();
    // 로컬스토리지의 토큰정보도 비움
    localStorage.clear();
    alert(res.detail);
    window.location.replace(frontend);
}