import { backend, frontend } from "./url.js";
import { getToken } from "./token.js";
console.log('logout.js 연결');

const token = await getToken();
const $logout = document.querySelector('#logout');

if (!token){
    $logout.setAttribute('style', 'display: none;');
}

$logout.addEventListener('click', async function (e){
    e.preventDefault();
    logout();
});

async function logout() {
    const response = await fetch(backend + "accounts/logout/", {
        headers: {
            'Content-type' : 'application/json',
        },
        method: 'POST',
    })
    const res = await response.json();
    localStorage.clear();
    alert(res.detail);
    window.location.href = frontend
}