import axios from 'axios';
import router from '@/router/index.js';

// Axios 인스턴스를 생성 (필요에 따라 baseURL 설정)
const api = axios.create({
    baseURL: 'https://www.csatmaker.site/api',  // 백엔드 API URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios 인터셉터 설정
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('jwt');

        // 토큰이 있을 경우 Authorization 헤더에 추가
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 처리)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('jwt'); // 유효하지 않은 JWT 제거
            router.push('/'); // 메인 페이지로 이동
        }
        return Promise.reject(error);
    }
);

// 토큰 만료 처리 함수
function handleTokenExpiration() {

    sessionStorage.removeItem('jwt');

    // 로그인 페이지로 리다이렉션
    router.push('/signIn').then(() => {
        // 선택적으로 만료 알림 메시지를 보여줄 수 있음
        alert('시간이 지나 자동 로그아웃 되었습니다. 다시 로그인 해주세요.');
    });
}

export default api;
