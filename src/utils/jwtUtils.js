import {jwtDecode} from "jwt-decode";

export function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);  // JWT 디코딩
        const exp = decoded.exp;  // 만료 시간 (초 단위)

        return Date.now() >= exp * 1000;  // 현재 시간과 만료 시간 비교
    } catch (error) {
        console.error('Invalid JWT:', error);
        return true;  // 오류 발생 시 만료된 것으로 간주
    }
}
