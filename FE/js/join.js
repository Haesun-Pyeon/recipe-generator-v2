import { backend } from "./url.js";
import { frontend } from "./url.js";

const $join = document.querySelector('#join');
$join.addEventListener('click', async function (e) {
    e.preventDefault();

    const joinData = {
        "email" : document.querySelector('input[name="email"]').value,
        "password1" : document.querySelector('input[name="password"]').value,
        "password2" : document.querySelector('input[name="password2"]').value
    }

    const response = await fetch(backend + "accounts/join/", {
        headers: {
            'Content-type' : 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(joinData),
    })

    if(!response.ok) {
        const errorData = await response.json();
        alert(errorData.email || errorData.password1 || '이메일 또는 패스워드가 올바르지 않습니다.');
        return window.location.reload(); 
    }

    const res = await response.json();
    console.log("response: ", res)
    localStorage.setItem('access_token', res.access_token)

    window.location.href = frontend;
});