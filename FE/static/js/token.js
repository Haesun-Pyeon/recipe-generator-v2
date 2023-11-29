import { backend } from "./url.js";

export async function getToken() {
    // 로컬스토리지에 저장된 토큰 가져옴
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
        return null; // 없을 시 null 리턴
    }
    
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = payload.exp;
    const now = Date.now() / 1000;

    if (now >= exp) { // 유효기간이 지났을 경우 재발급
        return await refreshToken();
    }

    return accessToken;
}

async function refreshToken() {
    // refresh 토큰을 이용하여 재발급
    const refresh = localStorage.getItem('refresh');
    const response = await fetch(`${backend}accounts/token/refresh/`, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ "refresh": refresh })
    });

    const data = await response.json();
    if (!response.ok) {
        return null; // 재발급 실패 시 null 리턴
    }

    // 성공 시 로컬스토리지에 access token 새로 저장 후 값 리턴
    localStorage.setItem('access', data.access);
    return data.access;
}