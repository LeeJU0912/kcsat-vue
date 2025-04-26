import api from '@/services/api';

export async function fetchRankedQuestions() {
    const response = await api.get('/community/question/open/weekly');
    return response.data;
}