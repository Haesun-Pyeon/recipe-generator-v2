import { backend } from "./url.js";
import { frontend } from "./url.js";

const $login = document.querySelector('#login');
$login.addEventListener('click', async function(e) {
    e.preventDefault();

    const loginData = {
        "email" : document.querySelector('input[name="email"]').value,
        "password" : document.querySelector('input[name="password"]').value
    }

    const response = await fetch(backend + "accounts/login/", {
        headers: {
            'Content-type' : 'application/json',
        },
        method:'POST',
        body:JSON.stringify(loginData),
    })
    
    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || '로그인에 실패했습니다!');
        return
    }

    const res = await response.json();
    console.log("response:", res.message)

    // const access_token = res.token.access
    // localStorage.setItem('access_token', access_token)

    // const base64Url = access_token.split('.')[1];
    // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));

    // localStorage.setItem("payload", jsonPayload);

});
