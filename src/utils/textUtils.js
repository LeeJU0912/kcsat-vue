// 문제 제목을 30자까지만 표시하고 '...'을 붙이는 함수
export function truncateText(text, maxLength) {
    if (typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export const formatDate = (dateInput) => {
    if (!dateInput) return '';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export function formatDateString(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}