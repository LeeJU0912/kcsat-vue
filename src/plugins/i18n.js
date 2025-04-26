// src/i18n.js
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    locale: 'ko', // 기본 언어 설정
    fallbackLocale: 'en', // fallback 언어
    messages: {}, // 빈 메시지 객체, 페이지별로 동적 로드
});

// 페이지별로 번역 파일을 동적 로드하는 함수
export const loadLocaleMessages = async (locale, page) => {
    const messages = await import(`./locales/${locale}/${page}.json`);
    i18n.global.setLocaleMessage(locale, { [page]: messages.default });
    i18n.global.locale = locale; // 언어 설정 변경
};

export default i18n;
