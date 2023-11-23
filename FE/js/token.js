import { backend } from "./url.js";

export async function getToken() {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
        return null;
    }
    
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = payload.exp;
    const now = Date.now() / 1000;

    if (now >= exp) {
        return await refreshToken();
    }

    return accessToken;
}

async function refreshToken() {
    const refresh = localStorage.getItem('refresh');
    const response = await fetch(backend + 'accounts/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "refresh": refresh })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error('Token refresh failed');
    }

    localStorage.setItem('access', data.access);
    return data.access;
}