import { backend } from "./url.js";
import { frontend } from "./url.js";
console.log('login.js 연결');

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
        credentials: 'include',
        method:'POST',
        body: JSON.stringify(loginData),
    })
    
    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.email || '이메일 또는 패스워드가 틀렸습니다.');
        return window.location.reload(); 
    }

    const res = await response.json();
    console.log("response: ", res);
    localStorage.setItem('access_token', res.access_token);

    window.location.href = frontend;
});
