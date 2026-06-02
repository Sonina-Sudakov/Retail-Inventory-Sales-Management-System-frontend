// utils/jwt.ts

import { jwtDecode } from 'jwt-decode';

export function getRole() {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return null;
    }

    const payload: any = jwtDecode(token);

    return payload.role;
}

export function getShopId() {
    const token = localStorage.getItem('access_token')

    if (!token) {
        return null;
    }

    const payload: any = jwtDecode(token)

    return payload.shop_id
}

export function getUserId() {
    const token = localStorage.getItem('access_token')

    if (!token) {
        return null;
    }

    const payload: any = jwtDecode(token)

    return payload.sub
}
