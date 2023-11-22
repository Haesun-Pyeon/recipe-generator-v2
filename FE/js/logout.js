import { backend } from "./url.js";
import { frontend } from "./url.js";
console.log('logout.js 연결');

const $logout = document.querySelector('#logout');
const token = localStorage.getItem('access_token')

if (!token){
    $logout.setAttribute('style', 'display: none;');
}

$logout.addEventListener('click', async function (e){
    e.preventDefault();
    logout();
});

// 로그아웃은 굳이 안보내고 로컬스토리지 토큰만 삭제해도 되긴함..
async function logout() {
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