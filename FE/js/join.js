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
    console.log("response: ", res);
    localStorage.setItem('access', res.access_token);
    localStorage.setItem('refresh', res.refresh_token);

    window.location.replace(frontend);
});